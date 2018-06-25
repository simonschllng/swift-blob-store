var debug = require('debug')('swift-blob-store');
const { Transform } = require('stream');
const kSource = Symbol('source');

function SwiftBlobStore(opts) {
  if (!(this instanceof SwiftBlobStore)) return new SwiftBlobStore(opts);
  opts = opts || {};
  if (!opts.client) throw Error("SwiftBlobStore client option required");
  if (!opts.container) throw Error("SwiftBlobStore container option required");
  this.accessKey = opts.accessKey;
  this.secretKey = opts.secretKey;
  this.container = opts.container;
  this.swift = opts.client;
}

SwiftBlobStore.prototype.createReadStream = function(opts) {
  if (typeof opts === 'string') opts = {key: opts}
  var config = { client: this.swift, params: this.downloadParams(opts) };
  if (opts.concurrency) config.concurrency = opts.concurrency;
  if (opts.chunkSize) config.chunkSize = opts.chunkSize;
  var stream = downloader(config);
  stream.read(0);
  return stream;
}


SwiftBlobStore.prototype.uploadParams = function(opts) {
  opts = opts || {};

  var params = opts.params || {};
  var filename = opts.name || opts.filename;
  var key = opts.key || filename;
  var contentType = opts.contentType;

  params.container = params.container || this.container;
  params.key = params.key || key;

  // TODO
  // if (!contentType) {
  //   contentType = filename? mime.lookup(filename) : mime.lookup(opts.key)
  // }
  if (contentType) params.ContentType = contentType;

  return params;
}

SwiftBlobStore.prototype.downloadParams = function(opts) {
  var params = this.uploadParams(opts);
  delete params.ContentType;
  return params;
}


SwiftBlobStore.prototype.createWriteStream = function(opts, cb) {
  if (typeof opts === 'string') opts = {key: opts}
  var params = this.uploadParams(opts)

  stream = new Transform()
  stream._transform = function (chunk,encoding,done)
  {
      this.push(chunk)
      done()
  }

  stream.on('error', function (err) {
    debug('got err %j', err);
    return cb && cb(err)
  })
  stream.on('finish', function () {
    debug('uploaded');
    cb && cb(null, { key: params.key })
  })

  this.swift.container(this.container).create(params.key, stream);

  return stream;
}

SwiftBlobStore.prototype.remove = function(opts, done) {
  var key = typeof opts === 'string' ? opts : opts.key
  this.swift.deleteObject({ container: this.container, Key: key }, done)
  return this;
}

SwiftBlobStore.prototype.exists = function(opts, done) {
  if (typeof opts === 'string') opts = {key: opts}
  this.swift.headObject({ container: this.container, Key: opts.key }, function(err, res){
    if (err && err.statusCode === 404) return done(null, false);
    done(err, !err)
  });
}

module.exports = SwiftBlobStore;

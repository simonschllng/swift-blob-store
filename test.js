
var SwiftClient = require('openstack-swift-client');
var blobTests = require('abstract-blob-store/tests');
var test = require('tape');
var swift = require('./');

var client = new SwiftClient({
  endpointUrl: process.env.ENDPOINT_URL,
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  domainId: process.env.DOMAIN_ID,
  projectId: process.env.PROJECT_ID
})

var store = swift({
  client: client,
  container: process.env.SWIFT_CONTAINER
})

var common = {
  setup: function(t, cb) {
    cb(null, store)
  },
  teardown: function(t, store, blob, cb) {
    if (blob) store.remove(blob, cb)
    else cb()
  }
}

blobTests(test, common);

test('works without callback', function(t){
  t.plan(1);
  var writer = store.createWriteStream({ key: 'test5.txt' });
  writer.write("abc");
  writer.end();

  writer.on('error', function(ee){
    t.error(e)
  });

  writer.on('finish', function(){
    t.ok(true);
  });
});

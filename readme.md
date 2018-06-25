
# swift-blob-store

  Openstack Swift [abstract-blob-store](http://npmrepo.com/abstract-blob-store)

  [![blob-store-compatible](https://raw.githubusercontent.com/maxogden/abstract-blob-store/master/badge.png)](https://github.com/maxogden/abstract-blob-store)

## Installation

  Install with npm **TODO**

    $ npm install swift-blob-store

## Example

```js
const SwiftClient = require('openstack-swift-client');

const swift = new SwiftClient(new SwiftClient.KeystoneV3Authenticator(credentials));
const store = SwiftBlobStore({
  client: swift,
  container: "my-container-name"
});


// write to swift
fs.createReadStream('/tmp/somefile.txt')
  .pipe(store.createWriteStream({ key: 'somefile.txt' }))


// read from swift
store.createReadStream({ key: 'somefile.txt' })
  .pipe(fs.createWriteStream('/tmp/somefile.txt'))

// exists
store.exists({ key: 'somefile.txt' }, function(err, exists){
})
```

## API

### var swift = require('swift-blob-store')(options)

`options` must be an object that has the following properties:

`client`: an `require('openstack-swift-client')` instance
`container`: your container name

### swift.createWriteStream(opts, cb)

returns a writable stream that you can pipe data to.

`opts` should be an object that has options `key` (will be the filename in
your container)

`opts.params` **TODO**

`cb` will be called with `(err)` if there is was an error

### swift.createReadStream(opts)

opts should be `{key: string (usually a hash or path + filename}`

`opts.params` **TODO**
`opts.concurrency` **?? TODO**
`opts.chunkSize` **?? TODO**

returns a readable stream of data for the file in your container whose key matches

## License

    The MIT License (MIT)

    Copyright (c) 2018 Simon Schilling
    Copyright (c) 2014 William Casarin

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.

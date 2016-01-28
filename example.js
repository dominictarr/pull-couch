var pull = require('pull-stream')
var toPull = require('stream-to-pull-stream')
var request = require('request')
var Couch = require('./')

pull(
  toPull.source(request('https://skimdb.npmjs.com/registry/_all_docs')),
  Couch(function (header) {
    //the headers are pased to this cb
    console.log('header', header)
  }),

  //the rest of the data is streamed out.
  pull.drain(console.log)
)


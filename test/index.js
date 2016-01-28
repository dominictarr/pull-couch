var pull = require('pull-stream')
var split = require('pull-randomly-split')
var data = require('./data.json')
var path = require('path')
var fs = require('fs')
var b = fs.readFileSync(path.join(__dirname, 'data.json'))

var Couch = require('../')

var headers

require('tape')('parsed data matches couch', function (t) {

  pull(
    pull.once(b),
    split(),
    Couch(function (_headers) {
      headers = _headers
      console.log(headers)
    }),
    pull.collect(function (err, rows) {
      t.deepEqual(rows, data.rows)
      delete data.rows
      t.deepEqual(headers, data)
      t.end()
    })
  )

})

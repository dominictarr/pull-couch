var pull = require('pull-stream')
var utf8 = require('pull-utf8-decoder')
var split = require('pull-split')

module.exports = function (onHeader) {
  var stream
  return stream = pull(
    utf8(),
    //couchdb outputs {rows:[..]}
    //and each now ends with ",\r" so just match that
    //and dump the extra bits.
    split(/\r+/),
    //filter first and last lines.
    //this is much faster than a valid json parser...
    pull.map(function (line) {
      var last = line[line.length - 1]
      if(last == ',')
        return line.substring(0, line.length - 1)
      else if(line[0] === '{' && last === '}')
        return line
      else if(last == '[') {
        var header = JSON.parse(line + ']}')
        delete header.rows
        stream.header = header
        if(onHeader) onHeader(stream.header)
      }
    }),
    pull.filter(Boolean),
    pull.map(JSON.parse)
  )
}







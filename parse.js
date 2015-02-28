var parseString = require('xml2js').parseString,
    fs = require('fs')

fs.readFile('../Test Project 1 XML.xml', 'utf8', function(err, data) {
  if (err) throw err
  parseString(data, function (err, parsedData) {
    if (err) throw err
    var tasks = parsedData.Project.Tasks[0].Task
    tasks.forEach(function (task) {
      cleanUpXmlObject(task)
      console.log(task)
    })
  })
})

var timesRe = /^PT(\d+)H(\d+)M(\d+)S$/
var floatRe = /^(\d+)\.(\d+)$/

function cleanUpXmlObject(valueWithProps) {
  for (var key in valueWithProps) {
    if (!valueWithProps.hasOwnProperty(key)) continue
    var value = valueWithProps[key]
    if (Array.isArray(value)) {
      if (value.length == 1) {
        value = value[0]
        if (key === 'PredecessorLink') {
          cleanUpXmlObject(value)
        } else {
          var intValue = parseInt(value)
          if (!isNaN(intValue) && '' + intValue === value) {
            value = intValue
          } else {
            var floatParts = floatRe.exec(value)
            if (floatParts) {
              value = parseFloat(value) 
            } else {
              var times = timesRe.exec(value)
              if (times) {
                value = parseInt(times[1]) * 3600 + parseInt(times[2]) * 60 + parseInt(times[3])
              } else {
                var date = Date.parse(value)
                if (date) {
                  value = date
                }
              }          
            }
          }
        }
        valueWithProps[key] = value
      }
    }
  }
}

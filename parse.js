var parseString = require('xml2js').parseString,
    fs = require('fs'),
    util = require('util')

    // pattern matches
    timesRe = /^PT(\d+)H(\d+)M(\d+)S$/,
    floatRe = /^(\d+)\.(\d+)$/,
    period = /\./

module.exports = {
  parseXml: parseXml,
  _dump: _dump
}

function parseXml(fileName, callback) {
  var db = {}

  fs.readFile(fileName, 'utf8', function(err, data) {
    if (err) {
      return callback(err)
    }
    parseString(data, function (err, parsedData) {
      if (err) throw err
      var project = parsedData.Project
      project.Tasks = project.Tasks[0].Task
      project.Resources = project.Resources[0].Resource
      project.Assignments = project.Assignments[0].Assignment
      project.Calendars = {}
      cleanUpXmlObject(project)
      //console.log(project)
      // _dump(db)
      project.Assignments.forEach(function(assignment) {
        // _dump(assignment)
        var task = db.Tasks[assignment.TaskUID]
        var resource = db.Resources[assignment.ResourceUID]
        if (task && resource) {
          // _dump(resource)
          task._owner = resource.Name
          console.log('task', task.UID, task.Name, '→', resource.UID, task._owner)
        }
      })
      callback(null, db)
    })
  })

  function addModel(name, value) {
    if (!value.Name) {
      return
    }
    var collection = db[name]
    if (!collection) {
      collection = db[name] = {}
    }
    collection[value.UID] = value
  }

  /* Don't judge me, I am hacking */
  function cleanUpXmlObject(valueWithProps) {
    for (var key in valueWithProps) {
      if (!valueWithProps.hasOwnProperty(key)) continue
      var value = valueWithProps[key]
      if (Array.isArray(value)) {
        if (value.length == 1) {
          value = value[0]
        } else {
          value.forEach(function (child) {
            cleanUpXmlObject(child)
            if (child.UID) {
              addModel(key, child)
            }
          })
          continue
        }
      }

      if (key === 'PredecessorLink') {
        cleanUpXmlObject(value)
        value = [value]
      } if (key === 'OutlineNumber' || key === 'WBS') {
        value = value.split(period)
      } else {
        var intValue = parseInt(value)
        if (!isNaN(intValue) && '' + intValue === value) {
          // console.log(valueWithProps.UID, ':', key, '=', value)
          value = intValue
        } else {
          var floatParts = floatRe.exec(value)
          if (floatParts) {
            value = parseFloat(parseFloat(floatParts[1]) + '.' + parseFloat(floatParts[2]))
            // console.log('FLOAT', key, ':', value)
          } else {
            var times = timesRe.exec(value)
            if (times) {
              value = parseInt(times[1]) * 3600 + parseInt(times[2]) * 60 + parseInt(times[3])
            }        
          }
        }
      }
      valueWithProps[key] = value
    }
  }

}

function _dump(value) {
  console.log(util.inspect(value, { showHidden: true, depth: null, colors: true }))
}

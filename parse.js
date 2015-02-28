var parseString = require('xml2js').parseString,
    fs = require('fs')

fs.readFile('../Test Project 1 XML.xml', 'utf8', function(err, data) {
  if (err) throw err
  parseString(data, function (err, parsedData) {
    if (err) throw err
    console.log(parsedData.Project.Tasks[0].Task)
    // console.log(parsedData.Project.Title)
    // result.Project.Tasks.forEach(function (task))
  })
})

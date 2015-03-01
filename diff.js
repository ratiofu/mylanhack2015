var parse = require('./parse.js'),
    path = './_spaces/',
    fs = require('fs')

module.exports = {
  compareCurrentAndNewProject: compareCurrentAndNewProject
}

function compareCurrentAndNewProject(listener, rootPath, spaceId) {
  var existingProject = { Tasks: {} },
      basePath = rootPath + '/' + spaceId + '/'
      existingPath = basePath + 'current.xml'
  if (fs.existsSync(existingPath)) {
    console.log('PARSING EXISTING', existingPath)
    parse.parseXml(existingPath, function (err, data) {
      if (err) throw err
      existingProject = data
      parseNew()
    })
  } else {
    parseNew()
  }

  function parseNew() {
    var newPath = basePath + 'new.xml'
    parse.parseXml(newPath, function (err, data) {
      if (err) throw err
      compareTasks(existingProject, data, listener)
    })
  }
}

function compareTasks(existingProject, newProject, listener) {
  // parse._dump(newProject)
  var existingTasks = existingProject.Tasks,
      newTasks = newProject.Tasks

  // delete tasks from Jive that are not in the project anymore
  // and update new tasks with a reference to the old task definition
  for (var uid in existingTasks) {
    if (!existingTasks.hasOwnProperty(uid)) continue
    var existingTask = existingTasks[uid],
        newTask = newTasks[uid]
    if (newTask) {
      if (JSON.stringify(newTask) !== JSON.stringify(existingTask)) {
        listener.updateTask(newTask)        
      }
      newTask._exists = true
    } else {
      listener.deleteTask(existingTask)
    }
  }
  
  for (var uid in newTasks) {
    if (!newTasks.hasOwnProperty(uid)) continue
    var newTask = newTasks[uid]
    if (!newTask._exists) {
      listener.createTask(newTask)
    }
  }

}


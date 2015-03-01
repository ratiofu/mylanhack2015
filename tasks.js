var parse = require('./parse.js'),
    fs = require('fs'),
    path = require('path'),
    // place ID → task UID → Jive Task ID
    mappingsDb = {}

module.exports = {
  compareCurrentAndNewProject: compareCurrentAndNewProject,
  getJiveIdForTaskUid: getId,
  putJiveIdForTaskUid: putId    
}

function compareCurrentAndNewProject(listener, rootPath, placeId) {
  var existingProject = { Tasks: {} },
      basePath = rootPath + '/' + placeId + '/'
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

function getId(placeId, taskUid) {
  var mappings = ensureDb(placeId)
  return mappings[taskUid]
}

function putId(placeId, taskUid, jiveTaskId) {
  var mappings = ensureDb(placeId)
  mappings[taskUid] = jiveTaskId
  fs.writeFileSync(getPath(placeId), JSON.stringify(mappings))
}

function ensureDb(placeId) {
  var mappings = mappingsDb[placeId]
  if (mappings) {
    return mappings
  }
  var path = getPath(placeId)
  if (!fs.existsSync(path)) {
    console.log('writing empty mappings file', path)
    fs.writeFileSync(path, '{}')
  }
  mappings = require(path)
  return mappingsDb[placeId] = mappings
}

function getPath(placeId) {
  return path.normalize(__dirname + '/db/_places/' + placeId + '/mappings.json')
}
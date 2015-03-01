var diff = require('./diff.js'),
    path = './_spaces/',
    fs = require('fs')

var jiveTaskApi = {
  createTask: function(task) { console.log('CREATE', task.UID, task.Name) },
  deleteTask: function(task) { console.log('DELETE', task.UID, task.Name) },
  updateTask: function(task) { console.log('UPDATE', task.UID, task.Name) }
}

diff.compareCurrentAndNewProject(jiveTaskApi, path, 1001)

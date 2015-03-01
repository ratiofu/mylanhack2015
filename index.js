var tasks = require('./tasks.js'),
    path = './db/_places/',
    fs = require('fs')

/* tests */

var jiveTaskApi = {
  createTask: function(task) { console.log('CREATE', task.UID, task.Name) },
  deleteTask: function(task) { console.log('DELETE', task.UID, task.Name) },
  updateTask: function(task) { console.log('UPDATE', task.UID, task.Name) }
}

tasks.compareCurrentAndNewProject(jiveTaskApi, path, 1001)

now = Date.now()
then = now - 1111111111
console.log(then, now)
tasks.putJiveIdForTaskUid(1001, 'UID-' + then, 'Jive-' + now)
mapped = tasks.getJiveIdForTaskUid(1001, 'UID-' + then)
console.log(mapped)

var jive = require("jive-sdk"),
    tasks = require('../../../tasks.js')

exports.task = [
    {
        'interval' : 10000,
        'handler' : pushData
    }
];

/**
 * Defines event handlers for the tile life cycle events
 */
exports.eventHandlers = [

    // process tile instance whenever a new one is registered with the service
    {
        'event' : jive.constants.globalEventNames.NEW_INSTANCE,
        'handler' : processTileInstance
    },

    // process tile instance whenever an existing tile instance is updated
    {
        'event' : jive.constants.globalEventNames.INSTANCE_UPDATED,
        'handler' : processTileInstance
    }
];

function pushData() {
    jive.tiles.findByDefinitionName('upcoming-tasks')
      .then(function(instances) {
        if (instances) {
            instances.forEach(processTileInstance);
        }
      })
      .fail(function(error) {
        jive.logger.error(error);
      });
}

function processTileInstance(instance) {
    /* console.log(instance)
    var placeId = /.+v3\/places\/(\d+)/.exec(instance.config.parent)
    if (!placeId) {
        return
    }
    placeId = placeId[1]
    var jiveTaskApi = {
      createTask: function(task) { console.log('CREATE', task.UID, task.Name) },
      deleteTask: function(task) { console.log('DELETE', task.UID, task.Name) },
      updateTask: function(task) { console.log('UPDATE', task.UID, task.Name) }
    }

    tasks.compareCurrentAndNewProject(jiveTaskApi, './db/_places', placeId)
    jive.service.community.findByCommunity(instance.jiveCommunity).then(function (community) {
        console.log(community)
        process.exit(0)
    })
    .done(process.exit)
    */
    var message = "test message",
        status = "test status";
    var dataToPush = {
        data: {
            title: "Upcoming Tasks",
            message: message,
            status: status,
            contents : [ {
                text : "Milestone #1",
                action: {
                    "text": "Action",
                    "url": "https://jivesoftware-msproject.jivelandia.com/tasks/1002"
                }                
            },
            {
                text : "Milestone #5",
                action: {
                    "text": "Action",
                    "url": "https://jivesoftware-msproject.jivelandia.com/tasks/1003"
                }                
            },
            {
                text : "Launch",
                action: {
                    "text": "Action",
                    "url": "https://jivesoftware-msproject.jivelandia.com/tasks/1004"
                }                
            }]
        }
    };
    jive.tiles.pushData(instance, dataToPush);
}

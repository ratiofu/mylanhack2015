var jive = require("jive-sdk")

exports.task = [
    {
        'interval' : 5000,
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
      .then( function(instances) {
        if (instances) {
            instances.forEach(processTileInstance);
        }
      })
      .fail(function(error) {
        jive.logger.error(error);
      });
}

function processTileInstance(instance) {
    var message = "test message",
        status = "test status";
    var dataToPush = {
        data: {
            title: "Upcoming Tasks",
            message: message,
            status: status,
            contents : [ {
                text : "(upload project to see tasks)"
            } ]
        }
    };
    jive.tiles.pushData(instance, dataToPush);
}

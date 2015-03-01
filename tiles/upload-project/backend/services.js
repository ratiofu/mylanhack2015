var jive = require("jive-sdk")

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
    jive.tiles.findByDefinitionName('upload-project')
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
    var dataToPush = {
        data: {
            title : "Upload MS Project",
            contents : [ {
                text : "Upload an MS Project XML Export File",
                action: {
                    text: "Action",
                    url: jive.service.serviceURL() + "/upload-project/action",
                    context: { dummy: 'value' }
                }
            } ],
        }
    };
    jive.tiles.pushData(instance, dataToPush);
}

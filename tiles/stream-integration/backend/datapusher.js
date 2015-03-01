/*
 * Copyright 2013 Jive Software
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

var jive = require("jive-sdk");

exports.task = [
    {
        'interval' : 30000,
        'handler' : pushData
    }
];

function pushData() {
  jive.extstreams.findByDefinitionName('stream-integration')
    .then(function(instances) {
      if (instances) {
        instances.forEach(processTileInstance);
      }
    })
    .fail(function(error) {
      jive.logger.error(error);
    });
};

function processTileInstance(instance) {
    var data = getFormattedData(1, instance);
    jive.logger.info(
        "pushing %s to activity stream %s, access token %s",
        JSON.stringify(data), instance.id, instance.accessToken);
    jive.extstreams.pushActivity(instance, data);
}

function getFormattedData(count, instance) {
  return {
    "activity": {
      "action": {
        "name": "posted",
        "description": "Tasks overdue " + count
      },
      "actor": {
        "name": "Project Manager",
        "email": "projects@mylan.com"
      },
      "object": {
        "type": "website",
        "url": "https://jivesoftware-msproject.jivelandia.com/tasks/1001",
        "image": "http://placehold.it/102x102",
        "title": "This task is us overdue",
        "description": "Please follow up on the task"
      },
      "externalID": '' + instance.id + ':' + Date.now()
    }
  };
}

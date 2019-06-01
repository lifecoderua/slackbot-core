const { createServer } = require('http');

const conf = require('./config');
const AWS = require('aws-sdk');

// may be updated on the fly
const region = 'us-west-2';
AWS.config.update({region});

const crazyPayload = require('./app/crazy-payload');
const clusterManagementPayload = require('./app/cluster-management-config');
const clusterManagementNotification = require('./app/cluster-management-notification');
const clusterManagementDelete = require('./app/cluster-management-delete');

const port = process.env.PORT || 3000;

const { createEventAdapter } = require('@slack/events-api');
const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET);

const { createMessageAdapter } = require('@slack/interactive-messages');
const slackInteractions = createMessageAdapter(process.env.SLACK_SIGNING_SECRET);

const { WebClient } = require('@slack/web-api');
const web = new WebClient(process.env.SLACK_TOKEN);

const talker = require('./app/talker');

slackEvents.on('app_mention', async (event) => {
  console.log(`Received a message event: user ${event.user} in channel ${event.channel} says ${event.text}`);
  await postMessage(event.channel, `<@${event.user}>, I've seen you did \`abcdefg\` last summer!`);
});

// Handle errors (see `errorCodes` export)
slackEvents.on('error', console.error);

async function postMessage(conversationId, message) {
  const res = await web.chat.postMessage({ channel: conversationId, /*text: message,*/ blocks: crazyPayload });
  console.log('Message sent: ', res.ts);
}

slackInteractions.action({}, async (payload, respond) => {
  console.log('payload', payload);
  // respond after processing
  
  response = await handleInteraction(payload);
  if (response) { 
    respond(response);
  }

  // return for immediate response
  return { text: 'Processing...' };
});

 
createServer(function(request, response){
  switch(request.url) {
    case '/slack/events':
      return slackEvents.requestListener()(request,response);
    case '/slack/messages':
      return slackInteractions.requestListener()(request, response);
    default:
      console.log('Unexpected input', request.url);
  }
}).listen(port);


async function handleInteraction(payload) {
  // const userInfo = await web.users.info({ user: payload.user.id });
  // console.log(userInfo);
  // tz: 'Europe/Helsinki',
  // tz_label: 'Eastern European Summer Time',
  // tz_offset: 10800,

  // payload.trigger_id: '627102488930.2536167343.7fa66cdb9989559684d0ecfbde5ef7c3',
  // >> await for SQS response with this id


  // payload.user.id > 'UFHT37DJN' > who triggered
  // payload.actions[0].value > '[ClusterManager]SelectCluster'
  
  // TODO: real communications
  const x = await talker.broadcastAndExpectResponse(payload);
  console.log('>>>>>>>>>>>>>>>>>>>>>>> response caught', x);
return x;
  // { text: 'SomeTextHere', ... } if text only is required
  if (payload.actions[0].value === '[ClusterManager]SelectCluster') {
    return { blocks: clusterManagementPayload, replace_original: true };
  }

  if (payload.actions[0].value === '[ClusterManager]ConfigDone') {
    return { blocks: clusterManagementNotification, replace_original: true };
  }

  switch (payload.actions[0].value) {
    case '[ClusterManager]SelectCluster': 
      return { blocks: clusterManagementPayload, replace_original: true };
    case '[ClusterManager]ConfigDone': 
      return { blocks: clusterManagementPayload, replace_original: true };
    case '[ClusterManager]DeleteCluster': 
      return { blocks: clusterManagementDelete, replace_original: true };
    case '[UplinksManager]DiscoverUplinks': 
      return { blocks: require('./app/discover-uplinks'), replace_original: true };
  }

  console.log('+', payload.actions[0].selected_option.value, payload.actions[0].selected_option.value.contains('[r'))
  if (payload.actions[0].selected_option && payload.actions[0].selected_option.value.contains('[r')) {
    return { blocks: clusterManagementDelete, replace_original: true };
  }

  // return { text: 'Processing complete.', replace_original: true };
}
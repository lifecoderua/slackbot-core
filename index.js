const { createServer } = require('http');

const conf = require('./config');
const crazyPayload = require('./app/crazy-payload');
const clusterManagementPayload = require('./app/cluster-management-config');
const clusterManagementNotification = require('./app/cluster-management-notification');
const port = process.env.PORT || 3000;

const { createEventAdapter } = require('@slack/events-api');
const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET);

const { createMessageAdapter } = require('@slack/interactive-messages');
const slackInteractions = createMessageAdapter(process.env.SLACK_SIGNING_SECRET);

const { WebClient } = require('@slack/web-api');
const web = new WebClient(process.env.SLACK_TOKEN);



slackEvents.on('app_mention', async (event) => {
  console.log(`Received a message event: user ${event.user} in channel ${event.channel} says ${event.text}`);
  await postMessage(event.channel, `<@${event.user}>, I've seen you did \`abcdefg\` last summer!`);
});

// Handle errors (see `errorCodes` export)
slackEvents.on('error', console.error);

async function postMessage(conversationId, message) {
  const res = await web.chat.postMessage({ channel: conversationId, text: message, blocks: crazyPayload });
  console.log('Message sent: ', res.ts);
}


slackInteractions.action({ type: 'button' }, async (payload, respond) => {
  console.log('payload', payload);
  // respond after processing
  
  console.log('>>>zzz>>>')
  response = await handleInteraction(payload);
  // response = await handleInteraction(payload);
  console.log('>>>xxx>>>')
  console.log('>>>aaa>>>', response)
  respond(response);

  // respond({ text: 'Processing complete.', replace_original: true });

  // return for immediate response
  // return { text: 'Processing...' };
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
  // payload.user.id > 'UFHT37DJN' > who triggered
  // payload.actions[0].value > '[ClusterManager]SelectCluster'
  
  // { text: 'SomeTextHere', ... } if text only is required
  if (payload.actions[0].value === '[ClusterManager]SelectCluster') {
    return { blocks: clusterManagementPayload, replace_original: true };
  }

  if (payload.actions[0].value === '[ClusterManager]ConfigDone') {
    return { blocks: clusterManagementNotification, replace_original: true };
  }
  // return { text: 'Processing complete.', replace_original: true };
}
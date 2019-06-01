const { createServer } = require('http');

const conf = require('./config');
const AWS = require('aws-sdk');

// may be updated on the fly
const region = 'us-west-2';
AWS.config.update({region});

const crazyPayload = require('./app/crazy-payload');

const port = process.env.PORT || 3000;

const { createEventAdapter } = require('@slack/events-api');
const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET);

const { createMessageAdapter } = require('@slack/interactive-messages');
const slackInteractions = createMessageAdapter(process.env.SLACK_SIGNING_SECRET);

const { WebClient } = require('@slack/web-api');
const web = new WebClient(process.env.SLACK_TOKEN);

const talker = require('./app/talker');

slackEvents.on('app_mention', async (event) => {
  await postMessage(event.channel);
});

// Handle errors (see `errorCodes` export)
slackEvents.on('error', console.error);

async function postMessage(conversationId, message) {
  return await web.chat.postMessage({ channel: conversationId, blocks: crazyPayload });
}

slackInteractions.action({}, async (payload, respond) => {
  // console.log('payload', payload);
  // respond after processing
  
  response = await handleInteraction(payload);
  if (response) { 
    respond(response);
  }
  // handleInteraction(payload).then(response => respond(response))

  // return for immediate response - doesn't work without `respond()` wrapper - doc bug?
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
  // const userInfo = await web.users.info({ user: payload.user.id });
  // console.log(userInfo);
  // tz: 'Europe/Helsinki',
  // tz_label: 'Eastern European Summer Time',
  // tz_offset: 10800,

  // payload.trigger_id: '627102488930.2536167343.7fa66cdb9989559684d0ecfbde5ef7c3',
  // >> await for SQS response with this id


  // payload.user.id > 'UFHT37DJN' > who triggered
  // payload.actions[0].value > '[ClusterManager]SelectCluster'
  
  return await talker.broadcastAndExpectResponse(payload);
  // { text: 'SomeTextHere', ... } if text only is required
  

  // return { text: 'Processing complete.', replace_original: true };
}
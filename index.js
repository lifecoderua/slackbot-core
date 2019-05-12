const { createServer } = require('http');

const conf = require('./config');
const crazyPayload = require('./app/crazy-payload');
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


slackInteractions.action({ type: 'button' }, (payload, respond) => {
  console.log('payload', payload);
  // respond after processing
  respond({ text: 'Processing complete.', replace_original: true });

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
const conf = require('./config');
const port = process.env.PORT || 3000;
const { createServer } = require('http');

const { createEventAdapter } = require('@slack/events-api');
const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET);

const { createMessageAdapter } = require('@slack/interactive-messages');
const slackInteractions = createMessageAdapter(process.env.SLACK_SIGNING_SECRET);

const { WebClient } = require('@slack/web-api');
const web = new WebClient(process.env.SLACK_TOKEN);


const crazyPayload = require('./app/crazy-payload');

slackEvents.on('app_mention', async (event) => {
  console.log(`Received a message event: user ${event.user} in channel ${event.channel} says ${event.text}`);
  await postMessage(event.channel, `<@${event.user}>, I've seen you did \`abcdefg\` last summer!`);
});

// Handle errors (see `errorCodes` export)
slackEvents.on('error', console.error);

async function postMessage(conversationId, message) {
  const res = await web.chat.postMessage({ channel: conversationId, text: message });
  const xres = await web.chat.postMessage({ channel: conversationId, text: message, blocks: crazyPayload });
  console.log('Message sent: ', res.ts);
}

// Example of handling static select (a type of block action)
// slackInteractions.action({ type: 'static_select' }, (payload, respond) => {
//   // Logs the contents of the action to the console
//   console.log('payload', payload);

//   // Send an additional message to the whole channel
//   doWork()
//     .then(() => {
//       respond({ text: 'Thanks for your submission.' });
//     })
//     .catch((error) => {
//       respond({ text: 'Sorry, there\'s been an error. Try again later.' });
//     });

//   // If you'd like to replace the original message, use `chat.update`.
//   // Not returning any value.
// });

// Example of handling attachment actions. This is for button click, but menu selection would use `type: 'select'`.
slackInteractions.action({ type: 'button' }, (payload, respond) => {
  // Logs the contents of the action to the console
  console.log('payload', payload);

  // Replace the original message again after the deferred work completes.
  // doWork()
  //   .then(() => {
  //     respond({ text: 'Processing complete.', replace_original: true });
  //   })
  //   .catch((error) => {
  //     respond({ text: 'Sorry, there\'s been an error. Try again later.',  replace_original: true });
  //   });

  respond({ text: 'Processing complete.', replace_original: true });

  // Return a replacement message
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
}).listen(3000);
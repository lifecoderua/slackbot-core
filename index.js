const conf = require('./config');

// Initialize using signing secret from environment variables
const { createEventAdapter } = require('@slack/events-api');
const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET);

// Initialize using signing secret from environment variables
// const { createMessageAdapter } = require('@slack/interactive-messages');
// const slackInteractions = createMessageAdapter(process.env.SLACK_SIGNING_SECRET);

const { WebClient } = require('@slack/web-api');

const web = new WebClient(process.env.SLACK_TOKEN);

const port = process.env.PORT || 3000;

slackEvents.on('app_mention', async (event) => {
  console.log(`Received a message event: user ${event.user} in channel ${event.channel} says ${event.text}`);
  await postMessage(event.channel, `@${event.user}, I've seen you did \`abcdefg\` last summer!`);
});

// Handle errors (see `errorCodes` export)
slackEvents.on('error', console.error);

// Start a basic HTTP server
slackEvents.start(port).then(() => {
  // Listening on path '/slack/events' by default
  console.log(`server listening on port ${port}`);
});

async function postMessage(conversationId, message) {
  const res = await web.chat.postMessage({ channel: conversationId, text: message });
  console.log('Message sent: ', res.ts);
}
const { Consumer } = require('sqs-consumer');
const AWS = require('aws-sdk');

const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

const { WebClient } = require('@slack/web-api');
const web = new WebClient(process.env.SLACK_TOKEN);


const params = {
  MessageGroupId: 'default',
  MessageDeduplicationId: 'x',//Math.random(),
  MessageBody: "Information about current NY Times fiction bestseller for week of 12/11/2016.",
  QueueUrl: process.env.BOT_OUTPUT_QUEUE,
};

class Talker {
  constructor() {
    this.expectations = {};

    const app = Consumer.create({
      queueUrl: process.env.BOT_INPUT_QUEUE,
      handleMessage: async (messageJSON) => {
        console.log('reply caught +');
        try {
          const message = JSON.parse(messageJSON.Body);
          if (message.type === 'post') {
            // {channel: channelId, text:, blocks:,}
            return await web.chat.postMessage(message.payload);
          }
          const answerFor = this.expectations[message.trigger_id];
          if (answerFor) {
            answerFor.resolve(message);
          }
        } catch(e) {
          console.error('>>> ERROR >>>', e)
        }
      }
    });
    
    app.on('error', (err) => {
      console.error(err.message);
    });
    
    app.on('processing_error', (err) => {
      console.error(err.message);
    });
    
    app.start();
  }

  async broadcastAndExpectResponse(slackInteractionPayload) {
    const reply = this.addExpectation(slackInteractionPayload);

    try {
      params.MessageDeduplicationId = Date.now().toString() + slackInteractionPayload.trigger_id,
      params.MessageBody = JSON.stringify(slackInteractionPayload);
    } catch(e) {
      console.error('WHOOPS >>>>', e);
    }
    sqs.sendMessage(params, function(err, data) {
      if (err) {
        console.log("Error", err);
      } else {
        console.log("Success", data.MessageId);
      }
    });

    return await reply;
  }

  addExpectation(slackInteractionPayload) {
    let resolve;
    const messageResponsePromise = new Promise((resolver) => {
      resolve = resolver;
    });
    this.expectations[slackInteractionPayload.trigger_id] = {
      promise: messageResponsePromise,
      resolve,
    };

    return messageResponsePromise;
  }


}

module.exports = new Talker();
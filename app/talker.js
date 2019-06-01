const { Consumer } = require('sqs-consumer');
const AWS = require('aws-sdk');

const sqs = new AWS.SQS({apiVersion: '2012-11-05'});



const params = {
  MessageGroupId: 'default',
  MessageDeduplicationId: 'x',//Math.random(),
  MessageBody: "Information about current NY Times fiction bestseller for week of 12/11/2016.",
  QueueUrl: process.env.BOT_OUTPUT_QUEUE,
};

class Talker {
  constructor() {
    // payload.trigger_id : Promise
    this.expectations = {};

    const app = Consumer.create({
      queueUrl: process.env.BOT_INPUT_QUEUE,
      handleMessage: async (messageJSON) => {
        console.log(messageJSON);
        try {
          const message = JSON.parse(messageJSON.Body);
          console.log('EXPECTS', this.expectations);
          const answerFor = this.expectations[message.trigger_id];
          console.log('MSG FOR:', answerFor);
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

    console.log('********* 0');
    const reply = this.addExpectation(slackInteractionPayload);
    console.log('********* 1');

    try {
      params.MessageDeduplicationId = slackInteractionPayload.trigger_id + Math.random().toString(),
      params.MessageBody = JSON.stringify(slackInteractionPayload);
    } catch(e) {
      console.error('WHOOPS >>>>', e);
    }
    sqs.sendMessage(params, function(err, data) {
      if (err) {
        console.log('********* 12');
        console.log("Error", err);
      } else {
        console.log('********* 13');
        console.log("Success", data.MessageId);
      }
    });

    return await reply;
  }

  addExpectation(slackInteractionPayload) {
    console.log('********* 01');
    let resolve;
    const messageResponsePromise = new Promise((resolver) => {
      resolve = resolver;
    });
    console.log('********* 02');
    this.expectations[slackInteractionPayload.trigger_id] = {
      promise: messageResponsePromise,
      resolve,
    };

    console.log('********* 03');
    return messageResponsePromise;
  }


}

module.exports = new Talker();
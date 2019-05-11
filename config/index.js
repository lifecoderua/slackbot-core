require('dotenv').config();

module.exports = {
  slack: {
    clientId: process.env.SLACK_CLIENT_ID,
    clientSecret: process.env.SLACK_CLIENT_SECRET,
    signingSecret: process.env.SLACK_SIGNIN_SECRET,
    verificationToken: process.env.SLACK_VERITICATION_TOKEN,
  }
}
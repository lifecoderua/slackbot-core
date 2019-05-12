# Slackbot Core

Slackbot Core is the message center for a distributed application. 
It provides event and interactions handling and passing along the message bus, and send messages on behalf of logic services.

## Getting started

### Configuration

Copy `.env.example` to `.env` and supply with appropriate bot config. 
It is expected you have a Slack Bot User set up.

### Confirm endpoints

**Events:** to confirm endpoint run `./node_modules/.bin/slack-verify --secret <$SLACK_SIGNING_SECRET>`.

**Interactive Messages:** just works, no verification needede.

### Reverse SSH for local development

`$ ssh -R <preferred-subdomain>:80:localhost:3000 serveo.net`

Will spawn `<preferred-subdomain>.serveo.net` looking at your localhost:3000

Ngrok is another alternative.

### Install dependencies

`$ npm i`

### Run app

`$ npm start`
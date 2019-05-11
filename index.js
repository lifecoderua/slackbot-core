const Koa = require('koa');
const bodyParser = require('koa-bodyparser');

const conf = require('./config')


const app = new Koa();

app.use(bodyParser());

app.use(async ctx => {
  console.log(ctx.request.body);
  ctx.body = ctx.request.body.challenge; //'Hello World';
});

app.listen(3000);
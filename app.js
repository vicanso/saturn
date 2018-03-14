const Koa = require('koa');
const Router = require('koa-router');
const serve = require('koa-static-serve');
const fs = require('fs');
const path = require('path');
const {promisify} = require('util');

const config = require('./config');

const readFile = promisify(fs.readFile);

const router = new Router();
const app = new Koa();

router.get('/ping', ctx => {
  ctx.body = 'pong';
});

router.get('/', async ctx => {
  const file = path.join(config.distPath, 'index.html');
  const buf = await readFile(file);
  ctx.set('Content-Type', 'text/html; charset=utf-8');
  ctx.set('Cache-Control', 'public, max-age=60');
  ctx.body = buf;
});
app.use(
  serve(config.distPath, {
    maxAge: 72 * 60 * 60,
    sMaxAge: 600,
    dotfiles: 'allow',
    denyQuerystring: true,
    etag: false,
    lastModified: false,
    '404': 'next',
    extname: ['.html'],
  }),
);

app.use(router.routes()).use(router.allowedMethods());

console.info(`the server will listen on:${config.port}`);
app.listen(config.port);

let Koa = require('koa');
let bodyParser = require('koa-bodyparser');
let Router = require('koa-router');
let fs = require('fs');

let app = new Koa();
let router = new Router();

let api = {
  list: function(ctx, next) {
    ctx.response.type = 'json';
    ctx.body = fs.readFileSync('data/characters/list.json', 'utf8');
  },

  get: function(ctx, next) {
    let {id} = ctx.params;
    ctx.response.type = 'json';
    ctx.body = fs.readFileSync('data/characters/' + id + '.json', 'utf8');
  },

  update: function(ctx, next) {
    let {id} = ctx.params;
    let json = JSON.stringify(ctx.request.body);

    if (!ctx.request.body || json.length < 3) {
      ctx.body = 'No content received';
      return;
    }
    fs.writeFileSync('data/characters/' + id + '.json', json, 'utf8');
    ctx.body = 'Saved successfully';
  },

  metadata: function(ctx, next) {
    let {system} = ctx.params;
    ctx.response.type = 'json';
    ctx.body = fs.readFileSync('data/metadata/' + system + '.json', 'utf8');
  }
};

router.get('/characters', api.list)
  .get('/characters/:id', api.get)
  .post('/characters/:id', api.update)
  .get('/metadata/:system', api.metadata);

app.use((ctx, next) => {
  return next().then(() => {
    ctx.response.set('Access-Control-Allow-Origin', '*');
    ctx.response.set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    ctx.response.set('Access-Control-Allow-Headers',
                     'Origin, X-Requested-With, Content-Type, Accept, X-Authentication-Token, Access-Control-Request-Method');
  });
});

app.use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(8080);
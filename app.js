let Koa = require('koa');
let bodyParser = require('koa-bodyparser');
let Router = require('koa-router');
let fs = require('fs');

let app = new Koa();
let router = new Router();

let api = {
  games: function(ctx) {
    ctx.response.type = 'json';
    ctx.body = fs.readFileSync('data/games.json', 'utf8');
  },
  characters: {
    list: function(ctx) {
      let {game} = ctx.params;
      ctx.response.type = 'json';
      ctx.body = fs.readFileSync('data/characters/' + game + '/list.json', 'utf8');
    },

    get: function(ctx) {
      let {game, id} = ctx.params;
      ctx.response.type = 'json';
      ctx.body = fs.readFileSync('data/characters/' + game + '/' + id + '.json', 'utf8');
    },

    update: function(ctx) {
      let {game, id} = ctx.params;
      let json = JSON.stringify(ctx.request.body);

      if (!ctx.request.body || json.length < 3) {
        ctx.body = 'No content received';
        return;
      }
      fs.writeFileSync('data/characters/' + game + '/' + id + '.json', json, 'utf8');
      ctx.body = 'Saved successfully';
    }
  },
  metadata: function(ctx) {
    let {system} = ctx.params;
    ctx.response.type = 'json';
    ctx.body = fs.readFileSync('data/metadata/' + system + '.json', 'utf8');
  }
};

router
  .get('/games', api.games)
  .get('/:game/characters', api.characters.list)
  .get('/:game/characters/:id', api.characters.get)
  .post('/:game/characters/:id', api.characters.update)
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
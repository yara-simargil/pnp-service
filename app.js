let _ = require('koa-route');
let koa = require('koa');
let path = require('path');
let fs = require('co-fs');

let app = module.exports = koa();

let api = {
  list: function *() {
    this.body = yield fs.readFile('data/characters/list.json', 'utf8');
  },

  get: function *(id) {
    this.body = yield fs.readFile('data/characters/' + id + '.json', 'utf8');
  },

  metadata: function *(system) {
    this.body = yield fs.readFile('data/metadata/' + system + '.json', 'utf8');
  }
};

app.use(function *(next) {
  this.response.type = 'json';
  this.response.set('Access-Control-Allow-Origin', '*');
  this.response.set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  this.response.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-Authentication-Token, Access-Control-Request-Method');
  yield next;
});

app.use(_.get('/characters', api.list));
app.use(_.get('/characters/:id', api.get));
app.use(_.get('/metadata/:system', api.metadata));

app.listen(8080);
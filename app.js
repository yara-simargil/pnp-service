let _ = require('koa-route');
let koa = require('koa');
let path = require('path');
let fs = require('co-fs');

let app = module.exports = koa();

let api = {
  list: function *() {
    this.type = 'json';
    this.body = yield fs.readFile('data/characters/list.json', 'utf8');
  },

  get: function *(id) {
    this.type = 'json';
    this.body = yield fs.readFile('data/characters/' + id + '.json', 'utf8');
  },

  metadata: function *(system, type) {
    this.type = 'json';
    this.body = yield fs.readFile('data/' + system + '/charsheets/' + type + '.json', 'utf8');
  }
};

app.use(_.get('/characters', api.list));
app.use(_.get('/characters/:id', api.get));
app.use(_.get('/metadata/:system/:type', api.metadata));

app.listen(8080);
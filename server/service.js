/* eslint-disable no-unused-vars */
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./post_service');
const app = express();

app.use(express.static('public'));

const root_html_path = __dirname + '/public/html/';

//异步请求数据转发
app.all('/service', routes.postService);

app.get('/h5/', function(req, res) {
  res.sendFile(root_html_path + 'index.html');
});

app.get('/h5/404', function(req, res) {
  res.sendFile(root_html_path + '404.html');
});

// eslint-disable-next-line no-var
var server = app.listen(6565, function() {
  const host = server.address().address;
  // eslint-disable-next-line prefer-destructuring
  const port = server.address().port;

  console.log('服务器已启动，访问地址为 http://%s:%s', host, port);
});

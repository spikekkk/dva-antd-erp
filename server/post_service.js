/*
 * 异步请求数据转发
 */
const qs = require('querystring');
const http = require('http');

exports.postService = function(req, res) {
  //    console.log(req.body);
  //    req.pipe(request.post(remoteUrl, {form: req.body})).pipe(res);
  //    req.end();

  // Request of JSON data
  // 接收客户端的JSON数据
  const reqJosnData = qs.stringify(req.body);

  const postheaders = {
    'Content-Type': 'application/x-www-form-urlencoded',
    // eslint-disable-next-line no-undef
    'Content-Length': Buffer.byteLength(reqJosnData, 'utf8'),
  };
  const optionspost = {
    host: '192.168.1.22',
    port: '8080',
    path: '/omp-web/loginController/loginQRCode',
    method: 'POST',
    headers: postheaders,
  };
  const reqPost = http.request(optionspost, function(resPost) {
    resPost.on('data', function(data) {
      res.send(data);
    });
  });

  // write the json data
  // 发送REST请求时传入JSON数据
  reqPost.write(reqJosnData);
  reqPost.end();
  reqPost.on('error', function(e) {
    res.status(500).send(e);
  });
};

var http = require('http');
var https = require('https');

module.exports = function (url) {
  return new Promise(function (resolve) {
    let httpHelper = /^https/.test(url) ? https : http;
    let req = httpHelper.get(url, function (res) {
      res.on('end', function () {
        resolve(true);
      });
      res.on('error', function () {
        resolve(false);
      });
    });
    req.on('timeout', function () {
      req.abort();
    });
    req.on('error', function () {
      resolve(false);
    });
    setTimeout(function () {
      req.emit('timeout');
    }, 1000);
  });
};
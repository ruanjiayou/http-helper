const fs = require('fs');
const getHTML = require('../lib/getHTML');
const assert = require('assert');

describe('测试getHTML()', function () {
  it('中文乱码测试1:', function (done) {
    getHTML('http://news.163.com/17/1217/15/D5SABLCN000187VE.html')
      .then(function (res) {
        fs.writeFileSync('d:/test1.html', res.message);
        done();
      })
      .catch(function (err) {
        console.log(err);
        done();
      });
  });
  it('中文乱码测试2:', function (done) {
    getHTML('http://tech.huanqiu.com/internet/2017-12/11454771.html')
      .then(function (res) {
        fs.writeFileSync('d:/test2.html', res.message);
        done();
      })
      .catch(function (err) {
        console.log(err);
        done();
      });
  });

});
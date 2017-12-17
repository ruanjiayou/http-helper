const getHTML = require('../lib/getHTML');
const assert = require('assert');

describe('测试getHTML()', function () {
    // http://tech.huanqiu.com/internet/2017-12/11454771.html
    // http://news.163.com/17/1217/15/D5SABLCN000187VE.html
    it('中文乱码测试:', function (done) {
        getHTML('http://news.163.com/17/1217/15/D5SABLCN000187VE.html')
            .then(function (res) {
                //assert.equal(res, true);
                console.log(res);
                done();
            })
            .catch(function (err) {
                console.log(err);
                done();
            });
    });
    // it('http://www.jiayou.group', function(done){
    //     isOnline('http://www.jiayou.group')
    //         .then(function(res){
    //             done();
    //         })
    //         .catch(function(err){
    //             assert.equal(err, false);
    //             done();
    //         });
    // });
});
const shttp = require('../index').shttp;
const assert = require('assert');

describe('测试shttp()', function () {
    it('xxx:', function (done) {
        shttp
            .get('http://images.jiayou.com/')
            .end(function(err, res){
                if(err) {
                    console.log(Object.keys(err));
                    console.log(err.statusCode, '----------------------');
                    console.log(err.message, '******************************');
                } else {
                    console.log(res.length);
                }
            })
            .then(function(res){
                console.log(res.length, '111111111111111111');
                done();
            })
            .catch(function(err){
                console.log(err.message, '222222222222222222');
                done();
            });
    });
    it('local get json', function(done){
        shttp
            .get('http://localhost:8097/users')
            .end(function(err, res){
                if(err) {
                    console.log(Object.keys(err));
                    console.log(err.statusCode, '----------------------');
                    console.log(err.message, '******************************');
                } else {
                    console.log(res.body);
                }
            })
            .then(function(res){
                console.log(res.length, '333333333');
                done();
            })
            .catch(function(err){
                console.log(err.message, '44444444444');
                done();
            });
    });
    it('local get html', function(done){
        shttp
            .get('http://images.jiayou.com/xxx')
            .end(function(err, res){
                if(err) {
                    console.log(Object.keys(err));
                    console.log(err.statusCode, '----------------------');
                    console.log(err.message, '******************************');
                } else {
                    console.log(res.body);
                }
            })
            .then(function(res){
                console.log(res.length, '555555555');
                done();
            })
            .catch(function(err){
                console.log(err.message, '666666666666');
                done();
            });
    });
});
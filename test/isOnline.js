const isOnline = require('../lib/isOnline');
const assert = require('assert');

describe('测试online()', function(){
    it('http://www.baidu.com', function(done){
        isOnline('http://www.baidu.com')
            .then(function(res){
                assert.equal(res, true);
                done();
            })
            .catch(function(err){
                done();
            });
    });
    it('http://www.jiayou.group', function(done){
        isOnline('http://www.jiayou.group')
            .then(function(res){
                done();
            })
            .catch(function(err){
                assert.equal(err, false);
                done();
            });
    });
});
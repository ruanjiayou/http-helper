const Uri = require('uri-parser-helper');
const shttp = require('../index').shttp;
const assert = require('assert');

describe('shttp 测试token登录:', function () {
    const loginUrl = new Uri('http://api.novel.jiayou.com/auth/admin/login');
    const chapterUrl = new Uri('http://api.novel.jiayou.com/admin/book/1000000/chapter/1');
    it('中文乱码测试:', (done) => {
        (async function () {
            try {
                let token = await shttp
                    .post(loginUrl.href)
                    .send({ account: '123456789@qq.com', password: 'e10adc3949ba59abbe56e057f20f883e' })
                    .end();
                //console.log(token);
                assert.equal(token.result.type, 'JWT');
                let chapter = await shttp
                    .get(chapterUrl.href)
                    .set({ 'Authorization': `${token.result.type} ${token.result.token}`})
                    .end();
                //console.log(chapter);
                assert.equal(chapter.status, true);
                assert.equal(chapter.result.id, 1);
                done();
            } catch (err) {
                done(err);
            }

        })();
    });
});
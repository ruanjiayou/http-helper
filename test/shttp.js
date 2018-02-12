const shttp = require('../index').shttp;
const assert = require('assert');
const http = require('http');
const path = require('path');
const mime = require('mime');
const fs = require('fs');
const url_prefix = 'http://localhost:8888';

console.log('文件上传功能是通过express实现的 multer bodyParser等 ');

let uploadfilepath = 'C:/Users/sophsis/Desktop/test.txt';
let downimagepath = 'C:/Users/sophsis/Desktop/1.jpg';
http.createServer(function (request, response) {
    switch (request.url) {
        case '/json':
            response.writeHead(200, { 'Content-Type': 'application/json' });
            var data = {
                "name": "nodejs",
                "value": "stone"
            };
            response.end(JSON.stringify(data));
            break;
        case '/file':
            console.log(request.headers);
            response.writeHead(200, { 'Content-Type': 'text/plain' });
            response.end('Hello World\n');
            break;
        case '/image':
            let mimetype = mime.getType(downimagepath);
            response.writeHead(200, {
                'Content-Type': mimetype,
                'Content-disposition': `attachment; filename*=utf-8''${encodeURIComponent('兔女郎.' + mime.getExtension(mimetype))}`
            });
            const stream = fs.createReadStream(downimagepath);
            stream.pipe(response);
            stream.on('end', function () {
                response.end();
            });
            break;
        case '/error':
            response.writeHead(400, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ message: 'test 400 error' }));
            break;
        default:
            response.writeHead(200, { 'Content-Type': 'text/plain' });
            response.end('Hello World\n');
            break;
    }
}).listen(8888);
// 终端打印如下信息  
console.log(`临时测试服务器地址: ${url_prefix}`);

describe('测试shttp()', function () {
    it('text:', async function () {
        await shttp
            .get(`${url_prefix}`)
            .end(function (err, res, headers) {
                if (err) {
                    console.log(Object.keys(err));
                    console.log(err.statusCode, '----------------------');
                    console.log(err.message, '******************************');
                } else {
                    assert.equal('Hello World\n', res);
                    assert.equal('text/plain', headers['content-type']);
                }
            });
    });

    it('json:', async function () {
        await shttp
            .get(`${url_prefix}/json`)
            .end(function (err, res, headers) {
                if (err) {
                    console.log(Object.keys(err));
                    console.log(err.statusCode);
                    console.log(err.message);
                } else {
                    assert.equal('application/json', headers['content-type']);
                    assert.deepEqual({
                        "name": "nodejs",
                        "value": "stone"
                    }, res);
                }
            });
    });
    it('error:', async function () {
        await shttp
            .get(`${url_prefix}/error`)
            .type('json')
            .end(function (err, res) {
                if (err) {
                    assert.equal(400, err.statusCode);
                } else {
                    console.log(object.keys(res));
                }
            });
    });
    it('image:', async function () {
        await shttp
            .get(`${url_prefix}/image`)
            .end(function (err, res, headers) {
                if (err) {
                    console.log(Object.keys(err));
                    console.log(err.statusCode, '----------------------');
                    console.log(err.message, '******************************');
                } else {
                    assert.equal('number', typeof res.length);
                    //console.log(res.length);
                    //console.log(headers);
                }
            });
    });
    it('form file:', async function () {
        let test_url = 'http://api.novel.jiayou.com';
        let token = ''
        await shttp
            .post(`${test_url}/auth/admin/login`)
            .send({ account: '123456789@qq.com', password: 'e10adc3949ba59abbe56e057f20f883e' })
            .end(function (err, res, headers) {
                if (err) {
                    console.log(err.message);
                } else {
                    token = `${res.result.type} ${res.result.token}`;
                    //console.log(token);
                }
            });
        await shttp
            .post(`${test_url}/admin/author/2244/upload-avatar`)
            .set({
                'authorization': token,
                'content-type': 'multipart/form-data'
            })
            .send({ name: 'ruanjiayou' })
            .attach({ file: uploadfilepath })
            .end(function (err, res, headers) {
                if (err) {
                    console.log(err.message);
                } else {
                    //console.log(res);
                }
                process.exit();
            });
    });
});

//process.exit();
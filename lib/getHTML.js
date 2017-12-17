const http = require('http');
const https = require('https');
const Result = require('./result');
const iconv = require('iconv-lite');
/**
 * 编码处理:将buffer转为字符串
 * @param {array} chunks - buffer数组
 * @param {string} charset - 字符编码类型
 */
function _buffArr2str(chunks, charset) {
    let res = '';
    chunks = Buffer.concat(chunks);
    res = iconv.decode(chunks, 'utf-8');
    if (charset !== 'utf-8') {
        if (charset === null) {
            let t = /<meta[^>]*charset=(['"']?)([^;'"\s>]+)\1([^>]+)>/.exec(res);
            charset = t ? t[2] : 'utf-8';
        }
        res = iconv.decode(chunks, charset);
    }
    return res;
}

/**
 * 根据url获取字符串 自动判断http和https、编码/以及重定向
 * @param {string} url - 网址字符串
 * @param {object} - 返回Result对象
 */
function _getHTML(url, opts) {
    const result = new Result();
    return new Promise(function (resolve) {
        //设置超时
        var timeoutEvent, time = 2;
        //支持https
        var httpHelper = /^https/.test(url) ? https : http;
        //数据Buffer
        var chunks = [];
        var req = httpHelper.get(url, async function (res) {
            result.obj = res.headers;
            var reurl = res.headers['location'] || '';
            // 有重定向就直接重定向
            if (reurl) {
                console.log('redirect:' + reurl);
                result.status = Result.STATUS_REDIRECT;
                result.message = reurl;
                req.abort();
            }
            res.on('data', function (chunk) {
                chunks.push(chunk);
            });
            res.on('end', async function () {
                clearTimeout(timeoutEvent);
                result.status = Result.STATUS_SUCCESS;
                // 编码处理
                let t = /charset=(['"']?)([^;\s]+)\1/.exec(res.headers['content-type']);
                t = t ? t[2] : null;
                result.message = _buffArr2str(chunks, t);
                resolve(result);
            });
            res.on('error', async function (err) {
                if (result.status === Result.STATUS_REDIRECT) {
                    result.status = Result.STATUS_ERROR;
                    result = await _getHTML(result.message);
                } else {
                    result.message = err.message;
                    resolve(result);
                }
            });
        });
        req.on('timeout', function () {
            req.abort();
        });
        req.on('error', function (err) {
            result.message = err.message;
            resolve(result);
        });
        timeoutEvent = setTimeout(function () {
            req.emit('timeout', {
                message: '请求超过' + time + 's！'
            });
        }, time * 1000);
    });
}

module.exports = async function (url) {
    var res = await _getHTML(url);
    var counts = 1;
    while (res.status !== Result.STATUS_SUCCESS) {
        if (counts >= 2) {
            res.status = Result.STATUS_TIMEOUT;
            console.log('2次了。。。还不成功');
            break;
        }
        counts++;
        res = await _getHTML(url);
    }
    return res;
}
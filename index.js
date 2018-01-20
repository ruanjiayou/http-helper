const URI = require('uri-parser-helper');
const request = require('request-promise');
const Result = require('./lib/result');
const isOnline = require('./lib/isOnline');
const getHTML = require('./lib/getHTML');

/**
 * TODO:文件下载与上传
 */
class shttp {
    constructor() {
        this.uri = new URI('http://127.0.0.1');
        this.options = {
            method: 'GET',
            uri: '',
            body: {},
            //json: true,
            headers: {
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Accept-Encoding": "gzip, deflate",
                "Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
                "Connection": "keep-alive",
                "Upgrade-Insecure-Requests": "1",
                "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:57.0) Gecko/20100101 Firefox/57.0"
            },
        };
    }
    /**
     * application/json 
     * form x-www-form-urlencoded application/json multipart/form-data
     */
    type(type) {
        //TODO:默认
        switch (type.toLowerCase()) {
            case 'json': this.options.json = true; break;
            case 'application/json': this.options.json = true; break;
            default: break;
        }
        return this;
    }
    clear() {
        this.options.method = 'GET';
        this.options.uri = '';
        this.options.body = {};
    }
    /**
     * 设置header
     * @param {string|object} v1 
     * @param {string} [v2]
     */
    set(v1, v2) {
        if (typeof v1 === 'string' && typeof v2 === 'string') {
            this.options.headers[v1] = v2;
        }
        if (typeof v1 === 'object') {
            for (let k in v1) {
                this.options.headers[k] = v1[k];
            }
        }
        return this;
    }
    /**
     * 设置get请求的search
     * @param {string|object} o 请求的search部分
     */
    query(o) {
        this.uri.search = str;
        return this;
    }
    /**
     * 设置请求的body
     * @param {string|object} v1 
     * @param {string} [v2]
     */
    send(v1, v2) {
        this.options.json = true;
        if (!this.options.body) {
            this.options.body = {};
        }
        if (typeof v1 === 'string' && typeof v2 === 'string') {
            this.options.body[v1] = v2;
        }
        if (typeof v1 === 'object') {
            for (let k in v1) {
                this.options.body[k] = v1[k];
            }
        }
        return this;
    }
    get(url) {
        this.clear();
        this.uri = new URI(url);
        delete this.options.body;
        return this;
    }
    patch(url) {
        this.clear();
        this.options.method = 'PATCH';
        this.uri = new URI(url);
        return this;
    }
    post(url) {
        this.clear();
        this.options.method = 'POST';
        this.uri = new URI(url);
        return this;
    }
    put(url) {
        this.clear();
        this.options.method = 'PUT';
        this.uri = new URI(url);
        return this;
    }
    delete(url) {
        this.clear();
        this.options.method = 'DELETE';
        this.uri = new URI(url);
        return this;
    }
    async end(cb) {
        this.options.uri = this.uri.href;
        let res, err = null;
        try {
            res = await request(this.options);
        } catch(e) {
            err = e;
        }
        if(typeof cb === 'function') {
            cb(err, res);
        }
        return new Promise(function(resolve, reject){
            if(err){
                reject(err);
            } else {
                resolve(res);
            }
        });
    }
}

module.exports = {
    Result,
    isOnline,
    getHTML,
    shttp: new shttp()
};
const URI = require('uri-parser-helper');
const request = require('request-promise');
const Result = require('./lib/result');
const isOnline = require('./lib/isOnline');
const getHTML = require('./lib/getHTML');
const fs = require('fs');
const path = require('path');
const mime = require('mime');

class shttp {
    constructor() {
        this.uri = new URI('http://127.0.0.1');
        this.files = {};
        this.options = {};
    }
    /**
     * 不清空会有问题
     */
    clear(type) {
        this.options = new Object();
        this.options.method = type;
        this.files = {};
        this.options.body = {};
        this.options.formData = {};
        this.options.resolveWithFullResponse = true;
        this.options.headers = {
            "Accept": "text/html,image/*,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Encoding": "gzip, deflate",
            "Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
            "Connection": "keep-alive",
            "Upgrade-Insecure-Requests": "1",
            "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:57.0) Gecko/20100101 Firefox/57.0"
        };
    }
    /**
     * application/json json
     */
    type(type) {
        switch (type.toLowerCase()) {
            case 'json': this.options.json = true; break;
            case 'application/json': this.options.json = true; break;
            //case 'multipart/form-data': this.set('content-type', 'multipart/form-data');
            //application/x-www-form-urlencoded
            default: break;
        }
        return this;
    }
    /**
     * 设置header
     * form x-www-form-urlencoded multipart/form-data
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
    attach(name, filepath) {
        let files = {};
        this.set('content-type', 'multipart/form-data');
        if (typeof name === 'string') {
            files[name] = filepath;
        } else {
            files = name;
        }
        for (let k in files) {
            this.files[k] = files[k];
        }
        return this;
    }
    /**
     * 设置get请求的search
     * @param {string|object} o 请求的search部分
     */
    query(o) {
        this.uri.search = o;
        return this;
    }
    /**
     * 设置请求的body
     * @param {string|object} v1 
     * @param {string} [v2]
     */
    send(v1, v2) {
        if (this.options.method === 'GET') {
            if (typeof v1 === 'string' && typeof v2 === 'string') {
                this.uri.search = `${v1}=${v2}`;
            }
            if (typeof v1 === 'object') {
                this.uri.search = v1;
            }
        } else {
            if (this.options.body === undefined) {
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
        }
        return this;
    }
    get(url) {
        this.clear('GET');
        this.uri = new URI(url);
        return this;
    }
    patch(url) {
        this.clear('PATCH');
        this.uri = new URI(url);
        return this;
    }
    post(url) {
        this.clear('POST');
        this.uri = new URI(url);
        return this;
    }
    put(url) {
        this.clear('PUT');
        this.uri = new URI(url);
        return this;
    }
    delete(url) {
        this.clear('DELETE');
        this.uri = new URI(url);
        return this;
    }
    async end(cb) {
        let res = {}, err = null, options = {};
        this.options.uri = this.uri.href;
        options = this.options;
        try {
            // 表单及文件处理
            if (options.headers['content-type'] === 'multipart/form-data') {
                let body = options.body,
                    form = options.formData = {};
                for (let k in body) {
                    form[k] = body[k];
                }
                for (let k in this.files) {
                    let filename = path.basename(this.files[k]);
                    form[k] = {
                        value: fs.createReadStream(this.files[k]),
                        options: {
                            filename: filename,
                            contentType: mime.getType(path.extname(filename))
                        }
                    };
                }
                delete options.body;
            } else {
                delete options.formData;
            }
            if (options.body) {
                options.json = true;
            }
            res = await request(options);
        } catch (e) {
            // 算了,只要不是200就是error
            err = e;
            //400竟然跳到这里
            // if(typeof e.statusCode === 'number') {
            //     res.statusCode = e.statusCode;
            //     res = e.response;
            // } else {
            //     err = e;
            // }
        }
        if (typeof res.body === 'string' && res.headers['content-type'].indexOf('application/json') !== -1) {
            res.body = JSON.parse(res.body);
        }
        if (typeof cb === 'function') {
            cb.call(err ? err : res, err, res.body, res.headers);
        }
        return err ? err : res;
    }
}

module.exports = {
    Result,
    isOnline,
    getHTML,
    shttp: new shttp()
};
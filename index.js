const URI = require('uri-parser-helper');
const request = require('request-promise');
const isOnline = require('./lib/isOnline');
const getHTML = require('./lib/getHTML');
const fs = require('fs');
const path = require('path');
const mime = require('mime');

class rp {
  constructor(url, method = 'GET') {
    this.uri = new URI(url);
    this.files = {};
    this.method = method;
    this.body = {};
    this.formData = {};
    this.headers = {
      "Accept": "text/html,image/*,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Encoding": "gzip, deflate",
      "Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
      "Connection": "keep-alive",
      "Upgrade-Insecure-Requests": "1",
      "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:57.0) Gecko/20100101 Firefox/57.0"
    };
  }
  /**
   * 设置header
   * form x-www-form-urlencoded multipart/form-data
   * @param {string|object} v1 
   * @param {string} [v2]
   */
  set(v1, v2) {
    if (typeof v1 === 'string' && typeof v2 === 'string') {
      this.headers[v1] = v2;
    }
    if (typeof v1 === 'object') {
      for (let k in v1) {
        this.headers[k] = v1[k];
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
  send(data) {
    this.body = data;
    return this;
  }
  async end(cb) {
    let res = {}, err = null, isPP = this.method !== 'GET';
    let opts = {
      uri: this.uri.href,
      method: this.method,
      headers: this.headers,
      resolveWithFullResponse: true,
      body: this.body
    };
    if (isPP) {
      opts.json = true;
    } else {
      delete opts.body;
    }
    try {
      // 表单及文件处理
      let type = opts.headers['Content-Type'] || opts.headers['content-type'];
      if (type === 'multipart/form-data') {
        opts.formData = this.data;
        delete opts.body;
        for (let k in this.files) {
          let filename = path.basename(this.files[k]);
          opts.formData[k] = {
            value: fs.createReadStream(this.files[k]),
            options: {
              filename: filename,
              contentType: mime.getType(path.extname(filename))
            }
          };
        }
      }
      res = await request(opts);
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
    if (typeof res.body === 'string' && res.headers) {
      let type = res.headers['Content-Type'] || res.headers['content-type'];
      if (type.indexOf('application/json') !== -1) {
        res.body = JSON.parse(res.body);
      }
    }
    if (typeof cb === 'function') {
      cb.call(err ? err : res, err, res.body, res.headers);
    }
    return err ? err : res;
  }
}

const shttp = {
  get: (url) => {
    return new rp(url, 'GET');
  },
  post: (url) => {
    return new rp(url, 'POST');
  },
  put: (url) => {
    return new rp(url, 'PUT');
  },
  delete: (url) => {
    return new rp(url, 'DELETE');
  },
  patch: (url) => {
    return new rp(url, 'PATCH');
  },
  getHTML: getHTML,
  // downImage: downImage
};

module.exports = {
  isOnline,
  shttp
};
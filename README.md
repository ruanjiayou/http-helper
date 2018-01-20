# easily use http
```
安装方法: npm install net-helper -S
使用方法:
    1. await shttp.get('http://www.baidu.com').query({search:'test'}).end(cb);
    2.const res = await shttp.get('some url return json').type('json').query({search:'test'}).end();
```
## 2017-12-6 21:03:37
```
方便的使用http的GET/POST/PUT/DELETE
```
## 2017-12-17 18:13:43
```
    仓库改名:http-helper--->net
```
## 2017-12-17 21:36:53
```
    getHTML()/isOnline()/result/shttp 模块完成,测试完成
    TODO:文件的上传/下载/响应   shttp接入事件
```
## 2017-12-18 17:09:52
```
    发布到npm
```
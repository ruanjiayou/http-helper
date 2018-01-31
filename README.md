# easily use http
```
    方便的使用http的GET/POST/PUT/DELETE
    安装方法: npm install net-helper -S
    const shttp = require('net-helper').shttp;
    shttp
        .post('http://www.baidu.com')
        //.attach({ file: 'c:/desktop/test.png' })//上传的文件
        .query({ name: 'xxx', password: 'yyy' })
        .send({ email: 'xxxx' })
        .end(function(err, res, headers){
            if(err) {
                console.log(err.message);
            } else {
                console.log(headers);
                console.log(res);
            }
        })
```
## 使用方法介绍:
- clear() 清空之前的请求参数
- get() get请求
- post() post请求
- patch() patch请求
- put() put请求
- delete() delete请求
- ~~type() 设置请求的格式 json(主要是声明返回的也是json)~~ 根据响应头content-type判断是否使用JSON.parse()
- set() 设置请求头(可以设置表单文件的提交方式)
- attach() 上传文件
- query() 设置search字符串
- send() 设置请求的body数据(options.json一定为true!!!)
- end() 发送请求,返回请求结果,同样接受回调函数参数
#### 2017-12-17 18:13:43
```
    仓库改名:http-helper--->net
```
#### 2017-12-17 21:36:53
```
    getHTML()/isOnline()/result/shttp 模块完成,测试完成
    TODO:shttp接入事件
```
#### 2018-1-26 23:46:06
```
attach()上传文件
2018-1-26 23:47:36 文件上传已实现
2018-1-27 10:37:44 文件下载已实现
```
#### 2018-01-31 10:27:30
```
    修改bug:
```
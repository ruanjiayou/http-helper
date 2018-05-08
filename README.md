# easily use http restful API
```
  方便快捷的使用http的GET/POST/PUT/DELETE
  安装方法: npm install net-helper -S
```
```js
  // 使用demo
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
    });
```
## 使用方法介绍:
- get() get请求
- post() post请求
- patch() patch请求
- put() put请求
- delete() delete请求
- header() 设置请求头(可以设置表单文件的提交方式)
- attach() 上传文件
- query() 设置search字符串
- send() 设置请求的body数据(options.json一定为true!!!)
- end() 发送请求,返回请求结果,同样接受回调函数参数
- getHTML() 获取网页
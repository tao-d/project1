 /**
  * 
  * 对express进行基本的配置
  * 
  */
 
 const userApi = require('./api/userApi.js')
 const doctorApi = require('./api/doctorApi.js')
 const bodyParser = require('body-parser')
 const express = require('express')
 
//创建express的实例
const app = express()

//设置bodyParser中间件，用于解析请求体，是我们能够直接通过req.body获取参数
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//设置跨域访问
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

// 设置后端api路由,userApi是一个路由对象
app.use('/api/user', userApi)
app.use('/api/doctor',doctorApi)

// 监听端口
app.listen(5000, function () { //在5000端口启动
  console.log('Example app listening on port 5000');
})

//自动进行数据库里的更新
// setInterval(() => {
//   console.log('过了一秒')
// },1000 );

var models = require('../db')
var express = require('express')
var mysql = require('mysql')
var $sql = require('../sqlMap')

//新建一个express router类
var router = express.Router()


// 连接数据库
var connect = mysql.createConnection(models.mysql)
connect.connect()

//处理函数，将查询到的信息插入responsebody
var jsonWrite = function (res, ret) {
  if (typeof ret === 'undefined') {
    res.json({
      code: '1',
      msg: '操作失败'
    })
  } else {
    res.json(ret).status(200)
  }
}

//查找某信息是否存在
function findOneUser(param){
  let sql = `select * from user where username = ?`
  let flag = null;
  return new Promise((resolve,reject)=>{
    connect.query(sql,param.username,(err,results)=>{
      if(err){
        reject(err);
      }
      if(results)
      {
        flag=results.length>0?true:false 
        resolve(flag);
      }
    });
  })
}


/**
 * 查询是否存在用户
 * 返回值：boolean
 */
router.post('/findOneUser',(req,res)=>{
  let param = req.body
  let answer = findOneUser(param)
  answer.then(flag=>{
     res.json(flag).status(200)
  })
  .catch(err =>{
    res.json(err).status(400)
  })
});


/**
 * 用户表的接口
 * 
 */
 
function dateFormat(fmt, date) {
  let ret;
  const opt = {
      "Y+": date.getFullYear().toString(),        // 年
      "m+": (date.getMonth() + 1).toString(),     // 月
      "d+": date.getDate().toString(),            // 日
      "H+": date.getHours().toString(),           // 时
      "M+": date.getMinutes().toString(),         // 分
      "S+": date.getSeconds().toString()          // 秒
      // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (let k in opt) {
      ret = new RegExp("(" + k + ")").exec(fmt);
      if (ret) {
          fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
      };
  };
  return fmt;
}



// 增加用户接口 初始化用户信息表
router.post('/addUser', (req, res) => {
  let sql = $sql.user.add
  let params = req.body
  let date = dateFormat("YYYYmmddHHMMSS",new Date())
  new Promise((resolve,reject)=>{
    connect.query(sql, [params.username, params.password,date], function (err, results) {
        if (err) {
          console.log('添加用户失败' + err)
          reject();
        }
        if (results) {
          console.log('user success');
          resolve();
        }
    })
  }).then(()=>{
    let sql = $sql.userInformations.add;
    return new Promise((resolve,reject)=>{
      connect.query(sql, [params.username],(err,results)=>{
        if(err)
        {
          //console.log('userInformations failed');
          reject();
        }
        if(results)
        {
          //console.log('userInformations success');
          resolve(results)
        }
      })
    })
  }).then((resolve)=>{
    
    res.json(resolve).status(200)
  }).catch((error)=>{
    res.json(err).status(400)
  })
})
  


 
// 查询用户表接口
router.post('/selectUser', (req, res) => {
  let sql = $sql.user.selectUser
  let params = req.body
  if (params.username) {
    sql = "select * from user where username = '" + params.username + "' AND password = '" + params.password + "'"
  }
  console.log(sql)
  connect.query(sql, [params.username, params.password], function (err, results) {
    if (err) {
      jsonWrite(err)
    }
    if (results) {
      console.log(results)
      jsonWrite(res, results)
    }
  })
})




//查询用户表内所有用户资料
router.post('/allUser',(req,res) =>{
  let sql = $sql.user.allUser;
  connect.query(sql,(err,results)=>{
    if(err){
      jsonWrite(err)
    }
    if(results)
    {
      console.log(results)
      jsonWrite(res,results)
    }
  })
 })

/**
 * 用户信息表接口
 */

 //查询用户信息表
 router.post('/userInformations',(req,res)=>{
   const params = req.body;
   const sql =$sql.userInformations.selectUserInformations
   const find =connect.query(sql,params,(err,results)=>{
     if(err){
       console.log(err);
     }
     if(results){
      console.log(results)
      res.status(200).json(results)
     }
   })
   console.log('sql',find.sql)
 });


 //更新用户信息表
 router.post('/updateUserInformations',(req,res)=>{
  const params = req.body;
  const sql =$sql.userInformations.updateUserInformations
  const find =connect.query(sql,[params.userInformations,params.username],(err,results)=>{
    if(err){
      console.log(err);
    }
    if(results){
     console.log(results)
     res.status(200).json(results)
    }
  })
  console.log('sql',find.sql)
});

router.post('/selectAppointments',(req,res)=>{
  const params = req.body
  const sql = $sql.appointment.selectAppointments
  connect.query(sql,[params.username,params.status],(err,results)=>{
    if(err) console.log(err)
    if(results){
      console.log('results',results)
      res.json(results).status(200)
    }
    
  })
})

function updateAppointmentsStatus(){
  let sql = `select * from appointments where status = '已预约'`
  return new Promise((resolve,reject)=>{
      connect.query(sql,(err,results)=>{
      if(err) {
        reject(err)
      }
      if(results){
        resolve(results)
      }
    })
  }).then(resolve=>{
    console.log(resolve.length);
    let todaydate = new Date()
    let updateSql = `update appointments set status = '已完成' where time = ?`
    for(let item of resolve){
      let thattime = new Date(item.time.split('-')[0])
      // console.log('thattime',thattime);
      
      //node.js获取的是UTC时间,数据库中的time会转化成相同的格式
      if(todaydate-new Date(thattime)>10*60*1000)
      {
        connect.query(updateSql,item.time,(err,results)=>{
          if(err){
            console.log(err);
          }
          if(results){
          }
        })
      }
    }
    console.log('time更新完成');
  })
}
setInterval(()=>{
  console.log(`正在检查更新数据库(appointments)..`);
  new Promise((resolve,reject)=>{
    updateAppointmentsStatus().then(()=>{
      resolve();
    });
  }).then(res=>{
    console.log('数据库更新完毕(appointments)');
  }).catch(err=>{
    console.log(`数据库更新失败(appointments)`);
  })
},0.5*60*1000)

 



  



module.exports = router
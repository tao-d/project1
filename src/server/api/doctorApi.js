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
router.post('/findOneDoctor',(req,res)=>{
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
 * 医生表的接口
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
  // if(/(y+)/.test(fmt))
  //   fmt=fmt.replace(RegExp.$1,(this.getFullYear()+""))
  for (let k in opt) {
      ret = new RegExp("(" + k + ")").exec(fmt);
      if (ret) {
          fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
      };
  };
  return fmt;
}

//获取表内所有医生信息
router.post('/allDoctor',(req,res)=>{
  let sql = $sql.doctor.allDoctor
  let params = req.body
  connect.query(sql,(err,results)=>{
    if(err)
    {
      console.log(false);
    }
    if(results){
      console.log(true)
      res.json(results).status(200)
    }
  })
})

//获取符合条件的医生信息
router.post('/selectDoctor',(req,res)=>{
  let params = req.body;
  let sql = null
  if(params.doctor_name==='')
  {
    sql = `select * from doctor where doctor_name like '%'`;
  }
  else{
    sql = `select * from doctor where doctor_name like '%${params.doctor_name}%'`;
  }
  console.log(sql)
  connect.query(sql,(err,results)=>{
    if(err)
    {
      //console.log(params)
      console.log(err);
    }
    if(results){
      console.log(true)
      res.json(results).status(200)
    }
  })
})

//获取点击的医生信息
router.post('/getSelectItemData',(req,res)=>{
  //const sql = $sql.doctorTime.selectDoctorTime;
  //const sql = "select * from doctor_time where `doctor_name` = '李好' and `date` = '2020/11/1'";
  let sql ="select * from doctor_time where 1=1 "
  const params = req.body;
  if(params.doctor_name)
  {
    sql += `and doctor_name = '${params.doctor_name}'`
  }
  if(params.date)
  {
    sql += ` and date = '${params.date}'`
  }
  if(params.doctor_id)
  {
    sql += ` and doctor_id = '${doctor_id}'`
  }
  connect.query(sql,(err,results)=>{
    if(err)
    {
      console.log(err)
    }
    if(results){
      //console.log(results);
      res.json(results).status(200)
    }
  })
})


router.post('/addAppointment',(req,res)=>{
  const sql = $sql.appointment.addAppointment
  const params = req.body;
  //console.log(typeof params.time,params.time)
  new Promise((resolve,reject)=>{
      connect.query(sql,[params.doctor_name,params.username,params.time,params.status],(err,results)=>{
      if(err)
      {
        console.log(err)
        reject();
      }
      if(results){
        //console.log(results);
        //res.json(results).status(200)
        resolve(results);
      }
    })
  }).then((resolve)=>{
    //有人预约后更新doctor_time的数据(剩余容量-1)
    // let sql = $sql.doctorTime.countDecrease;
    let update_date = params.time.split(' ')[0]
    let update_time = getTableTimeSign((params.time).split(' ')[1])
    let sql = `update doctor_time set ${update_time} = ${update_time}-1 where doctor_name = ? and date = ?`
    connect.query(sql,[params.doctor_name,update_date],(err,results)=>{
      if(err)
      {
        console.log(err)
      }
      if(results)
      {
        //console.log(update_time);
        console.log(results);
        res.json(resolve).status(200)
      }
    })
  })
})

function getTableTimeSign(time){
  switch(time){
    case '8:00-9:00':
      return 'count1';
    case '9:00-10:00':
      return 'count2';  
    case '10:00-11:00':
      return 'count3';
    case '11:00-12:00':
      return 'count4';
    case '14:00-15:00':
      return 'count5';
    case '15:00-16:00':
      return 'count6';
    case '16:00-17:00':
      return 'count7';
    case '17:00-18:00':
      return 'count8';
  }
}
router.post('/checkAppointment',(req,res)=>{
  const params = req.body;
  let sql = `select * from appointments where doctor_name = ? and username = ? and time = ?`
  connect.query(sql,[params.doctor_name,params.username,params.time],(err,results)=>{
    if(err) console.log(err);
    if(results)
    {
      res.json(results).status(200)
    }

  })
})
/**
 * 有关数据库的自动后台操作
 * 自动生成新一天的代码
 */

// setInterval(()=>{
//   console.log('过了一秒');
// },1000)

const dateCount=[8,8,8,8,8,8,8,8]

function getAllDoctorName(){
  //let AllDoctorName = []
  let sql = `select doctor_name,doctor_id from doctor order by doctor_id`
  return new Promise((resolve,reject)=>{
      connect.query(sql,(err,results)=>{
      if(err)
      {
        console.log(err);
        reject();
      }
      if(results){
        resolve(results);
      }
    })
  })
}

//更新医生所有的时间表（通过当前日期判断）
function checkAlldoctorTime(){
  return getAllDoctorName().then(res=>{
    let AllDoctorName = res;
    for(let i = 1;i<=4;i++)
    {
      //14天内的预时间表查询
      //今天日期
      const thatday = new Date();
      //获取14天内的日期
      thatday.setDate(thatday.getDate()+i);
      let thatdate = thatday.getFullYear() +"/"+(thatday.getMonth() + 1) + "/" + thatday.getDate()
      let sql = `select doctor_name,doctor_id,date from doctor_time where date = '${thatdate}'`
      new Promise((resolve,reject)=>{
        connect.query(sql,(err,results)=>{
            if(err) 
            {
              console.log(err);
              reject(err);
            };
            if(results){
                resolve(results);
            }
          })
      }).then((res)=>{
        let sql = `insert into doctor_time(doctor_name,doctor_id,date,count1,count2,count3,count4,count5,count6,count7,count8,changdate) 
        values(?,?,?,?,?)`
        //数据库中已经存在的当天的医生姓名
        for(let k of AllDoctorName){
          //数据库中所有的医生姓名
          let flag =true;
          for(let j of res){
            if(j.doctor_name===k.doctor_name&&j.doctor_id===k.doctor_id)
            {
              flag = false;
              break;
            }
          }
          if(flag)
          {
            connect.query(sql,[k.doctor_name,k.doctor_id,thatdate,dateCount,new Date],(err,results)=>{
                if(err) {
                  console.log(err);                  
                }
                if(results){
                  //console.log(results);
                }
            })
          }
        }
      })
    }
    return `我是返回的Promise`
  }).catch(err=>{
    console.log('发生错误',err);
    
  })
}

  setInterval(()=>{
    console.log(`正在检查更新数据库..`);
    new Promise((resolve,reject)=>{
        checkAlldoctorTime().then(res=>{
        resolve();
      })
    }).then(res=>{
      console.log('数据库更新完毕');
    }).catch(err=>{
      console.log(`数据库更新失败`);
    })
  },5*60*1000)



module.exports = router
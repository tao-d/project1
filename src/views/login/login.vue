<template>
  <div id="login">
    <div id="container">
    <div class="loginBox">
      <el-form class="loginForm" label-width="80px" :ref="loginForm" @keyup.enter.native="getUserName()">
        <el-form-item label="账号" label-position='right'>
          <el-input placeholder="输入账号" id="loginUsername" v-model="loginForm.username" size='medium'>
          </el-input>
        </el-form-item>
        <el-form-item label="密码" label-position='right'>
          <el-input  placeholder="输入密码" id="loginPassword" v-model="loginForm.password" type="password" size='medium'>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type='primary' @click="getUserName()" class="loginBtn" >登录</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type='primary' @click="btnRegister()" class="loginBtn">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div id="container_bg"></div>
    </div>
    <!-- <router-view/> -->
    <!-- <div class="loginPassword"><span>密码</span><el-input placeholder="请输入密码" id="loginPassword" type="password" v-model="password"></el-input></div>
    <h2>{{message}}</h2>
    <el-button type='primary' @click="getUserName()">登录</el-button> -->
    
  </div>
</template>

<script>
import { requestMysql } from "../../network/index";
export default {
  name: "login",
  data() {
    return {
      loginForm:{
      username: ``,
      password: ``,
      message: ``,
      },
    };
  },
  methods: {
    getUserName() {
      requestMysql({
        url: "/api/user/selectUser",
        data: {
           username: `${this.loginForm.username}`,
           password: `${this.loginForm.password}`,
        },
        method: "post",
      })
        .then((res) => {
          if(res.data.length===1){
           this.loginForm.message = res.data;
           
           this.$store.commit('changeUsername',{
             username:this.loginForm.username,
             password:this.loginForm.password
           })
           window.localStorage.username=this.loginForm.username;
           window.localStorage.password=this.loginForm.password;
           //alert(window.localStorage.username)
           this.$router.push('/Profile')
          }
          else{
            confirm('账号或密码错误')
            //console.log(new Date())
            //alert(this.dateFormat('YYYY mm dd HH MM SS',new Date()))
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    btnRegister(){
      this.$router.push('/register')
    },
    dateFormat(fmt, date) {
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
  },
};
</script>

<style scoped>
#container{
  height: 100vh;
  position: relative;
  background-repeat: no-repeat;
  background-color: rgba(64,158,255, 0.2);
}
#container_bg{
  background-image: url('../../assets/login_bg.jpg');
  background-size: cover;
  position: absolute;
  z-index: -1;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  filter: blur(10px);

}
.loginBox{
  padding-top: 50px;
  border-radius: 5px;
  box-sizing: border-box;
  position: absolute;
  width: 450px;
  height: 350px;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  background-color:rgba(255, 255, 255,1);
  
}
.loginBox::before{
  content: '诊所预约系统';
  width: 250px;
  height: 50px;
  background-color: #409EFF;
  position:absolute;
  left: 0px;
  top: -25px;
  color: white;
  font-size: 20px;
  line-height: 50px;
  text-align: center;
  border-radius: 5px;
}
.loginForm{
  width: 300px;
  padding-left: 40px;
  padding-right: 40px;
  padding-top: 20px;
  border-top: 2px solid #cccccc;
  text-align: center;
}
.loginBtn{
  width: 100%;
}
.el-form-item{
  margin-bottom: 20px;
}
</style>
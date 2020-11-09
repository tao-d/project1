<template>
  <div id="Register">
    <div id="container">
    <div class="RegisterBox">
      <el-form class="RegisterForm" status-icon :model="RegisterForm" label-width="120px" ref="RegisterForm"  :rules="rules" @keyup.enter.native="getUserName()">
        <el-form-item label="注册账号" label-position='right' prop="username">
          <el-input placeholder="输入账号" id="RegisterUsername" v-model="RegisterForm.username" size='medium'>
          </el-input>
        </el-form-item>
        <el-form-item label="密码" label-position='right' prop="password">
          <el-input  placeholder="输入密码" id="RegisterPassword" v-model="RegisterForm.password" type="password" size='medium'>
          </el-input>
        </el-form-item>
        <el-form-item label="再次输入密码" label-position='right' prop="secondpassword">
          <el-input  placeholder="再次输入密码" id="RegisterSecondPassword" v-model="RegisterForm.secondpassword" type="password" size='medium'>
          </el-input>
        </el-form-item>
        <el-form-item class="btnItems">
          <el-button type='primary' @click="RegisterBtn('RegisterForm')" class="RegisterBtn" >立即注册</el-button>
          <el-button type='primary' @click="backBtn()" class="backBtn">返回</el-button>
        </el-form-item>
      </el-form> 
      <el-alert
        title="注册成功"
        type="success"
        description="3秒后跳转到登录页面"
        show-icon
        v-if="ifAlert">
      </el-alert>
    </div>      
    <div id="container_bg">

    </div>
    </div>
    <!-- <router-view/> -->
    <!-- <div class="RegisterPassword"><span>密码</span><el-input placeholder="请输入密码" id="RegisterPassword" type="password" v-model="password"></el-input></div>
    <h2>{{message}}</h2>
    <el-button type='primary' @click="getUserName()">登录</el-button> -->
    
  </div>
</template>

<script>
import { requestMysql } from "../../network/index";
export default {
  name: "Register",
  data() {
    var checkTimeout = null;
    var checkUsername = (rule,value,callback)=>{
      if(value==='')
      {
        callback('未输入账号');
        return
      }
      clearTimeout(checkTimeout)
      checkTimeout=setTimeout(()=>{
          requestMysql({
          url:"/api/user/findOneUser",
          method:'post',
          data:{
            username:`${this.RegisterForm.username}`
          }
        }).then(res=>{
          
          if(res.data===true)
          {
            callback(new Error('该账号已被注册'))
          }
          else{
            callback()
          }
        })
      },1500)


      // requestMysql({
      //   url:"/api/user/findOneUser",
      //   method:'post',
      //   data:{
      //     username:`${this.RegisterForm.username}`
      //   }
      // }).then(res=>{
        
      //   if(res.data===true)
      //   {
      //     callback(new Error('该账号已被注册'))
      //   }
      //   else{
      //     callback()
      //   }
      // })
    }
    var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.RegisterForm.secondpassword!==undefined) {
            this.$refs.RegisterForm.validateField('secondpassword');
          }
          callback();
        }
      };

    var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.RegisterForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
    return {
      ifAlert:false,
      RegisterForm:{
      username: ``,
      password: ``,
      secondPassword:``,
      message: ``,
      },
      rules: {
          username:[
             { validator: checkUsername, trigger: 'change'}
          ],
          password: [
            { validator: validatePass, trigger: 'blur' }
          ],
          secondpassword: [
            { validator: validatePass2, trigger: 'blur' }
          ],
        }
    };
  },
  methods: {
    getUserName() {
      requestMysql({
        url: "/api/user/findOneUser",
        data: {
           username: `${this.RegisterForm.username}`,
           password: `${this.RegisterForm.password}`,
        },
        method: "post",
      })
        .then((res) => {
          //console.log(res);
           this.message = res.data;
           this.$store.commit('changeUsername',{
             username:this.RegisterForm.username,
             password:this.RegisterForm.password
           })
           this.$router.push('/home')
        })
        .catch((err) => {
          console.log(err);
        });
    },

    backBtn(){
      this.$router.push('/login')
    },

    RegisterUser(){
       requestMysql({
        url: "/api/user/addUser",
        data: {
           username: `${this.RegisterForm.username}`,
           password: `${this.RegisterForm.password}`,
        },
        method: "post",
      })
        .then((res) => {
          console.log('注册成功')
        })
        .catch((err) => {
          console.log(err);
          alert('注册失败');
        });
    },

    RegisterBtn(FormName){
       this.$refs[FormName].validate((validate)=>{
         if(validate)
         {
           this.RegisterUser();
           this.ifAlert = true
           setTimeout(() => {
             this.ifAlert = false
             this.$router.push('/login')
           }, 3000);
         }
         else{
           console.log('submit error')
           return false
         }
       });
     }
  },
  beforeRouteLeave(to, from, next){
    next()
  }
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
.RegisterBox{
  padding-top: 50px;
  border-radius: 5px;
  box-sizing: border-box;
  position: absolute;
  width: 500px;
  height: 350px;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  background-color:rgba(255, 255, 255,1);
  
}
.RegisterBox::before{
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
.RegisterForm{
  width: 350px;
  padding-left: 40px;
  padding-right: 40px;
  padding-top: 20px;
  border-top: 2px solid #cccccc;
  text-align: center;
}
.btnItems{
  text-align: left;
}
.el-form-item{
  margin-bottom: 20px;
}
</style>
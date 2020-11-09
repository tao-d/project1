<template>
  <div id="home">
    <el-container>
      <el-header id="homeHeader" height="80px">
         <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" id="userAvatar" v-popover:popover>
         </el-avatar>
          <el-popover
            ref="popover"
            placement="bottom"
            width="100"
            trigger="hover">
            <ul class="popover" @click="quit">
              <li>退出</li>
            </ul>
          </el-popover>
         <span id="usernameSpan" @click="loginSpan">{{getUsername}}</span>
      </el-header>
      <el-container>
        <el-aside width="200px" id="homeAside">
          <el-menu router :default-active="activeMenu">
            <el-menu-item route="/Profile/appointments" index="/Profile/appointments">
              <i class="el-icon-user-solid"></i>
              <span slot="title">用户预约</span>
            </el-menu-item>
            <el-menu-item route="/Profile/mine" index="/Profile/mine">
              <i class="el-icon-user"></i>
              <span slot="title">我的预约</span>
            </el-menu-item>
            <el-menu-item route="/Profile/history" index="/Profile/history">
              <i class="el-icon-date"></i>
              <span slot="title">历史预约</span>
            </el-menu-item>
            <el-menu-item route="/Profile/settings" index="/Profile/settings">
              <i class="el-icon-setting"></i>
              <span slot="title">个人设置</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <el-breadcrumb separator=">" id="breadcrumb">
            <el-breadcrumb-item :to="item.path"  v-for="item in levellist" :key="item.meta.title">{{item.meta.title}}</el-breadcrumb-item>
          </el-breadcrumb>
          <el-container style="overflow:hidden;"><router-view/></el-container>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name:"index",
  data () {
    return {
      levellist:null,
      activeMenu:'',
    }
  },
  watch:{
    $route(){
      this.getlevellist()
    }
  },
  created(){  
    this.getLoginedUser()
  },
  mounted(){
    this.getlevellist();
    this.activeMenu = this.$route.path
    //this.$alert
  },
  computed:{
    getUsername(){
      return (this.$store.state.User.username=='')?`未登录`:this.$store.state.User.username
    }
  },
  methods:{
    //获取面包屑个数
    getlevellist(){
      let matched = this.$route.matched
      // console.log(matched);
      this.levellist=matched
      // this.$alert(this.$route.params.username);
      // console.log(this.$route);
    },
    getLoginedUser(){
        if(window.localStorage.username&&this.$store.state.User.username===''){
        this.$store.commit('changeUsername',{
          username:window.localStorage.username,
          password:window.localStorage.password
         })
      }
    },
    quit(){
      this.$store.commit('deleteUsername')
      if(window.localStorage.username!==null){
        window.localStorage.removeItem('username')
        window.localStorage.removeItem('password')
      }
      this.$router.replace(`/Login`)
    },
    loginSpan(){
      if(event.target.innerHTML==`未登录`)
      {
        this.$router.push(`/Login`)
      }
    }
    // routeInit(){

    // }
  },
  beforeRouteEnter(to, from, next) {
    next()
  }
    
  
}
</script>

<style>
.popover{
  padding: 0;
  margin: 0;
}
.popover li{
  list-style: none;
  text-align: center;
  font-size: 15px;
  transition: background-color 0.5s;
  line-height: 30px;
  height: 30px;
  cursor: pointer;
}
.popover li:hover{
  background-color:  rgba(200, 249, 255, 0.767);
}
#userAvatar{
  margin-right: 10px;
}
#usernameSpan{
  font-size: 15px;
  color:rgb(24, 128, 255);
  cursor: pointer;

}
#home{
  max-width: 1170px;
  margin: auto auto;
}
#homeHeader{
  background-color: rgba(182, 255, 249,1);
  max-width: 1170px;
  margin: 0 auto;
  height: 60px;
  width: 100%;
  vertical-align: middle;
  line-height: 60px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 80px;

}
#breadcrumb{
  padding-bottom: 10px;
  margin-bottom: 30px;
  border-bottom: 1px solid #eeeeee;
}

</style>
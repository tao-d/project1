<template>
  <div id="settings">
    <strong class="jbxxStrong">基本信息</strong>
    <el-form
      label-width="80px"
      label-position="left"
      id="settingsForm"
      :model="userInformations"
    >
      <el-form-item label="账号名">
        <el-input
          id="userName"
          v-model="userInformations.username"
          size="mini"
          disabled
        >
        </el-input>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input
          id="userName"
          v-model="userInformations.name"
          size="mini"
          placeholder="输入姓名"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="性别" size="mini">
        <el-radio-group v-model="userInformations.sex">
          <el-radio-button label="男">男</el-radio-button>
          <el-radio-button label="女">女</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="年龄">
        <el-input
          placeholder="输入年龄"
          id="userAge"
          v-model="userInformations.age"
          size="mini"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="地址">
        <el-input
          placeholder="输入地址"
          id="userAddress"
          v-model="userInformations.address"
          size="mini"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4 }"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="备注信息">
        <el-input
          placeholder="输入备注信息"
          id="userMessage"
          v-model="userInformations.message"
          size="mini"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4 }"
        >
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="btnChangeInformations">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { requestMysql } from "../../../network/index";
export default {
  name: "settings",
  data() {
    return {
      userInformations: {
        username: this.$store.state.User.username,
        sex: "",
        age: "",
        address: "",
        message: "",
        name:""
      },
    };
  },
  created() {
    this.updateInformations();
  },
  methods: {
    btnChangeInformations(){
      this.$confirm('是否需要保存信息？','提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'}).then(()=>{
            this.changeInformations();
            this.$message({
              message:'信息已保存',
              type:'success'
            })
          }).catch(()=>{
              this.$message({
              message:"已取消",
              type:'info'
            })
          })
    },


    /**
     * 修改用户信息方法
     */
    changeInformations() {
      let userInformations = {
        sex: this.userInformations.sex,
        age: this.userInformations.age,
        address: this.userInformations.address,
        user_message: this.userInformations.message,
        name:this.userInformations.name
      };
      requestMysql({
        url: "/api/user/updateUserInformations",
        data: {
          userInformations: userInformations,
          username: this.userInformations.username,
        },
        method: "post",
      }).then((res) => {
        //console.log(res);
        //this.updateInformations()
      });
    },

    /**
     * 更新用户信息方法
     */
    updateInformations(){
        requestMysql({
        url: "/api/user/userInformations",
        data: {
          username: this.userInformations.username,
        },
        method: "post",
      }).then((res) => {
        //console.log(res.data[0]);
        this.userInformations.sex = res.data[0].sex;
        this.userInformations.age = res.data[0].age;
        this.userInformations.address = res.data[0].address;
        this.userInformations.message = res.data[0].user_message;
        this.userInformations.name = res.data[0].name;
      });
    }
  },
};
</script>

<style scoped>
#settings {
  padding-left: 50px;
}
#settingsForm {
  padding-left: 100px;
  padding-top: 20px;
  width: 100%;
}
.jbxxStrong{

  margin-left: 20px;
}
</style>
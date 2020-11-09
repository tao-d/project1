<template>
  <div id="appointments">
    <el-row>
      <el-col :span="6">
      <el-input
        id="search"
        prefix-icon="el-icon-search"
        size="small"
        placeholder="按医生姓名搜索"
        v-model="searchName"
        @keyup.enter.native='searchDoctor'
      ></el-input></el-col>
    <el-col :span="6"><el-button icon="el-icon-search" type="primary" size="small" class="searchBtn" @click="searchDoctor">搜索</el-button></el-col>
    </el-row>
    <doctor-list ref="doctorList"></doctor-list>
    <!-- <el-calendar :range="['2020-10-19', '2020-11-01']">
    </el-calendar> -->
  </div>
</template>

<script>
import doctorList from "../../../components/doctorList";
import {requestMysql} from "../../../network/index.js"
export default {
  name: "appointments",
  data() {
    return {
      url: require("../../../assets/doctor.svg"),
      searchName: "",
    };
  },
  components: {
    doctorList,
  },
  methods: {
    //用医生姓名关键词搜索医生列表
    searchDoctor(){
       this.$refs.doctorList.getDoctorList(this.searchName)
    },
  },
};
</script>

<style>
#appointments {
  width: 100%;
}

#search {
  width: 178px;
}

</style>
<template>
  <li id="doctorListItem">
    <el-avatar :src="url" id="doctorAvatar" :size="64" shape="square">
    </el-avatar>
    <div id="doctorInformations">
      <div class="InformationsPart">
        <p class="doctorName doctor">姓名:{{doctor.doctor_name}}</p>
        <p class="doctorInformation doctor">简介:{{doctor.doctor_informations}}
        
        </p>
      </div>
      <div class="InformationsPart">
        <p class="doctorDepartment doctor">科室:{{doctor.doctor_department}}</p>
      </div>
    </div>
    
  </li>
</template>

<script>
export default {
  name:'doctorListItem',
  data () {
    return {
      url:require('../assets/doctor.svg')
    }
  },
  props:{
    doctor:{
        type:Object,
        default(){
        return {
          doctorName:'',
          doctorInformation:'',
          doctorDepartment:''
        }
      }
    }
  },
  methods: {
    clickItem(){
      console.log('openDialog')
      this.$emit('openDialog')
    }
  }
  
}
</script>

<style scoped>
  #doctorListItem{
    /* background: rgb(243, 243, 243); */
    min-height: 99px;
    padding-left: 30px;
    border-bottom: 1px solid rgba(220,223,230);
    display: flex;
    justify-content:flex-start;
    align-items: center;
    padding-bottom: 5px;
    cursor: pointer;
    transition: 
    background-color 0.5s,
    border 0.5s;
  }
  #doctorListItem:hover{
    background-color:  rgba(184, 250, 255,0.2);
  }
  #doctorAvatar{
    background-color: white;
    
  }
  #doctorInformations{
     height: 64px;
     max-width: 700px;
     display: block;
     margin-left: 10px;
     padding-left: 10px;
     border-left: 1px solid grey;
     
  }
  .InformationsPart{
    width: 250px;
    height: inherit;
    display: inline-block;
    margin-right: 10px;
    vertical-align: top;
    max-width: 500px;
  }
  .doctor{
    font-size: 14px;
    color: grey;
    margin: 0px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
</style>
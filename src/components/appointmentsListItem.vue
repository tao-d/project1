<template>
  <li id="appointmentsListItem">
     <el-avatar :src="url" id="doctorAvatar" :size="64" shape="square"></el-avatar>
      <div class="appointmentInformations">
      <div>
        <p>姓名:{{appointment.doctor_name}}</p>
      </div>
      <div>
        <p>科室:{{appointment.doctor_department}}</p>
        <p>预约时间:{{appointment.time}}</p>
      </div>
    </div>
    <slot name="deleteBtn" class="deleteBtn"></slot>
  </li>
</template>

<script>

export default {
  name:'appointmentsListItem',
  data(){
    return{
      url:require('../assets/doctor.svg')
    }
  },
  props:{
    appointment:{
      type:Object,
      default(){
        return{
          doctor_name:'',
          username: '',
          time: '',
          status: ''
        }
      }
    }
  }
}
</script>

<style scoped>
li{
  list-style: none;
  border-bottom: 1px solid rgba(220,223,230);
  padding-left:20px ;
  height: 20vh;
  display: flex;
  justify-content:flex-start;
  align-items: center;
  transition: 
  background-color 0.3s,
  border 0.3s;
  font-size: 14px;
  color: grey;
  cursor: pointer;
}
#doctorAvatar{
  background-color: white;
}
li:hover{
  background-color:  rgba(184, 250, 255,0.2);
  border-bottom: 1px solid rgb(188, 191, 197);
}
.appointmentInformations{
  height: 64px;
  margin-left: 10px;
  padding-left:10px ;
  border-left: 1px solid grey;
}
.appointmentInformations p{
  margin: 0px;
}

</style>
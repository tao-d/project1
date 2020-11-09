<template>
  <el-dialog
      title="预约详情"
      :visible="dialogVisible"
      id="dialogAppointments"
      top="10vh"
      @close="dialogClose"
    ></el-dialog>
</template>

<script>
export default {
  name:'appoinmentsDialog',
  data () {
    return {
      //dialogVisible:false
    }
  },
  props:{
    appointmentInformations:{
      type:Object,
    },
    dialogVisible:{
      type:Boolean,
      default:false
    }
  },
  methods:{
    dialogClose(){

    },
    dialogOpen(){
      //this.dialogVisible = true
    }
  }
}
</script>

<style>

</style>
<template>
  <div id="history">
    <appointments-list tagType="success" status="已完成"></appointments-list>
  </div>
</template>

<script>
import appointmentsList from 'components/appointmentsList.vue'
export default {
  name:'history',
  components:{
    appointmentsList
  },
  data(){
    return {
      
    }
  },
  methods:{

  }
}
</script>

<style scoped>
  #history{
    width: 100%;
  }
</style>
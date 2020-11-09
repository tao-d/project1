<template>
  <div id="mine">
    <appointments-list></appointments-list>
  </div>
</template>

<script>
import appointmentsList from 'components/appointmentsList.vue'
export default {
  name:'mine',
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

<style>
#mine{
  width: 100%;
}
</style>
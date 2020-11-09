<template>
  <div id="app">
    <router-view/>
    <!-- <login></login> -->
  </div>
</template>

<script>
import login from './views/login/login.vue'

export default {
  components: {
    login
  }
}
</script>

<style>
body{
  margin: 0px;
  padding: 0px;
}
</style>

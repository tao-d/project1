import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    User:{
      username:'',
      password:''
    }
  },
  mutations: {
    changeUsername(state,payload){
      state.User.username = payload.username
      state.User.password = payload.password
    },
    deleteUsername(state){
      state.User.username = '';
      state.User.password = ''
    }
  },
  actions: {
  },
  modules: {
  }
})

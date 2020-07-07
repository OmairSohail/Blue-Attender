import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    rollno:10000,
    user:[]
  },
  mutations: {
     addUser(state,payload)
     {
        state.rollno++;
        state.user = payload; 
     }
  },
  actions: {
    createUser:({commit},payload) => {
      commit('addUser',payload);
    }
  },
  modules: {
  }
})

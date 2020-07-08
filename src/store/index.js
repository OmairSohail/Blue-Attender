import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user:[]
  },
  mutations: {
     addUser(state,payload)
     {
        
        state.user = payload; 
     },
     removeUser(state,payload)
     {
        state.user = []; 
     }
  },
  actions: {
    createUser:({commit},payload) => {
      commit('addUser',payload);
    },
    deleteUser: ({commit}) => {
      commit('removeUser')
    }
  },
  modules: {
  }
})

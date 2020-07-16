import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user:[],
    userType:null,
  },
  mutations: {
     addUser(state,payload)
     {
        
        state.user = payload; 
     },
     removeUser(state,payload)
     {
        state.user = []; 
     },
     addUserType(state,payload)
     {
        state.userType = payload;
     }
  },
  actions: {
    createUser:({commit},payload) => {
      commit('addUser',payload);
    },
    deleteUser: ({commit}) => {
      commit('removeUser')
    },
    addType: ({commit},payload) => {
       commit('addUserType',payload);
    }
  },
  modules: {
  }
})

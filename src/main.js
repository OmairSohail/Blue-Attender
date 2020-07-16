import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router'
import store from './store'

Vue.config.productionTip = false;

// Moment
import moment from 'moment';
Vue.prototype.$moment = moment;

// FIREBASE && VUE-FIRESTORE
import firebaseConfig from './firebase';
import VueFirestore from 'vue-firestore'
// import firebase from 'firebase';
import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/database';
import 'firebase/storage';
import 'firebase/database';
// firebase.initializeApp(firebaseConfig);
// if(!app.app.length)
app.initializeApp(firebaseConfig);

Vue.use(VueFirestore,{
  key: 'id',         // the name of the property. Default is '.key'.
  enumerable: true 
});

// REALTIME PRESENCE SYSTEM FIREBASE
Vue.prototype.$firebaseApp = app;
Vue.prototype.$firebaseAuth = app.auth();
window.firebaseAuth = app.auth();
Vue.prototype.$fs = app.firestore();
Vue.prototype.$db = app.database();
window.db = app.database();
window.firebaseStorage = app.storage();

Vue.component('siteNavbar',require('./components/siteNavbar.vue').default);
Vue.component('siteFooter',require('./components/siteFooter.vue').default);

app.auth().onAuthStateChanged((user)=>{
  if(user)
  {
    const ref = app.database().ref(`users/${user.uid}`);
    ref.on('value', (snapshot) => {
      var user = snapshot.val();
      if(user.type == 'Student')
      {
        store.dispatch('addType','Student');
      }else if(user.type == 'Teacher')
      {  
        store.dispatch('addType','Teacher');
      }else if(user.type == 'Admin')
      {    
        store.dispatch('addType','Admin');      
      }
    });
  }
})


new Vue({
  vuetify,
  router,
  store,
  firestore(){
    return{

    }
  },
  render: h => h(App)
}).$mount('#app')

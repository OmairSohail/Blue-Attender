import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router'
import store from './store'

Vue.config.productionTip = false

<<<<<<< HEAD
=======


// Moment
import moment from 'moment';
Vue.prototype.$moment = moment;



>>>>>>> teacher
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
Vue.prototype.$fs = app.firestore();
Vue.prototype.$db = app.database();
<<<<<<< HEAD
Vue.prototype.$timestamp = app.database.ServerValue.TIMESTAMP;
=======
>>>>>>> teacher
window.firebaseStorage = app.storage();

Vue.component('siteNavbar',require('./components/siteNavbar.vue').default);
Vue.component('siteFooter',require('./components/siteFooter.vue').default);

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

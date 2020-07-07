import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router'
import store from './store'

Vue.config.productionTip = false







// FIREBASE && VUE-FIRESTORE
import firebaseConfig from './firebase';
import VueFirestore from 'vue-firestore'
// import firebase from 'firebase';
import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
// firebase.initializeApp(firebaseConfig);
// if(!app.app.length)
app.initializeApp(firebaseConfig);

Vue.use(VueFirestore,{
  key: 'id',         // the name of the property. Default is '.key'.
  enumerable: true 
});

Vue.prototype.$firebaseApp = app;
Vue.prototype.$firebaseAuth = app.auth();
Vue.prototype.$fs = app.firestore();
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

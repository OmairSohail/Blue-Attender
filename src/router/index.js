import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import login from '../views/login.vue';
import signup from '../views/signup.vue';
import studentdashboard from '../views/studentDashboard.vue';

import teacherdashboard from '../views/teacherDashboard.vue';
import teacherAttendence from '../views/teacherAttendence.vue';
import teacherStudents from '../views/teacherStudents.vue';
import teacherSettings from '../views/teacherSettings.vue';


import admindashboard from '../views/adminDashboard.vue';
import adminAttendence from '../views/adminAttendence.vue';
import adminSettings from '../views/adminSettings.vue';

import contact from '../views/contact.vue';


Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/contactus',
    name: 'contact',
    component: contact
  },
  {
    path: '/login',
    name: 'login',
    component: login,
    beforeEnter: (to,from,next) => {
     firebaseAuth.onAuthStateChanged((user)=>{
      if(user)
      {
        next('/');
      }else{
        next();
      }
     })
    }
  },
  {
    path: '/signup',
    name: 'signup',
    component: signup,
    beforeEnter: (to,from,next) => {
      firebaseAuth.onAuthStateChanged((user)=>{
       if(user)
       {
         next('/');
       }else{
         next();
       }
      })
     }
  },
  {
    path: '/student/dashboard',
    name: 'studentdashboard',
    component: studentdashboard,
    beforeEnter: (to, from, next) => {
      firebaseAuth.onAuthStateChanged((user)=>{
         if(user)
         {
          const id = firebaseAuth.currentUser.uid;
          const ref = db.ref(`users/${id}`);
          ref.on('value',(snapshot)=>{
             const user = snapshot.val();
             if(user.type == 'Student')
             {
               next();
             }else{
               next('/');
             }
          })
         }else{
           console.log('no User');
         }
      })
      
    }
  },
  {
    path: '/teacher/dashboard',
    name: 'teacherdashboard',
    component: teacherdashboard,
    beforeEnter: (to, from, next) => {
      firebaseAuth.onAuthStateChanged((user)=>{
         if(user)
         {
          const id = firebaseAuth.currentUser.uid;
          const ref = db.ref(`users/${id}`);
          ref.on('value',(snapshot)=>{
             const user = snapshot.val();
             if(user.type == 'Teacher')
             {
               next();
             }else{
               next('/');
             }
          })
         }else{
           console.log('no User');
         }
      })
      
    },
    children:[
      {
        name: 'teacherAttendence',
        path: 'attendence',
        component:teacherAttendence
      },
      {
        name: 'teacherStudents',
        path: 'students',
        component:teacherStudents
      },
      {
        name: 'teacherSettings',
        path: 'settings',
        component:teacherSettings
      }
    ]
  },
  {
    path: '/admin/dashboard',
    name: 'admindashboard',
    component: admindashboard,
    beforeEnter: (to, from, next) => {
      firebaseAuth.onAuthStateChanged((user)=>{
         if(user)
         {
          const id = firebaseAuth.currentUser.uid;
          const ref = db.ref(`users/${id}`);
          ref.on('value',(snapshot)=>{
             const user = snapshot.val();
             if(user.type == 'Admin')
             {
               next();
             }else{
               next('/');
             }
          })
         }else{
           console.log('no User');
         }
      })
      
    },
    children:[
      {
        name:'adminAttendence',
        path:'attendence',
        component:adminAttendence
      },
      {
        name:'adminSettings',
        path:'settings',
        component:adminSettings
      }
    ]
    
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})



export default router

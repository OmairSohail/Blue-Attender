import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import login from '../views/login.vue';
import studentdashboard from '../views/studentDashboard.vue';


import teacherdashboard from '../views/teacherDashboard.vue';
import teacherAttendence from '../views/teacherAttendence.vue';
import teacherStudents from '../views/teacherStudents.vue';
import teacherSettings from '../views/teacherSettings.vue';


import admindashboard from '../views/adminDashboard.vue';
import adminClasses from '../views/adminClasses.vue';
import adminSettings from '../views/adminSettings.vue';

import signup from '../views/signup.vue';


Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'login',
    component: login
  },
  {
    path: '/signup',
    name: 'signup',
    component: signup
  },
  {
    path: '/student/dashboard',
    name: 'studentdashboard',
    component: studentdashboard
  },
  {
    path: '/teacher/dashboard',
    name: 'teacherdashboard',
    component: teacherdashboard,
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
    children:[
      {
        name:'adminClasses',
        path:'classes',
        component:adminClasses
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

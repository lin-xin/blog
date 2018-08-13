import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Register from './views/Register.vue';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {requireAuth: true}
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {requireAuth: false}
    },
    {
      path: '/reg',
      name: 'register',
      component: Register,
      meta: {requireAuth: false}
    }
  ]
})

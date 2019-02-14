import Vue from 'vue'
import Router from 'vue-router'
// 导入Login组件
import Login from '@/components/Login'
// 导入Home组件
import Home from '@/components/Home'
Vue.use(Router)

export default new Router({
  routes: [
    { path: '/login', component: Login },
    { path: '/home', component: Home }
  ]
})

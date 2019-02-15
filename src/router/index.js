import Vue from 'vue'
import Router from 'vue-router'
// 导入Login组件
import Login from '@/components/Login'
// 导入Home组件
import Home from '@/components/Home'
// 导入第三级组件Welcome
import Welcome from '@/components/Welcome'
Vue.use(Router)
var router = new Router({
  routes: [
    { path: '/login', component: Login },
    { path: '/', redirect: '/home' },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome', 
      children: [{
        path: '/welcome',
        component: Welcome
      }]
    }
  ]
})
// 路由导航守卫
router.beforeEach((to, from, next) => {
  // 访问访问login 直接通过
  if (to.path === '/login') {
    return next()
  }
  // 非login页面
  var token = window.sessionStorage.getItem('token')
  if (!token) {
    return next('/login')
  }
  next()
})
export default router

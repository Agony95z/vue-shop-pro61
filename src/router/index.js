import Vue from 'vue'
import Router from 'vue-router'
// 导入Login组件
import Login from '@/components/Login'
// 导入Home组件
import Home from '@/components/Home'
// 导入第三级组件Welcome
import Welcome from '@/components/Welcome'
// 导入第三级组件User
import User from '@/components/User'
// 导入第三级组件Rights权限管理
import Rights from '@/components/Rights'
// 导入角色管理组件
import Roles from '@/components/Roles'
// 导入分类组件
import Categories from '@/components/Categories'
// 导入商品参数组件
import Params from '@/components/Params'
// 导入商品介绍组件
import Goods from '@/components/Goods'
import GoodsAdd from '@/components/GoodsAdd'
// 导入报表
import Report from '@/components/Report'
Vue.use(Router)
var router = new Router({
  routes: [
    { path: '/login', component: Login },
    { path: '/', redirect: '/home' },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: User },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Roles },
        { path: '/categories', component: Categories },
        { path: '/params', component: Params },
        { path: '/goods', component: Goods },
        { path: '/goodsadd', component: GoodsAdd },
        { path: '/reports', component: Report }
      ]
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

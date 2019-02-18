import Vue from 'vue'
import App from './App'
import router from './router'
// 导入全局样式
import './assets/css/global.css'
// 引入element-ui
import ElementUI from 'element-ui'
// 导入font字体
import './assets/fonts/iconfont.css'
import './assets/fonts1/iconfont.css'
// 引入axios
import axios from 'axios'
// 给axios做配置
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios
// 请求拦截器
axios.interceptors.request.use(function(config) {
  var token = window.sessionStorage.getItem('token')
  config.headers.Authorization = token
  console.log(config)
  return config
}, function(error) {
  return Promise.reject(error)
})
Vue.use(ElementUI)
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})

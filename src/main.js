import Vue from 'vue'
import App from './App'
import router from './router'
// 导入全局样式
import './assets/css/global.css'
// 引入element-ui
// 打包上线尽量减少不必要的资源浪费，所以按需导入
// import ElementUI from 'element-ui'
// 导入font字体
import './assets/fonts/iconfont.css'
import './assets/fonts1/iconfont.css'
// 引入axios
import axios from 'axios'
// 引入nprogress模块，显示“进度条”效果
import NProgress from 'nprogress'
// 引入nprogress模块需要的css样式
// index.html文件中已经引入了所以这里注释掉
// import 'nprogress/nprogress.css'
// 导入ZkTable 商品分类列表封装
import ZkTable from 'vue-table-with-tree-grid'
// ElementUI按需引入
// 给ElementUI做按需导入配置
import {
  Pagination,
  Dialog,
  Menu,
  Submenu,
  MenuItem,
  Input,
  Checkbox,
  CheckboxGroup,
  Switch,
  Select,
  Option,
  Button,
  Table,
  TableColumn,
  Tooltip,
  Breadcrumb,
  BreadcrumbItem,
  Form,
  FormItem,
  Tabs,
  TabPane,
  Tag,
  Tree,
  Alert,
  Icon,
  Row,
  Col,
  Upload,
  Card,
  Steps,
  Step,
  Cascader,
  Container,
  Header,
  Aside,
  Main,
  MessageBox,
  Message
} from 'element-ui'

Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Input)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Switch)
Vue.use(Select)
Vue.use(Option)
Vue.use(Button)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Tooltip)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Alert)
Vue.use(Icon)
Vue.use(Row)
Vue.use(Col)
Vue.use(Upload)
Vue.use(Card)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Cascader)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)

Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$message = Message
Vue.use(ZkTable)
// 给axios做配置
axios.defaults.baseURL = 'http://127.0.0.1:8765/api/private/v1/'
Vue.prototype.$http = axios
// 请求拦截器
// 因为后台系统的每个页面都需要从后台拿数据发送请求，所以可以在拦截器中设置
axios.interceptors.request.use(function(config) {
  // 设置开始进度条
  NProgress.start()
  var token = window.sessionStorage.getItem('token')
  config.headers.Authorization = token
  return config
}, function(error) {
  return Promise.reject(error)
})
// 响应拦截器
axios.interceptors.response.use(function(response) {
  // 结束进度条的显示
  NProgress.done()
  return response
}, function(error) {
  return Promise.reject(error)
})
// Vue.use(ElementUI)
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})

import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
import store from './store'
import gobel from './globalFun.js'

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import myaxios from '@/api'
import qs from 'qs'

//导入common.js工具类
import {
  getCurDate,
  setSessionStorage,
  getSessionStorage,
  removeSessionStorage,
  setLocalStorage,
  getLocalStorage,
  removeLocalStorage,
} from './common.js'

Vue.use(Element)

//引入axios对象挂载Vue对象。  任何组件中直接使用axios对象。直接 this.$axios.方法()
Vue.prototype.$axios = myaxios
Vue.prototype.$qs = qs
Vue.prototype.$getCurDate = getCurDate
Vue.prototype.$setSessionStorage = setSessionStorage
Vue.prototype.$getSessionStorage = getSessionStorage
Vue.prototype.$removeSessionStorage = removeSessionStorage
Vue.prototype.$setLocalStorage = setLocalStorage
Vue.prototype.$getLocalStorage = getLocalStorage
Vue.prototype.$removeLocalStorage = removeLocalStorage

Vue.config.productionTip = false

//引入mock.js  关闭mock，注释
// require('./mock.js')

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')

import Vue from 'vue'
import Vuex from 'vuex'
import menu from './modules/menu'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '',
  },
  mutations: {
    SET_TOKEN: (state, tokenValue) => {
      state.token = tokenValue
      //token利用本地化存储机制。
      localStorage.setItem('token', tokenValue)
    },
    RESET_TOKEN: (state, tokenValue) => {
      state.token = ''
      localStorage.removeItem('token')
    },
  },
  actions: {},
  modules: {
    // 子模块：独立vuex: 包含state、mutations、actions
    menu,
  },
})

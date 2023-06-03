//菜单独立的Vuex模块
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default {
  state: {
    //存储菜单的数据
    menuList: [],
    //存储权限列表
    permList: [],
    //记录是否已经加载菜单
    hasRoute: false,

    //记录打开选项卡：
    editableTabs: [
      {
        icon: 'el-icon-s-home',
        title: '首页',
        name: 'Home',
      },
    ],
    editableTabsValue: 'User', //目前正在编辑的选项卡 ，属性值就是 选项卡对象中name的值
  },
  mutations: {
    changeRouteStatus(state, value) {
      state.hasRoute = value //value就是true或者false
      //为了在页面更加方便的取到这个值，所以往sessionStorage中存一份
      sessionStorage.setItem('hasRoute', value)
    },
    //用来往 menuList 存储菜单数据
    setMenuList(state, menuValue) {
      state.menuList = menuValue
    },
    //用来往 permList 存储权限数据
    setPermList(state, authoritys) {
      state.permList = authoritys
    },

    //添加选项卡的方法
    addTabs(state, newTab) {
      //对于重复添加选项卡需要做处理   findIndex(查找条件)根据查找条件找到数据中的元素，返回下标
      //如果数组中某一个选项卡的name和新添加的选项卡name一样，返回它下标
      //如果数组中没有找到  返回 -1
      let index = state.editableTabs.findIndex(item => item.name == newTab.name)

      if (index == -1) {
        //将新的选项卡添加到现有的数组中
        state.editableTabs.push(newTab)
      }

      //反之如果添加的新的选项卡已经存在数组中，就直接将它激活
      //设置新加入的选项卡为激活的选项卡
      state.editableTabsValue = newTab.name
    },
  },
}

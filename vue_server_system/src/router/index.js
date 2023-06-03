import Vue from 'vue'
import VueRouter from 'vue-router'
// import Index from '@/views/Index.vue'
import Login from '@/views/Login.vue'
import NotFound from '@/views/NotFound'
//导入vuex
import store from '@/store'
import axios from 'axios'

Vue.use(VueRouter)

const routes = [
  {
    name: 'Index',
    path: '/',
    component: () => import('@/views/Index.vue'),
    children: [
      {
        name:'Home',
        path:'/home',
        component: () => import('@/views/Home.vue'),
      },
      {
        path: '/setpwd',
        name: 'SetPwd',
        component: () => import('@/views/SetPwd.vue'),
        meta: {
          icon: 'el-icon-paperclip',
          title: '修改密码',
        },
      },
      {
        path: '/myuser',
        name:'MyUser',
        component:()=>import('@/views/system/MyUser'),
        meta:{
          icon:'el-icon-user',
          title: '个人中心',
        }
      },
    ],
  },
  {
    name: 'Index',
    path: '/index',
    // component: Index,
    //直接动态导入 Index.vue
    component: () => import('@/views/Index.vue'),
  },
  {
    name: 'Login',
    path: '/login',
    component: Login,
  },
  {
    name: 'NotFound',
    path: '/notfound',
    component: NotFound,
  },
  {
    name: 'Dept',
    path: '/dept',
    component: () => import('@/views/Dept.vue'),
  },
]

const router = new VueRouter({
  routes,
})

//定义路由守卫，在此使用axios请求  服务器 /menu/nav地址获得菜单数据or权限数据 ，并且动态配置路由
router.beforeEach((to, from, next) => {
  //读取 Vuex中modules中menu存储的状态 hasRoute变量，判断是否加载过菜单
  // store.state.子模块.子模块state变量
  let hasRoute = store.state.menu.hasRoute
  let token = localStorage.getItem('token') //如果是登录过，token有值，否则没有

  if (to.path == '/login') {
    next()
  } else if (!token) {
    //如果token为false，那么没有登录，取反true，执行该语句块，跳转到登录页面
    next({ path: '/login' })
  } else if (to.path == '/' || to.params == '') {
    next({ path: '/home' })
  } else if (!hasRoute) {
    //获得上面配置 路由对象
    let routes = router.options.routes

    //加载菜单 --- 使用axios请求 /menu/nav
    axios
      .get('/menu/nav', {
        //给现在axios对象加上请求头，请求头包含token。
        headers: {
          token: localStorage.getItem('token'),
        },
      })
      .then(response => {
        console.log('菜单数据', response.data.resultdata.nav)
        //获得服务器菜单的数据，并且存储到Vuex 的menu子模块的menuList中
        store.commit('setMenuList', response.data.resultdata.nav)
        store.commit('setPermList', response.data.resultdata.authoritys) //存储权限数据到vuex的menu子模块中

        //需要配置动态路由:
        response.data.resultdata.nav.forEach(menu => {
          //循环 一级菜单的二级菜单
          if (menu.children) {
            menu.children.forEach(childMenu => {
              //调用下面封装的  菜单对象转换为 路由对象的方法，接收配置路由对象route
              let route = menuToRoute(childMenu)

              if (route) {
                routes[0].children.push(route) //将菜单动态创建的路由对象添加到现有 路由配置中。加在 / 下面所有二级路由
              }
            })
          }
        })

        //需要将上面新的路由配置，加到现在的路由
        router.addRoutes(routes) //新的路由配置就生效了  addRoutes(路由规则)
        // for (let o in routes) {
        //   router.addRoute(o) //router.addRoute(单一路由规则)
        // }

        store.commit('changeRouteStatus', true) //修改vuex下面子模块menu中hasRoute的值为true，表示加载过菜单
        next({ path: to.path })
      })
  } else {
    //已经加载过菜单并且动态配置路由，直接next()
    next()
  }
})

//封装一个方法，将菜单格式对象 转换为  路由格式对象
const menuToRoute = childMenu => {
  if (!childMenu.component) {
    return null
  }

  //定义一个路由配置对象。
  let route = {
    name: childMenu.name,
    path: childMenu.path,
    //使用Tabs选项卡，要获得icon，title。
    meta: {
      icon: childMenu.icon,
      title: childMenu.title,
    },
  }
  route.component = () => import('@/views/' + childMenu.component + '.vue')
  return route
}

export default router

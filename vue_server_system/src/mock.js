//引入mock.js
const Mock = require('mockjs')

//服务器端返回Vue的数据格式： 操作成功的返回对象
let Result = {
  code: 20000, //200请求操作成功
  message: '操作成功',
  resultdata: null, //data就是具体请求的数据
}

//需要使用Mock产生随机码
const Random = Mock.Random

//模拟服务器生存验证码操作。   /captcha
/*
Mock.mock( url,ppst/get,function(){})
url参数1：请求路径
参数2：请求方式
参数3：用于生存响应数据（服务器返回数据）的函数。
*/
Mock.mock('/api/captchae', 'get', () => {
  Result.code = 20000
  Result.message = '验证码请求成功'
  Result.resultdata = {
    key: Random.string(32), //获得一个32为的随机字符串
    captchaImg: Random.dataImage('120x40', '5Wn3q'), //生成验证码为5Wn3q一个Base64转码的图片字符串
  }
  return Result //Result就是服务器返回的JSON 数据对象。
})

//登录操作成功---- 没有数据返回。只要返回状态码code和操作信息 message
Mock.mock('/api/login', 'post', () => {
  console.log('mock模拟登录操作的代码执行了...')
  //直接返回Result对象即可，code是200，message是操作成功，代表模拟的就是登录操作成功了。
  // 登录成功，返回token不是在Result中，而是通过response响应对象使用响应头传递回来。

  //登录失败
  // Result.code = 10002
  // Result.message = '账户的密码错误'

  //登录成功
  Result.code = 20000
  Result.message = '登录操作成功'
  return Result
})

//修改用户的密码
Mock.mock('/api/updatePass', 'post', () => {
  //修改密码成功
  Result.code = 20000
  Result.message = '修改密码操作成功'
  return Result
})

//模拟服务器请求获得菜单数据，
Mock.mock('/menu/nav', 'get', () => {
  //模拟服务器返回一个菜单数据  JSON对象数组：
  let nav = [
    {
      id: 1,
      title: '系统管理',
      icon: 'el-icon-s-operation',
      path: '',
      name: 'sys:manage',
      perms: null,
      component: '',
      children: [
        {
          id: 2,
          title: '用户管理',
          icon: 'el-icon-s-custom',
          path: '/sys/users',
          name: 'sys:user:list',
          perms: null,
          component: 'system/User',
          children: [],
        },
        {
          id: 3,
          title: '角色管理',
          icon: 'el-icon-rank',
          path: '/sys/roles',
          name: 'sys:role:list',
          perms: null,
          component: 'system/Roles',
          children: [],
        },
        {
          id: 4,
          title: '菜单管理',
          icon: 'el-icon-menu',
          path: '/sys/menus',
          name: 'sys:menu:list',
          perms: null,
          component: 'system/Menu',
          children: [],
        },
      ],
    },
    {
      id: 5,
      title: '数据管理',
      icon: 'el-icon-s-tools',
      path: '',
      name: 'sys:tools',
      perms: null,
      component: null,
      children: [
        {
          id: 40,
          title: '数据展示',
          icon: 'el-icon-bangzhu',
          path: '/userCenter',
          name: 'sys:dataShow:list',
          perms: null,
          component: 'UserCenter',
          children: [],
        },
      ],
    },
    {
      id: 26,
      title: '影院管理',
      icon: 'el-icon-s-operation',
      path: null,
      name: 'sys:mv:manager',
      perms: null,
      component: null,
      children: [
        {
          id: 27,
          title: '类别管理',
          icon: 'el-icon-s-operation',
          path: '/sys/category',
          name: 'sys:type:list',
          perms: null,
          component: 'system/Category',
          children: [],
        },
        {
          id: 32,
          title: '排片管理',
          icon: 'el-icon-s-promotion',
          path: '/sys/arrangement',
          name: 'sys:arrangement',
          perms: null,
          component: 'system/arrangement',
          children: [],
        },
        {
          id: 33,
          title: '轮播图管理',
          icon: 'el-icon-s-promotion',
          path: '/sys/poster',
          name: 'sys:poster:list',
          perms: null,
          component: 'system/Poster',
          children: [],
        },
        {
          id: 34,
          title: '电影管理',
          icon: 'el-icon-s-promotion',
          path: '/sys/film',
          name: 'sys:film:list',
          perms: null,
          component: 'system/Film',
          children: [],
        },
      ],
    },
    {
      id: 39,
      title: '前台用户管理',
      icon: 'el-icon-s-custom',
      path: null,
      name: 'sys;fans:list',
      perms: null,
      component: null,
      children: [
        {
          id: 31,
          title: '粉丝管理',
          icon: 'el-icon-s-promotion',
          path: '/sys/fans',
          name: 'sys:fans:list',
          perms: null,
          component: 'system/Fans',
          children: [],
        },
        {
          id: 35,
          title: '电影评论管理',
          icon: 'el-icon-date',
          path: '/sys/evaluate',
          name: 'sys:evaluate:list',
          perms: null,
          component: 'system/Evaluate',
          children: [],
        },
        {
          id: 36,
          title: '订单管理',
          icon: 'el-icon-folder-checked',
          path: '/sys/order',
          name: 'sys:order:list',
          perms: null,
          component: 'system/Order',
          children: [],
        },
      ],
    },
  ]

  //定义数组，返回是权限数组
  let authoritys = [
    'ROLE_normal',
    'ROLE_admin',
    'sys:manage',
    'sys:user:list',
    'sys:role:list',
    'sys:menu:list',
    'sys:tools',
    'sys:role:save',
    'sys:user:save',
    'sys:user:update',
    'sys:user:delete',
    'sys:user:role',
    'sys:user:repass',
    'sys:role:update',
    'sys:role:delete',
    'sys:role:perm',
    'sys:menu:save',
    'sys:menu:update',
    'sys:menu:delete',
    'sys:mv:manager',
    'sys:type:list',
    'sys:type:save',
    'sys:type:update',
    'sys:type:delete',
    'sys:fans:list',
    'sys:arrangement',
    'sys:poster:list',
    'sys:film:list',
    'sys:evaluate:list',
    'sys:order:list',
    'sys;fans:list',
    'sys:dataShow:list',
  ]

  Result.code = 20000
  Result.message = '菜单数据请求成功'
  Result.resultdata = { nav: nav, authoritys: authoritys }

  return Result
})

//登录后，跳转至首页，通过登录的用户名获取用户的详细信息
//  /user/userinfo/XXXXX   为了能够动态匹配路径，使用正则表达式进行路径匹配
Mock.mock(RegExp('/user/userinfo/*'), 'get', () => {
  //假设，传递参数username就是ByteRain，到数据库根据用户名ByteRain查询出该用户所有的详细信息并返回客户端
  Result.code = 20000
  Result.message = '查询用户详细信息成功'
  Result.resultdata = {
    id: 1,
    username: 'Admin',
    avatar:
      'https://img2.baidu.com/it/u=2212383468,857153027&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
    email: 'test@qq.com',
    tel: '13367678899',
  }

  return Result
})

///获得所有用户的信息////
//实际请求:  /system/user/list/2
Mock.mock(RegExp('/system/user/list*'), 'get', () => {
  Result.code = 20000
  Result.message = '请求用户数据成功'
  Result.resultdata = {
    records: [
      {
        id: 1,
        created: '2021-01-12T22:13:53',
        updated: '2021-01-16T16:57:32',
        statu: 1,
        username: 'admin',
        password:
          '$2a$10$oPaOFhl1IYrUgHj3kcpW7OJYR9N9wGudceRdNVIs8aSY4Q7rLCGuK', //123123
        avatar:
          'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fblog%2F202107%2F09%2F20210709142454_dc8dc.thumb.1000_0.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1666333236&t=3733d94221afc7ea3189dc0ffa30fd47',
        email: '999@qq.com',
        tel: '15343517807',
        lastLogin: '2020-12-30T08:38:37',
        roles: [
          {
            id: 6,
            created: '2021-01-16T13:29:03',
            updated: '2021-01-17T15:50:45',
            statu: 1,
            name: '超级管理员',
            code: 'admin',
            remark: '系统默认最高权限，不可以编辑和任意修改',
            menuIds: [],
          },
          {
            id: 3,
            created: '2021-01-04T10:09:14',
            updated: '2021-01-30T08:19:52',
            statu: 1,
            name: '普通用户',
            code: 'normal',
            remark: '只有基本查看功能',
            menuIds: [],
          },
        ],
      },
      {
        id: 2,
        created: '2021-01-30T08:20:22',
        updated: '2021-01-30T08:55:57',
        statu: 0,
        username: 'test',
        password:
          '$2a$10$oPaOFhl1IYrUgHj3kcpW7OJYR9N9wGudceRdNVIs8aSY4Q7rLCGuK',
        avatar:
          'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F201908%2F19%2F20190819150344_ALnaX.thumb.1000_0.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1666333236&t=a23b8c8c9f154ea09f54728b6e04e7f9',
        email: 'test@qq.com',
        tel: 133667788899,
        lastLogin: null,
        roles: [
          {
            id: 3,
            created: '2021-01-04T10:09:14',
            updated: '2021-01-30T08:19:52',
            statu: 1,
            name: '普通用户',
            code: 'normal',
            remark: '只有基本查看功能',
            menuIds: [],
          },
        ],
      },
    ],
    total: 2,
    size: 10,
    current: 1,
    orders: [],
    optimizeCountSql: true,
    hitCount: false,
    countId: null,
    maxLimit: null,
    searchCount: true,
    pages: 1,
  }
  return Result
})

//根据用户的编号删除用户信息    post的参数是在请求体中，不会显示在地址栏，也就是post不能使用浏览器地址栏传参
Mock.mock('/system/user/delete', 'post', () => {
  Result.code = 20000
  Result.message = '删除用户信息成功'
  Result.resultdata = null
  return Result
})

//新建用户保存用户的方法
Mock.mock('/system/user/save', 'post', () => {
  Result.code = 20000
  Result.message = '新建用户信息成功'
  Result.resultdata = null
  return Result
})

//更新用户保存用户的方法
Mock.mock('/system/user/update', 'post', () => {
  Result.code = 20000
  Result.message = '更新用户信息成功'
  Result.resultdata = null
  return Result
})

//根据用户的编号id，查询该用户的信息   /*传递的id   实际路径 /user/userinfo/1
Mock.mock(RegExp('/user/userinfo/*'), 'get', () => {
  //假设，传递参数username就是ByteRain，到数据库根据用户名ByteRain查询出该用户所有的详细信息并返回客户端
  Result.code = 20000
  Result.message = '查询用户详细信息成功'
  Result.resultdata = {
    id: 1,
    username: 'Admin',
    avatar:
      'https://img2.baidu.com/it/u=2212383468,857153027&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
    email: 'test@qq.com',
    tel: '13367678899',
  }
  return Result
})

//重置用户的密码
Mock.mock('/system/user/repass', 'post', () => {
  Result.code = 20000
  Result.message = '重置密码操作成功'
  Result.resultdata = null
  return Result
})

/////////////////////////////////////////////////////////////////////////////////
//模拟请求Java服务器，返回数据库中所有 角色的信息
Mock.mock(RegExp('/system/role/list*'), 'get', () => {
  Result.code = 20000
  Result.message = '请求角色列表信息成功'
  Result.resultdata = {
    records: [
      {
        id: 3,
        created: '2021-01-04T10:09:14',
        updated: '2021-01-30T08:19:52',
        statu: 1,
        name: '普通用户',
        code: 'normal',
        remark: '只有基本查看功能',
        menuIds: [],
      },
      {
        id: 6,
        created: '2021-01-16T13:29:03',
        updated: '2021-01-17T15:50:45',
        statu: 0,
        name: '超级管理员',
        code: 'admin',
        remark: '系统默认最高权限，不可以编辑和任意修改 ',
        menuIds: [],
      },
    ],
    total: 2,
    size: 10,
    current: 1,
    orders: [],
    optimizeCountSql: true,
    hitCount: false,
    countId: null,
    maxLimit: null,
    searchCount: true,
    pages: 1,
  }

  return Result
})

//模拟服务器执行了  删除角色的方法
Mock.mock('/system/role/delete', 'post', () => {
  Result.code = 20000
  Result.message = '删除角色信息成功'
  Result.resultdata = null
  return Result
})

//模拟Java服务器代码执行 保存角色信息
Mock.mock('/system/role/save', 'post', () => {
  Result.code = 20000
  Result.message = '新建角色成功'
  Result.resultdata = null
  return Result
})

//模拟Java服务器代码执行 更新角色方法
Mock.mock('/system/role/update', 'post', () => {
  Result.code = 20000
  Result.message = '更新角色信息成功'
  Result.resultdata = null
  return Result
})

//根据角色 编号 id，查询该角色详细信息    /role/roleinfo/22
Mock.mock(RegExp('/role/roleinfo/*'), 'get', () => {
  //假设，传递参数username就是ByteRain，到数据库根据用户名ByteRain查询出该用户所有的详细信息并返回客户端
  Result.code = 20000
  Result.message = '查询角色详细信息成功'
  Result.resultdata = {
    id: 6,
    created: '2021-01-16T13:29:03',
    updated: '2021-01-17T15:50:45',
    statu: 0,
    name: '超级管理员',
    code: 'admin',
    remark: '系统默认最高权限，不可以编辑和任意修改 ',
    menuIds: [],
  }
  return Result
})

///////////////////////////////////////////////////////////////////////////
//模拟请求Java服务器，获得所有的菜单数据
Mock.mock('/system/menu/list', 'get', () => {
  let menus = [
    {
      id: 1,
      created: '2022-11-03T18:58:18',
      updated: '2022-11-03T18:58:18',
      statu: 1,
      parentId: 0,
      name: '系统管理',
      path: '',
      perms: 'sys:manage',
      component: '',
      type: 0,
      icon: 'el-icon-s-operation',
      ordernum: 1,
      children: [
        {
          id: 2,
          created: '2022-11-03T18:58:18',
          updated: '2022-11-03T18:58:18',
          statu: 1,
          parentId: 1,
          name: '用户管理',
          path: '/sys/users',
          perms: 'sys:user:list',
          component: 'sys/User',
          type: 1,
          icon: 'el-icon-s-custom',
          ordernum: 1,
          children: [
            {
              id: 9,
              created: '2022-11-03T18:58:18',
              updated: null,
              statu: 1,
              parentId: 2,
              name: '添加用户',
              path: null,
              perms: 'sys:user:save',
              component: null,
              type: 2,
              icon: null,
              ordernum: 1,
              children: [],
            },
            {
              id: 10,
              created: '2022-11-03T18:58:18',
              updated: '2022-11-03T18:58:18',
              statu: 1,
              parentId: 2,
              name: '修改用户',
              path: null,
              perms: 'sys:user:update',
              component: null,
              type: 2,
              icon: null,
              ordernum: 2,
              children: [],
            },
            {
              id: 11,
              created: '2022-11-03T18:58:18',
              updated: null,
              statu: 1,
              parentId: 2,
              name: '删除用户',
              path: null,
              perms: 'sys:user:delete',
              component: null,
              type: 2,
              icon: null,
              ordernum: 3,
              children: [],
            },
            {
              id: 12,
              created: '2022-11-03T18:58:18',
              updated: null,
              statu: 1,
              parentId: 2,
              name: '分配角色',
              path: null,
              perms: 'sys:user:role',
              component: null,
              type: 2,
              icon: null,
              ordernum: 4,
              children: [],
            },
            {
              id: 13,
              created: '2022-11-03T18:58:18',
              updated: null,
              statu: 1,
              parentId: 2,
              name: '重置密码',
              path: null,
              perms: 'sys:user:repass',
              component: null,
              type: 2,
              icon: null,
              ordernum: 5,
              children: [],
            },
          ],
        },
        {
          id: 3,
          created: '2022-11-03T18:58:18',
          updated: '2022-11-03T18:58:18',
          statu: 1,
          parentId: 1,
          name: '角色管理',
          path: '/sys/roles',
          perms: 'sys:role:list',
          component: 'sys/Role',
          type: 1,
          icon: 'el-icon-rank',
          ordernum: 2,
          children: [
            {
              id: 7,
              created: '2022-11-03T18:58:18',
              updated: '2022-11-03T18:58:18',
              statu: 0,
              parentId: 3,
              name: '添加角色',
              path: '',
              perms: 'sys:role:save',
              component: '',
              type: 2,
              icon: '',
              ordernum: 1,
              children: [],
            },
            {
              id: 14,
              created: '2022-11-03T18:58:18',
              updated: null,
              statu: 1,
              parentId: 3,
              name: '修改角色',
              path: null,
              perms: 'sys:role:update',
              component: null,
              type: 2,
              icon: null,
              ordernum: 2,
              children: [],
            },
            {
              id: 15,
              created: '2022-11-03T18:58:18',
              updated: null,
              statu: 1,
              parentId: 3,
              name: '删除角色',
              path: null,
              perms: 'sys:role:delete',
              component: null,
              type: 2,
              icon: null,
              ordernum: 3,
              children: [],
            },
            {
              id: 16,
              created: '2022-11-03T18:58:18',
              updated: null,
              statu: 1,
              parentId: 3,
              name: '分配权限',
              path: null,
              perms: 'sys:role:perm',
              component: null,
              type: 2,
              icon: null,
              ordernum: 5,
              children: [],
            },
          ],
        },
        {
          id: 4,
          created: '2022-11-03T18:58:18',
          updated: '2022-11-03T18:58:18',
          statu: 1,
          parentId: 1,
          name: '菜单管理',
          path: '/sys/menus',
          perms: 'sys:menu:list',
          component: 'sys/Menu',
          type: 1,
          icon: 'el-icon-menu',
          ordernum: 3,
          children: [
            {
              id: 17,
              created: '2022-11-03T18:58:18',
              updated: '2022-11-03T18:58:18',
              statu: 1,
              parentId: 4,
              name: '添加菜单',
              path: null,
              perms: 'sys:menu:save',
              component: null,
              type: 2,
              icon: null,
              ordernum: 1,
              children: [],
            },
            {
              id: 18,
              created: '2022-11-03T18:58:18',
              updated: null,
              statu: 1,
              parentId: 4,
              name: '修改菜单',
              path: null,
              perms: 'sys:menu:update',
              component: null,
              type: 2,
              icon: null,
              ordernum: 2,
              children: [],
            },
            {
              id: 19,
              created: '2022-11-03T18:58:18',
              updated: null,
              statu: 1,
              parentId: 4,
              name: '删除菜单',
              path: null,
              perms: 'sys:menu:delete',
              component: null,
              type: 2,
              icon: null,
              ordernum: 3,
              children: [],
            },
          ],
        },
      ],
    },
    {
      id: 5,
      created: '2022-11-03T18:58:18',
      updated: '2022-12-13T17:39:32',
      statu: 1,
      parentId: 0,
      name: '数据管理',
      path: '',
      perms: 'sys:tools',
      component: null,
      type: 0,
      icon: 'el-icon-s-tools',
      ordernum: 2,
      children: [
        {
          id: 40,
          created: '2022-12-13T17:43:50',
          updated: null,
          statu: 1,
          parentId: 5,
          name: '数据展示',
          path: '/userCenter',
          perms: 'sys:dataShow:list',
          component: 'UserCenter',
          type: 1,
          icon: 'el-icon-bangzhu',
          ordernum: 1,
          children: [],
        },
      ],
    },
    {
      id: 26,
      created: '2022-12-07T17:44:57',
      updated: null,
      statu: 1,
      parentId: 0,
      name: '影院管理',
      path: null,
      perms: 'sys:mv:manager',
      component: null,
      type: 0,
      icon: 'el-icon-s-operation',
      ordernum: 1,
      children: [
        {
          id: 27,
          created: '2022-12-07T17:50:06',
          updated: '2022-12-07T17:52:24',
          statu: 1,
          parentId: 26,
          name: '类别管理',
          path: '/sys/category',
          perms: 'sys:type:list',
          component: 'sys/Category',
          type: 1,
          icon: 'el-icon-s-operation',
          ordernum: 1,
          children: [
            {
              id: 28,
              created: '2022-12-07T19:10:07',
              updated: '2022-12-08T16:20:38',
              statu: 1,
              parentId: 27,
              name: '分类增加',
              path: null,
              perms: 'sys:type:save',
              component: null,
              type: 2,
              icon: null,
              ordernum: 1,
              children: [],
            },
            {
              id: 29,
              created: '2022-12-07T19:10:40',
              updated: '2022-12-08T16:20:55',
              statu: 1,
              parentId: 27,
              name: '分类修改',
              path: null,
              perms: 'sys:type:update',
              component: null,
              type: 2,
              icon: null,
              ordernum: 1,
              children: [],
            },
            {
              id: 30,
              created: '2022-12-07T19:11:00',
              updated: '2022-12-08T16:21:07',
              statu: 1,
              parentId: 27,
              name: '分类删除',
              path: null,
              perms: 'sys:type:delete',
              component: null,
              type: 2,
              icon: null,
              ordernum: 1,
              children: [],
            },
          ],
        },
        {
          id: 32,
          created: '2022-12-08T16:18:02',
          updated: null,
          statu: 1,
          parentId: 26,
          name: '排片管理',
          path: '/sys/arrangement',
          perms: 'sys:arrangement',
          component: 'sys/arrangement',
          type: 1,
          icon: 'el-icon-s-promotion',
          ordernum: 1,
          children: [],
        },
        {
          id: 33,
          created: '2022-12-08T16:19:08',
          updated: '2022-12-08T21:30:14',
          statu: 1,
          parentId: 26,
          name: '轮播图管理',
          path: '/sys/poster',
          perms: 'sys:poster:list',
          component: 'sys/Poster',
          type: 1,
          icon: 'el-icon-s-promotion',
          ordernum: 1,
          children: [],
        },
        {
          id: 34,
          created: '2022-12-08T16:19:55',
          updated: '2022-12-08T22:00:47',
          statu: 1,
          parentId: 26,
          name: '电影管理',
          path: '/sys/film',
          perms: 'sys:film:list',
          component: 'sys/Film',
          type: 1,
          icon: 'el-icon-s-promotion',
          ordernum: 1,
          children: [],
        },
      ],
    },
    {
      id: 39,
      created: '2022-12-11T21:35:22',
      updated: '2022-12-11T21:37:25',
      statu: 1,
      parentId: 0,
      name: '前台用户管理',
      path: null,
      perms: 'sys;fans:list',
      component: null,
      type: 1,
      icon: 'el-icon-s-custom',
      ordernum: 1,
      children: [
        {
          id: 31,
          created: '2022-12-08T16:16:16',
          updated: '2022-12-11T21:35:33',
          statu: 1,
          parentId: 39,
          name: '粉丝管理',
          path: '/sys/fans',
          perms: 'sys:fans:list',
          component: 'sys/Fans',
          type: 1,
          icon: 'el-icon-s-promotion',
          ordernum: 1,
          children: [],
        },
        {
          id: 35,
          created: '2022-12-10T07:27:42',
          updated: '2022-12-11T21:35:46',
          statu: 1,
          parentId: 39,
          name: '电影评论管理',
          path: '/sys/evaluate',
          perms: 'sys:evaluate:list',
          component: 'sys/Evaluate',
          type: 1,
          icon: 'el-icon-date',
          ordernum: 1,
          children: [],
        },
        {
          id: 36,
          created: '2022-12-10T07:29:02',
          updated: '2022-12-11T21:35:55',
          statu: 1,
          parentId: 39,
          name: '订单管理',
          path: '/sys/order',
          perms: 'sys:order:list',
          component: 'sys/Order',
          type: 1,
          icon: 'el-icon-folder-checked',
          ordernum: 1,
          children: [],
        },
      ],
    },
  ]
  Result.code = 20000
  Result.message = '请求菜单数据成功'
  Result.resultdata = menus

  return Result
})

//根据菜单编号id 获得该菜单详细信息  /system/menu/info/2
Mock.mock(RegExp('/system/menu/info/*'), 'get', () => {
  //假设，传递参数username就是ByteRain，到数据库根据用户名ByteRain查询出该用户所有的详细信息并返回客户端
  Result.code = 20000
  Result.message = '查询菜单详细信息成功'
  Result.resultdata = {
    id: 2,
    created: '2022-11-03T18:58:18',
    updated: '2022-11-03T18:58:18',
    statu: 1,
    parentId: 1,
    name: '用户管理',
    path: '/sys/users',
    perms: 'sys:user:list',
    component: 'sys/User',
    type: 1,
    icon: 'el-icon-s-custom',
    ordernum: 1,
    children: [
      {
        id: 9,
        created: '2022-11-03T18:58:18',
        updated: null,
        statu: 1,
        parentId: 2,
        name: '添加用户',
        path: null,
        perms: 'sys:user:save',
        component: null,
        type: 2,
        icon: null,
        ordernum: 1,
        children: [],
      },
      {
        id: 10,
        created: '2022-11-03T18:58:18',
        updated: '2022-11-03T18:58:18',
        statu: 1,
        parentId: 2,
        name: '修改用户',
        path: null,
        perms: 'sys:user:update',
        component: null,
        type: 2,
        icon: null,
        ordernum: 2,
        children: [],
      },
      {
        id: 11,
        created: '2022-11-03T18:58:18',
        updated: null,
        statu: 1,
        parentId: 2,
        name: '删除用户',
        path: null,
        perms: 'sys:user:delete',
        component: null,
        type: 2,
        icon: null,
        ordernum: 3,
        children: [],
      },
      {
        id: 12,
        created: '2022-11-03T18:58:18',
        updated: null,
        statu: 1,
        parentId: 2,
        name: '分配角色',
        path: null,
        perms: 'sys:user:role',
        component: null,
        type: 2,
        icon: null,
        ordernum: 4,
        children: [],
      },
      {
        id: 13,
        created: '2022-11-03T18:58:18',
        updated: null,
        statu: 1,
        parentId: 2,
        name: '重置密码',
        path: null,
        perms: 'sys:user:repass',
        component: null,
        type: 2,
        icon: null,
        ordernum: 5,
        children: [],
      },
    ],
  }

  return Result
})
//模拟Java服务器代码执行 保存菜单信息
Mock.mock('/system/menu/save', 'post', () => {
  Result.code = 20000
  Result.message = '新建菜单成功'
  Result.resultdata = null
  return Result
})

//模拟Java服务器代码执行 更新菜单方法
Mock.mock('/system/menu/update', 'post', () => {
  Result.code = 20000
  Result.message = '更新菜单信息成功'
  Result.resultdata = null
  return Result
})
//删除菜单的方法
Mock.mock('/system/menu/delete', 'post', () => {
  Result.code = 20000
  Result.message = '删除菜单数据成功'
  Result.resultdata = null
  return Result
})

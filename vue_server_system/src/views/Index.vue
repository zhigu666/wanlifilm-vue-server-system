<template>
    <el-container>
      <el-aside width="200px">
        <SideMenu></SideMenu>
      </el-aside>
      <el-container>
        <el-header style="background-color: blanchedalmond">
          <strong>Vue-System万里学院影院后台管理系统V1.0</strong>
          <div class="header-face">
            <!-- 头像 -->
            <el-avatar size="medium" :src="userInfo.avatar"></el-avatar>
            <!-- 用户名和下拉菜单 -->
            <el-dropdown>
              <span class="el-dropdown-link">
                <b >{{userInfo.username}}</b><i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="toMyUser">个人中心</el-dropdown-item>
                <el-dropdown-item @click.native="toSetPwd">修改密码</el-dropdown-item>
                <el-dropdown-item>注销账户</el-dropdown-item>
                <el-dropdown-item @click.native="logout">退出系统</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-header>
        <el-main>
          <!-- 使用Tabs选项卡组件 -->
<!--          <h1>首页</h1>-->
          <Tabs>

          </Tabs>

          <div style="margin:0 20px;">

          </div>
        </el-main>
      </el-container>
    </el-container>
</template>

<script>
import SideMenu from '@/components/SideMenu.vue'
import Tabs from '@/components/Tabs.vue'

export default {
  data() {
    return {
      //存储登录用户信息的对象
      userInfo: { 
        username:'',
        avatar:''
      }
    }
  },
  methods: {
    toMyUser(){
      this.$router.push('/myuser')
    },
    //跳转至修改密码页面
    toSetPwd () { 
      this.$router.push('/setpwd')
    },
    //登录之后，加载用户的信息
    loadUserInfo () { 
      //在登录页面输入用户，查询信息: 用户名。
      //使用axios去请求服务器端获得当前 用户的用户信息     /user/userinfo
      // 请求地址 /user/userinfo/XXXXX

      //todo:'/system/user/userinfo/'
      this.$axios.get('/system/user/userinfo/' + this.userInfo.username).then(response => {
        console.log(this.userInfo.avatar)
        console.log(this.userInfo.username)
        this.userInfo = response.data.resultdata;
      }).catch(error => { 
        console.log(error);
      })
    },
    //退出系统----清楚当前登录用户所有的状态信息
    logout () {  
      this.$axios.get('/logout').then(response => { 
        //Vuex中存储token，清除token
        console.log("退出登录");

        this.$store.commit('setMenuList','');//清空菜单数据
        this.$store.commit('setPermList','');//清空权限数据
        this.$store.commit('changeRouteStatus',false);//重新加载

        this.$store.commit('RESET_TOKEN','');
        //存储到sessionStorage和LocalStorage
        sessionStorage.clear();
        localStorage.clear();
        this.$router.push('/login')
      }).catch(error => { 
        console.log(error);
      })
      
    }
  },
  components: {
    SideMenu,
    Tabs,
  },
  created () { 
    this.userInfo.username = this.$getSessionStorage('username');
    this.loadUserInfo();  //调用加载登录的用户信息
  }
}
</script>

<style scoped>
.el-container {
  padding: 0;
  margin: 0;
  height: 100%;

}

.el-aside {
  color: #333;
  line-height: 200px;
  text-align: left;
  background-color: aqua;

}

.el-header {
  background-color: #f8f8fa;
  color: #494856;
  text-align: left;
  line-height: 60px;
}

.el-main {
  color: #333;
  padding: 0;
}

.header-face {
  float: right;
  width: 110px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
</style>
<template>
  <el-menu class="el-menu-vertical-demo" background-color="#dff" text-color="#767676" active-text-color="#409eff" :default-active="activeName">
    <el-menu-item index="Index">
      <template slot="title">
         <i class="el-icon-s-home" style="color:#f2257a; font-size: 16px;"></i>
         <span slot="title" style="color:#f2257a; font-weight:900;font-size: 16px">首页</span>
      </template>  
    </el-menu-item>

     <el-submenu :index="item.name" v-for="(item,index) in menuList" :key="index">
      <template slot="title">
        <i :class="item.icon"></i>
        <span slot="title">{{item.title}}</span>
      </template>  
        <router-link :to="citem.path" v-for="(citem,cindex) in item.children" :key="cindex" >
           <el-menu-item :index="citem.name" @click="selectMenu(citem)">
              <template slot="title">
                <i :class="citem.icon"></i>
                <span slot="title">{{citem.title}}</span>
              </template>  
            </el-menu-item>
        </router-link> 
     </el-submenu>
  </el-menu>
</template>
<script>
export default {
  name:'SideMenu',
  data() {
    return {
      //数组--存储就是动态菜单数据
      menuList:this.$store.state.menu.menuList
    }
  },
  //定义计算属性，监控选项卡选中 name 在vuex中editableTabsValue
  computed: {
    activeName () { 
      //选中选项卡的name 记录在vuex中editableTabsValue 。那么选中选项卡的name就是选中菜单的name
      return this.$store.state.menu.editableTabsValue
    }
  },
  methods: {
    selectMenu (menu) { 
     
      //menu就是当前点击的菜单对象
      //需要把菜单对象  转为   选项卡对象，然后把选项卡对象  添加到Vuex的editableTabs
      let tabObj =  {
        icon: menu.icon,
        title: menu.title,
        name: menu.name,
      }
      //调用vuex中mutations 中的addTabs的方法，将上面由菜单创建的选项卡 添加进去
      this.$store.commit('addTabs',tabObj)
    }
  }
}
</script>

<style scoped>
.el-menu i{
  color:#13adf5;
}

.el-menu-vertical-demo{
  height: 100%;
}
a{
  text-decoration: none;
}
</style>

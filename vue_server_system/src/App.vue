<template>
  <div id="app">
    <!-- 路由出口 -->
    <router-view/>
  </div>
</template>
<script>
export default {
  name: 'App',
  watch: {
    /*如果不设置监听器，刷新页面，什么选项卡都无法显示
    功能：直接通过页面 浏览器地址中输入的 地址(路由地址) 自动添加激活一个选项卡
    在App.vue监听路由，只要我们浏览器刷新，监听器执行。to得到相关创建选项卡的信息。
    */
    //监听路由
    $route (to, from) { 
      if (to.path != '/login') { 
        //创建一个选项卡对象
        let tabObj = {
          icon: to.meta.icon,
          name: to.name,
          title:to.meta.title,
        }

        this.$store.commit('addTabs',tabObj)
      }
    }
  }
}
</script>
<style>
  html,body,#app{
    height:100%;
    padding: 0;
    margin: 0;
    font-size: 14px;
    font-family: 'Microsoft Yahei';
    color:#494949;
    text-align: left;
  }
</style>

<template>
  <el-tabs type="border-card" closable @tab-remove="removeTab" v-model="editableTabsValue" @tab-click="clickTab">
    <el-tab-pane v-for="(item,index) in editableTabs" :key="item.name" :label="item.title" :name="item.name">
      <span slot="label" ><i :class="item.icon"></i> {{item.title}}</span> 
      <router-view></router-view>
    </el-tab-pane> 
  </el-tabs>
</template>

<script>
export default {
  name:'Tabs',
  data() {
    return {

    }
  },
  methods: {
    //选项卡被点击
    clickTab (target) { 
      //target.name获得当前点击的选项卡 名字
      //选项卡的名字是 点击菜单 动态根据菜单创建选项卡对象。
      //菜单的name是从 路由守卫创建动态路由时指定。  menu.name 等于  路由配置对象route.name  等于  Tab.name
      this.$router.push({ name:target.name })
    },
    //点击选项卡的删除按钮，移除选项卡   target就是要删除的选项卡的name的属性值
    removeTab (target) { 
      let tabsArray = this.editableTabs;  //获得目前所有数组中的选项卡
      let activeName = this.editableTabsValue;   //获得目前正 激活选项卡name
      if (target === 'Index') {  //如果要删除的选项卡target 是Index
        return
      }
      if (target === activeName) { //删除的target选项卡 就是目前正在激活选项卡
        tabsArray.forEach((tabItem, index) => {
          if (tabItem.name === target) { //如果当前循环的选项卡name和要删除的name相等，在所有选项卡数组中找到要删除的选项卡
            //计算谁是删除之后 默认被激活 选项卡，如果不是最后一个选项卡，就取下一个，如果是最后一个，取前一个
            let nextTab = tabsArray[index + 1] || tabsArray[index - 1]
            console.log('下一个选项卡',nextTab);
            if (nextTab) {
              activeName = nextTab.name   //将获得下一个选项卡name赋值给默认激活activeName
            }
          }
        });     
      }
      //将找到下一个被激活的选项卡name 赋值给vuex中
      this.editableTabsValue = activeName
      //从现有数组中移除  删除掉当前要删除的选项卡   
      //filter 过滤方法，只保存条件符合的数据。
      this.editableTabs = tabsArray.filter( tab => tab.name !== target )

      //默认激活的选项卡改变，页面的内容也需要改变    让路由跳转至 移除选项卡之后 目前激活的选项卡对应组件界面
      this.$router.push({name:activeName})
      
    }
  },
  computed: {
    editableTabs: {
      get () { 
        return this.$store.state.menu.editableTabs
      },
      set (val) { 
        this.$store.state.menu.editableTabs = val;
      }
    },
    //目前正在编辑 激活的选项卡。返回 选项卡对象 name
    editableTabsValue: {
      get () { 
        return this.$store.state.menu.editableTabsValue;
      },
      set (val) {
        this.$store.state.menu.editableTabsValue = val
       }
    }
  }
}
</script>

<style scoped>
.el-tabs{
  
  height: 100%;
 
}


</style>

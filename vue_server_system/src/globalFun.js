import Vue from 'vue';
Vue.mixin({
    methods:{
        //全局函数--前端面验证权限函数
        //验证规则，执行某个方法，要求权限，检查有没有sys:user:list
        hasAuth(perm){
            let authoritys=this.$store.state.menu.permList.join(',')
            // console.log("当前用户权限",authoritys)
            return authoritys.indexOf(perm)>-1
        }
    }
})
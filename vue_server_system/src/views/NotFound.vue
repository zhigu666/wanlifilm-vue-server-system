<template>
  <el-empty description="404,您访问的资源不存在">
    <el-button type="primary" @click="toHome">返回首页</el-button>
  </el-empty>
</template>
<script>
export default {
  data() {
    return {

    }
  },
  methods: {
    toHome () { 
      this.$router.push('/index')
    }
  }
}
</script>




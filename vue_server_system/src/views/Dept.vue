<template>
  <div>
    <h1>部门信息列表</h1>
  </div>
</template>

<script>


export default {
  data() {
    return {
      deptList:[]
    }
  },
  created () { 
    this.$axios.get("/dept")
      .then((response) => { 
          console.log(response.data);
      })
      .catch(error => { 
        console.log(error);
      })
  }
}
</script>

<style scoped>
</style>

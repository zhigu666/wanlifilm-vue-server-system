<template>
  <div style="text-align: center">
    <h2>尊敬的{{ this.$getSessionStorage("username") }}用户，这是您的个人信息。</h2>
    <el-form :model="MyUserForm" ref="MyUserForm"  label-width="120px" >
      <el-form-item label="用户名">
        <el-input  v-model="MyUserForm.username" :disabled="true">
        </el-input>
      </el-form-item>

<!--      <el-form-item label="密码">-->
<!--        <el-input  type="password" v-model="MyUserForm.password" >-->
<!--        </el-input>-->
<!--      </el-form-item>-->

      <el-form-item label="头像">
        <template>
          <div>
            <div class="block">
              <el-avatar shape="square" :size="200" :src="MyUserForm.avatar"></el-avatar>
            </div>
          </div>
        </template>
      </el-form-item>

      <el-form-item label="邮箱">
        <el-input  v-model="MyUserForm.email" >
        </el-input>
      </el-form-item>

      <el-form-item label="所在地">
        <el-input  v-model="MyUserForm.city" >
        </el-input>
      </el-form-item>

      <el-form-item label="创建时间">
        <el-input  v-model="MyUserForm.created" :disabled="true">
        </el-input>
      </el-form-item>

<!--      <el-form-item label="最后登录">-->
<!--        <el-input  v-model="tableData.last_login" :disabled="true">-->
<!--        </el-input>-->
<!--      </el-form-item>-->

      <el-form-item>
        <el-button type="primary" @click="editMyUser('MyUserForm')">保存修改</el-button>
        <el-button @click="resetPass">忘记密码?</el-button>
      </el-form-item>
    </el-form>



<!--    <el-dialog title="用户信息" :visible.sync="dialogFormVisible" width="600px" :before-close="handleClose">-->
<!--      <el-form :model="MyUserForm" ref="MyUserForm" label-width="100px" >-->
<!--        <el-form-item label="用户名" label-width="100px" prop="username">-->
<!--          <el-input v-model="MyUserForm.username" autocomplete="off"></el-input>-->
<!--        </el-form-item>-->

<!--        <el-form-item label="用户头像" label-width="100px">-->
<!--          <el-upload class="avatar-uploader"-->
<!--                     action="/api/oss/uploadOneFile"-->
<!--                     :show-file-list="false"-->
<!--                     :on-success="handleAvatarSuccess"-->
<!--                     :headers="headers">-->
<!--            <img v-if="MyUserForm.avatar" :src="MyUserForm.avatar" class="avatar">-->
<!--            <i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
<!--          </el-upload>-->
<!--        </el-form-item>-->

<!--        <el-form-item label="邮箱" label-width="100px" prop="email">-->
<!--          <el-input v-model="MyUserForm.email" autocomplete="off"></el-input>-->
<!--        </el-form-item>-->

<!--        <el-form-item label="所在地" label-width="100px" prop="tel">-->
<!--          <el-input v-model="MyUserForm.tel" autocomplete="off"></el-input>-->
<!--        </el-form-item>-->

<!--        <el-form-item>-->
<!--          <el-button type="primary" @click="submitForm('MyUserFormForm')">保存</el-button>-->
<!--          <el-button @click="restForm('MyUserFormForm')">重置</el-button>-->
<!--        </el-form-item>-->


<!--      </el-form>-->
<!--    </el-dialog>-->
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogFormVisible:false,
      tableData:[],
      name:'',
      MyUserForm:{
        // username:'zhigu',
        // password:'111',
        // avatar:'https://img1.baidu.com/it/u=1811445190,4171898561&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
        // email:'123@qq.com',
        // tel:'上海',
        // created:'2022-11-04 22:13:53',
        // last_login:'2022-11-22 08:38:37',
      },
      headers: {
        // token:this.$getSessionStorage('token')
        token: localStorage.getItem('token')
      },
    }
  },
  created() {
    this.MyUserForm.username=this.$getSessionStorage("username")
    this.loadMyUserList()

  },
  components: {},
  props: {},
  methods: {
    // submitForm(formName){
    //       this.$axios.post('/system/myuser/' + (this.MyUserForm.id ? 'update' : 'update'), this.MyUserForm)
    //           .then(response => {
    //             this.$message({
    //               message: response.data.message,
    //               type: "success",
    //               duration:1200,
    //               onClose: () => {
    //                 this.loadMyUserList()
    //                 this.dialogFormVisible = false
    //                 this.restForm(formName)
    //               }
    //             })
    //           })
    // },
    loadMyUserList() {
      this.$axios.get('/system/user/myuserinfo/'+this.MyUserForm.username).then(response=>{
        this.MyUserForm = response.data.resultdata
      })
    },
    restForm(formName) {
      this.MyUserForm={}
      this.loadMyUserList()
    },
    handleClose() {
      this.dialogFormVisible = false
      this.restForm('MyUserForm')
    },
    resetPass(){
      this.$confirm('重置用户[' + this.MyUserForm.username + ']的密码,是否继续执行该操作', '重置密码操作',{
        confirmButtonText: '确定',
        concelButtonText: '取消',
        type: 'warning',
      }).then(_=>{
        //重置密码
        this.$axios.post('/system/user/myrepass',this.MyUserForm.id)
            .then((response)=>{
              this.$message({
                message: response.data.message,
                type: "success",
                showClose: true,
              })
            })
      })
    },
    editMyUser(formName){
      this.$refs[formName].validate(valid=>{
        if (valid){
          this.$axios.post('/system/user/myuser',this.MyUserForm)
          .then(response=>{
            this.$message({
              message:response.data.message,
              type:"success",
              duration:1200,
              onClose:()=>{
                this.loadMyUserList()
                this.restForm(formName)
              }
            })
          })
        }
      })

    },


    // editMyUser(id){
    //   this.$axios('/myuserform/myuserinfo/' + id).then(response => {
    //     this.MyUserForm = response.data.resultdata //将服务器返回的用户数据赋值给userform
    //     this.dialogFormVisible = true
    //   })
    // },
    handleAvatarSuccess(response, file) {
      //使用上传控件上传头像成功,服务器返回一个图片上传后的地址
      this.MyUserForm.avatar = response.resultdata
    },
  }


}
</script>

<style scoped>
.el-form {
  width: 500px;
  margin: 20px auto;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

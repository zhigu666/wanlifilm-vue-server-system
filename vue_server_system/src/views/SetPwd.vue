<template>
  <div style=" text-align:center; ">
    <el-upload
  class="avatar-uploader"
  action="/file/upload"
  :show-file-list="false"
  :on-success="handleAvatarSuccess"
  :before-upload="beforeAvatarUpload">
  <img v-if="imageUrl" :src="imageUrl" class="avatar">
  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
</el-upload>

    <h3>尊敬的{{ this.$getSessionStorage("username") }}用户，请修改你的密码。</h3>
    <el-form ref="passForm" :model="passForm" label-width="120px" :rules="rules">
      <el-form-item label="旧密码" prop="password">
        <el-input type="password" v-model="passForm.password"></el-input>
      </el-form-item>
       <el-form-item label="新密码" prop="newPass">
        <el-input type="password" v-model="passForm.newPass"></el-input>
      </el-form-item>
       <el-form-item label="确认新密码" prop="checkPass">
        <el-input type="password" v-model="passForm.checkPass"></el-input>
      </el-form-item>
       <el-form-item>
        <el-button type="primary" @click="submitForm('passForm')">提交</el-button>
        <el-button @click="resetForm()">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>

export default {
  name:'SetPwd',
  data () {

    //自定义validatePass验证的规则加到  确认密码上，所以参数 value就是确认密码
    var validatePass = (rule, value, callback) => {
      if (value == '') {
        callback(new Error('请输入确认密码'))
      } else if (value !== this.passForm.newPass) {
        callback(new Error('两次输入的新密码不一致'))
      } else {
        callback();
      }
    }

    return {
       imageUrl:'',
      passForm: {
        password:'',
        newPass: '',
        checkPass:'',
      },
      rules: {
        password: [
          { required: true, message: '请输入旧密码', trigger: 'blur' },
          // { min:6,max:12,message:'密码长度在 6 到 12 个字符',  trigger: 'blur'}
        ],
        newPass:
          [
            { required: true, message: '请输入新密码', trigger: 'blur' },
            // { min:6,max:12,message:'密码长度在 6 到 12 个字符',  trigger: 'blur'}
          ],
        checkPass: [
          { required: true, validator:validatePass, trigger: 'blur' },
          // { min:6,max:12,message:'密码长度在 6 到 12 个字符',  trigger: 'blur'},

        ]
      }
    }
  },
  methods: {
    handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //提交服务器修改密码 ，要求java服务器中的修改密码的方法，必须是接收对象参数  @RequestBody
          this.$axios.post('/system/user/updatePass', this.passForm)
            .then(response => {
              this.$message({
                message: response.data.message,
                type: 'success',
                showClose: true,
              });

              //密码修改成功，清空表单
              this.resetForm();
            })
        } else {
          return false
        }
      })
    },
    resetForm () {
      // this.$refs[formName].resetFields(); //重置表单
      this.passForm.password = ''
      this.passForm.newPass = ''
      this.passForm.checkPass = ''
    }
  },
  components: {
  }
}
</script>

<style scoped>
.el-form{
  width: 400px;
  margin: 20px auto;

}
</style>

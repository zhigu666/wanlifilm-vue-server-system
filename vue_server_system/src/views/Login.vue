<template>
    <el-row>
     
      <el-col :xl="6" :lg="7" :xs="24">
        <h2>欢迎使用万里学院影院App后台管理系统</h2>
        <el-image style="width:180px; height: 180px; border-radius: 16px;" :src="require('@/assets/logo.jpg')">
        </el-image>
        <p>万里学院大数据与软件工程专业提供技术支持</p>
        <p>基于SpringBoot技术实现</p>
      </el-col>
      <el-col :span="1">
        <!-- 分割线 -->
        <el-divider direction="vertical"></el-divider>
      </el-col>
      <el-col :xl="6" :lg="7">
        <!-- ref就类似于 html标签 标记所定义id='loginForm' 可用在JS代码中 通过ref获得标签 -->
        <el-form ref="loginForm" :model="loginForm" label-width="80px" label-position="right" :rules="rules">
          <el-form-item label="用户名" style="width:380px" prop="username">
            <el-input v-model="loginForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" style="width:380px" prop="password">
            <el-input type="password" v-model="loginForm.password"></el-input>
          </el-form-item>

          <el-form-item label="验证码" style="width:380px" prop="code">
            <el-input  v-model="loginForm.code" style="width: 170px; float:left;" maxlength="5"></el-input>
            <el-image :src="captchaImg" class="captchaImg" @click="getCaptcha"></el-image>
          </el-form-item>

          <el-form-item>
             <el-button type="primary" @click="submitForm('loginForm')">提交</el-button>
              <el-button >获取密码</el-button>
          </el-form-item>
        </el-form>  
      </el-col>
    </el-row>
</template>

<script>

export default {
  data() {
    return {
      captchaImg:'',  //验证码图片的数据
      loginForm: {
        username: '',
        password: '',
        code: '',   //验证码   存redis中的value
        key:''     //随机码   存redis中的key
      },
      //验证规则 rules
      rules: {
        username: [
          //非空验证
          {required:true,message:'请输入登录的用户名',trigger:'blur'}
        ],
        password: [
          {required:true,message:'请输入登录的密码',trigger:'blur'}
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          //字符长度的验证规则
          {min:5,max:5,message:'验证码长度为 5 个字符',trigger:'blur'}
        ]
      }
    }
  },
  created () { 
    //Vue实例的生命周期方法，创建完毕
    this.getCaptcha();
  },
  methods: {
    submitForm (fromName) { 
      //fromName参数传递就是ref='loginFrom'   使用this.$refs[fromName]获得页面上的表单。
      this.$refs[fromName].validate((valid) => { 
        //如果valid为true，表示表单的验证规则 通过。
        if (valid) {
          //post(路径,参数值)
          //this.$qs.stringify( JS对象)  将js对象转换为 参数形式字符串。 username=admin&password=123&key=123123&code=5w3qw
          this.$axios.post('/login?'+this.$qs.stringify(this.loginForm))
            .then(response => {  
                //获得服务器返回token，在响应头中。 jwt
                const jwt = response.headers['token']
                //保存jwt 调用Vuex中的mutations中的SET_TOKEN方法进行保存。
                this.$store.commit('SET_TOKEN', jwt)
                //调换至首页。 
                this.$setSessionStorage('username',this.loginForm.username)
                console.log("登录操作成功");
                this.$router.push('/home')
                //this.$router.push({ name: 'Index', params: { name: '222' } })
            })
            this.getCaptcha()
        } else {    
          this.getCaptcha()
          console.log('Error Submit!');
          return false;
        }
      })
    },
    //请求服务器获得验证码图片数据
    getCaptcha () { 
      //使用axios请求服务器获得验证码数据:
      //get(路径)  请求服务器
      //then  服务器响应成功的回调函数.
      this.$axios.get('/captcha')
        .then(response => { 
          console.log(response.data);
          this.captchaImg = response.data.resultdata.captchaImg
          this.loginForm.key = response.data.resultdata.key
        }).catch(error => { 
          console.log(error);
        })

      /*
         服务器返回的数据格式：
         response.data就是服务器返回的数据对象:
         {
          code: 200, //200请求操作成功
          message: '操作成功',
          resultdata: {key:随机码,captchaImg:转码后验证码图片}, //data就是具体请求的数据
        }
      */
    }
  }
}
</script>

<style scoped>
.el-row{
  background: #fafafa;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  text-align: center;
}

.el-divider{
  height: 200px;
}
.captchaImg{
  float:left;
  margin-left:10px;
  border-radius:4px;
}
</style>

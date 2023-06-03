<template>
  <div>
    <el-form ref="form" :model="searchForm" label-width="80px" :inline="true">
      <el-form-item>
        <el-input v-model="searchForm.name" placeholder="请输入要搜索的类别名"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button @click="loadFansList">搜索</el-button>
        <el-button type="primary" @click="dialogFormVisible=true" v-if="hasAuth('sys:fans:save')">新建</el-button>
        <el-popconfirm title="确认要批量删除类别信息吗？" @confirm="deleteFans">
          <el-button slot="reference" type="danger" :disabled="deleteAllBtnStu" v-if="hasAuth('sys:fans:delete')">批量删除</el-button>
        </el-popconfirm>
      </el-form-item>
    </el-form>

    <!--      类别信息表格  data显示的数据-->
    <el-table :data="tableData" border stripe style="width: 100%; margin-bottom:20px;"
              :cell-style="{padding:'2px'}" @selection-change="selectionChange">
      <el-table-column type="selection" width="50">
      </el-table-column>

      <el-table-column label="头像" width="55">
        <!--      头像  scope代表循环中的每一行-->
        <template slot-scope="scope">
          <el-avatar size="small" :src="scope.row.avatar"></el-avatar>
        </template>
      </el-table-column>

      <el-table-column label="id(手机号)" width="150" prop="id">
      </el-table-column>

      <el-table-column label="用户名" width="150" prop="username">
      </el-table-column>

      <el-table-column label="邮箱" width="150" prop="email">
      </el-table-column>

      <el-table-column label="性别" width="70" prop="sex">
        <template slot-scope="scope">
          <!--        <el-tag size="mini" type="success">正常</el-tag>-->
          <span v-if="scope.row.sex===1">男</span>
          <span v-else-if="scope.row.sex===0">女</span>

        </template>
      </el-table-column>

      <el-table-column label="状态" width="70" prop="statu">
        <template slot-scope="scope">
          <!--        <el-tag size="mini" type="success">正常</el-tag>-->
          <el-tag size="mini" v-if="scope.row.statu===1" type="success">正常</el-tag>
          <el-tag size="mini" v-else-if="scope.row.statu===0" type="danger">禁用</el-tag>
        </template>
      </el-table-column>


      <el-table-column label="创建时间" width="250" prop="created">
        <template slot-scope="scope">
          {{ scope.row.created | fmtDate}}
        </template>
      </el-table-column>



      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="editFans(scope.row.id)" v-if="hasAuth('sys:fans:update')">编辑</el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button type="text" @click="restPass(scope.row.id,scope.row.username)" v-if="hasAuth('sys:fans:repass')">重置密码</el-button>
          <el-divider direction="vertical"></el-divider>

          <el-popconfirm title="确认要删除该用户信息吗？" @confirm="deleteFans(scope.row.id)">
            <el-button slot="reference" type="text" v-if="hasAuth('sys:fans:delete')">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!--分页页码-->
    <el-pagination background layout="total, sizes,prev, pager,next,jumper" :total="total" :page-size="size"
                   :page-sizes="[5,10,15,20,25]" :current-page="current"
                   @size-change="handlerSizeChange"
                   @current-change="handlerCurrentChange">
    </el-pagination>

    <!--    新建类别和编辑类别的对话框-->
    <el-dialog title="用户信息" :visible.sync="dialogFormVisible" width="600px" :before-close="handleClose">
      <el-form :model="FansForm" ref="FansForm" label-width="100px" :rules="rules">
        <el-form-item label="头像" label-width="100px">
          <el-upload class="avatar-uploader"
                     action="/api/oss/uploadOneFile"
                     :show-file-list="false"
                     :on-success="handleAvatarSuccess"
                     :headers="headers">
            <img v-if="FansForm.avatar" :src="FansForm.avatar" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

<!--        <el-form-item label="id" label-width="100px" prop="id">-->
<!--          <el-input v-model="FansForm.id" autocomplete="off"></el-input>-->
<!--        </el-form-item>-->

        <el-form-item label="用户名" label-width="100px" prop="username">
          <el-input v-model="FansForm.username" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" label-width="100px" prop="email">
          <el-input v-model="FansForm.email" autocomplete="off"></el-input>
        </el-form-item>



        <el-form-item label="性别" label-width="100px" prop="sex">
          <el-radio-group v-model="FansForm.sex">
            <el-radio :label="0">女</el-radio>
            <el-radio :label="1">男</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="状态" label-width="100px" prop="statu">
          <el-radio-group v-model="FansForm.statu">
            <el-radio :label="0">禁用</el-radio>
            <el-radio :label="1">正常</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('FansForm')" >保存用户</el-button>
          <el-button @click="restForm('FansForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {
      selection:[],
      total: 10,//分页显示总记录数
      size: 10,//单页记录数
      current: 1,//当前页码
      tableData: [],
      searchForm: {

      },
      dialogFormVisible: false,
      deleteAllBtnStu: true,
      FansForm:{

      },
      rules: {
        // id: [{required: true, message: '请输入id', trigger: 'blur'}],
        username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
        sex: [{required: true, message: '请输入性别', trigger: 'blur'}],
        statu:[{required:true,message:'请输入粉丝的状态',trigger:'blur'}],
      },
      headers: {
        // token:this.$getSessionStorage('token')
        token: localStorage.getItem('token')
      },
    }
  },

  filters: {
    fmtDate: (value) => {
      let date = new Date(value)
      let y = date.getFullYear()
      let M = (date.getMonth() + 1).toString().padStart(2, '0')
      let d = date.getDate().toString().padStart(2, '0')

      let h = date.getHours().toString().padStart(2, '0')
      let m = date.getMinutes().toString().padStart(2, '0')
      let s = date.getSeconds().toString().padStart(2, '0')

      return `${y}年${M}月${d}日 ${h}:${m}:${s}`
    }
  },
  created() {
    this.loadFansList()
  },
  components: {},
  props: {},
  methods: {

    //【分页方法】：修改一页显示的记录数 val参数就是切换的一个最新个数
    handlerSizeChange(val) {
      this.size = val
      this.loadFansList()//重新加载角色的数据
    },

    //【分页方法】：切换页码，请求新一页数据
    handlerCurrentChange(val) { //参数val 就是点击的新的页码
      this.current = val
      this.loadFansList()
    },


    restPass(id,name){
      this.$confirm('重置用户[' + name + ']的密码,是否继续执行该操作', '重置密码操作',{
        confirmButtonText: '确定',
        concelButtonText: '取消',
        type: 'warning',
      }).then(_=>{
        //重置密码
        this.$axios.post('/system/fans/repass',id)
            .then((response)=>{
              this.$message({
                message: response.data.message,
                type: "success",
                showClose: true,
              })
            })
      })
    },
    handleClose(){
      this.dialogFormVisible = false
      this.restForm('FansForm')
    },
    loadFansList(){
      this.$axios.get('/system/fans/list',{
        params: {
          name: this.searchForm.name,
          current: this.current,
          size: this.size
        }
      })
          .then(response=>{
            this.tableData = response.data.resultdata.records
            this.total = response.data.resultdata.total
            this.size = response.data.resultdata.size
            this.current = response.data.resultdata.current
      })
    },
    restForm(formName){
      this.FansForm={}
      this.$refs[formName].resetFields()
    },
    submitForm(formName){
      this.$refs[formName].validate(valid=>{
        if (valid){

          this.$axios.post('/system/fans/' + (this.FansForm.id ? 'update' : 'save'), this.FansForm)
              .then(response=>{
                this.$message({
                  message: response.data.message,
                  type: "success",
                  duration:1200,
                  onClose: () => {
                    this.loadFansList()
                    this.dialogFormVisible = false
                    this.restForm(formName)
                  }
                })
              })
        }
      })
    },
    // submitNewForm(formName){
    //   this.$refs[formName].validate(valid=>{
    //     if (valid){
    //
    //       console.log(this.FansForm.id)
    //       console.log(this.FansForm)
    //       console.log(this.FansForm.id)
    //       console.log(this.FansForm.username)
    //       this.$axios.post('/system/fans/save' , this.FansForm)
    //           .then(response=>{
    //             this.$message({
    //               message: response.data.message,
    //               type: "success",
    //               duration:1200,
    //               onClose: () => {
    //                 this.loadFansList()
    //                 this.dialogFormVisible = false
    //                 this.restForm(formName)
    //               }
    //             })
    //           })
    //     }
    //   })
    // },





    handleAvatarSuccess(response, file) {
      //使用上传控件上传头像成功,服务器返回一个图片上传后的地址
      this.FansForm.avatar = response.resultdata
    },
    searchFansInfo() {

    },
    deleteFans(id) {
      let ids = [];//要删除的一组数据的id
      id ? ids.push(id) : this.selection.forEach(u => {
        ids.push(u.id)
      })
      console.log(ids)
      //ids是要删除的id
      this.$axios.post('/system/fans/delete', ids).then(response => {
        this.$message({
          message: response.data.message,
          type: "success",
          duration:1200,
          onClose: () => {
            this.loadFansList()
          }
        })
      })
    },
    selectionChange(value) {//value为选中的对象
      this.selection = value;
      if (this.selection) {
        //如果数据中有数据，代表有选中的用户，就修改批量删除为可用
        this.deleteAllBtnStu = (this.selection.length === 0)
      }
    },
    editFans(id){
      this.$axios('/system/fans/info/' + id).then(response => {
        this.FansForm = response.data.resultdata //将服务器返回的用户数据赋值给Fansform
        this.dialogFormVisible = true
      })
    },
  }


}
</script>

<style scoped>
/*<!--上传用户头像控件样式-->*/
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

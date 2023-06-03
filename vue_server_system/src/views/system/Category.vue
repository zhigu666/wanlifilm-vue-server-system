<template>
  <div>
    <el-form ref="form" :model="searchForm" label-width="80px" :inline="true">
      <el-form-item>
        <el-input v-model="searchForm.name" placeholder="请输入要搜索的类别名"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button @click="loadCategoryList">搜索</el-button>
        <el-button type="primary" @click="dialogFormVisible=true" v-if="hasAuth('sys:category:save')">新建</el-button>
        <el-popconfirm title="确认要批量删除类别信息吗？" @confirm="deleteCategory">
          <el-button slot="reference" type="danger" :disabled="deleteAllBtnStu" v-if="hasAuth('sys:category:delete')">批量删除</el-button>
        </el-popconfirm>
      </el-form-item>
    </el-form>

    <!--      类别信息表格  data显示的数据-->
    <el-table :data="tableData" border stripe style="width: 100%; margin-bottom:20px;"
              :cell-style="{padding:'2px'}" @selection-change="selectionChange">
      <el-table-column type="selection" width="50">
      </el-table-column>

      <el-table-column label="分类名称" width="150" prop="name">
      </el-table-column>

      <el-table-column label="类型图标" width="200">

        <template slot-scope="scope">
          <div class="block">
            <el-image
                style="width: 100px"
                :src="scope.row.url"
                fit="contain"></el-image>
          </div>
          <!--          <el-avatar size="big" :src="scope.row.url"></el-avatar>-->
        </template>
      </el-table-column>

      <el-table-column label="创建时间" width="250" prop="created">
        <template slot-scope="scope">
          {{ scope.row.created | fmtDate}}
        </template>
      </el-table-column>

      <el-table-column label="修改时间" width="250" prop="updated">
        <template slot-scope="scope">
          {{ scope.row.updated | fmtDate}}
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="editCategory(scope.row.id)" v-if="hasAuth('sys:category:update')">编辑</el-button>
          <el-divider direction="vertical"></el-divider>

          <el-popconfirm title="确认要删除该用户信息吗？" @confirm="deleteCategory(scope.row.id)" v-if="hasAuth('sys:category:delete')">
            <el-button slot="reference" type="text" >删除</el-button>
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
      <el-form :model="CategoryForm" ref="CategoryForm" label-width="100px" :rules="rules">
        <el-form-item label="分类名称" label-width="100px" prop="name">
          <el-input v-model="CategoryForm.name" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="分类图标" label-width="100px" prop="url">
          <el-upload class="avatar-uploader"
                     action="/api/oss/uploadOneFile"
                     :show-file-list="false"
                     :on-success="handleAvatarSuccess"
                     :headers="headers">
            <img v-if="CategoryForm.url" :src="CategoryForm.url" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="状态" label-width="100px" prop="statu">
          <el-radio-group v-model="CategoryForm.statu">
            <el-radio :label="0">禁用</el-radio>
            <el-radio :label="1">正常</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('CategoryForm')" >保存用户</el-button>
          <el-button @click="restForm('CategoryForm')" >重置</el-button>
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
      total: 0,//分页显示总记录数
      size: 10,//单页记录数
      current: 1,//当前页码
      tableData: [],
      searchForm: {

      },
      dialogFormVisible: false,
      deleteAllBtnStu: true,
      CategoryForm:{

      },
      rules: {
        name: [{required: true, message: '请输入类别名称', trigger: 'blur'}],
        statu:[{required:true,message:'请输入类别的状态',trigger:'blur'}],
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
    this.loadCategoryList()
  },
  components: {},
  props: {},
  methods: {
    //【分页方法】：修改一页显示的记录数 val参数就是切换的一个最新个数
    handlerSizeChange(val) {
      this.size = val
      this.loadCategoryList()//重新加载角色的数据
    },

    //【分页方法】：切换页码，请求新一页数据
    handlerCurrentChange(val) { //参数val 就是点击的新的页码
      this.current = val
      this.loadCategoryList()
    },


    handleClose(){
      this.dialogFormVisible = false
      this.restForm('CategoryForm')
    },
    loadCategoryList(){
      this.$axios.get('/system/category/list',{
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
      this.CategoryForm={}
      this.$refs[formName].resetFields()
    },
    submitForm(formName){
      this.$refs[formName].validate(valid=>{
        if (valid){
          console.log(this.CategoryForm)
          console.log(this.CategoryForm.id)
          this.$axios.post('/system/category/' + (this.CategoryForm.id ? 'update' : 'save'), this.CategoryForm)
              .then(response=>{
                this.$message({
                  message: response.data.message,
                  type: "success",
                  duration:1200,
                  onClose: () => {
                    this.loadCategoryList()
                    this.dialogFormVisible = false
                    this.restForm(formName)
                  }
                })
              })
        }
      })
    },
    handleAvatarSuccess(response, file) {
      // console.log(response)
      //使用上传控件上传头像成功,服务器返回一个图片上传后的地址
      this.CategoryForm.url = response.resultdata
    },
    searchCategoryInfo() {

    },
    deleteCategory(id) {
      let ids = [];//要删除的一组数据的id
      id ? ids.push(id) : this.selection.forEach(u => {
        ids.push(u.id)
      })
      console.log(ids)
      //ids是要删除的id
      this.$axios.post('/system/category/delete', ids).then(response => {
        this.$message({
          message: response.data.message,
          type: "success",
          duration:1200,
          onClose: () => {
            this.loadCategoryList()
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
    editCategory(id){
      this.$axios('/system/category/info/' + id).then(response => {
        this.CategoryForm = response.data.resultdata //将服务器返回的用户数据赋值给Categoryform
        this.dialogFormVisible = true
      })
    },
  }


}
</script>

<style scoped>
/*<!--上传用户头像控件样式-->*/
.avatar-uploader .el-upload {
  border: 1px solid #666;
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

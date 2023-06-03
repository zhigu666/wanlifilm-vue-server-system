<template>
  <div>
    <el-form ref="form" :model="searchform" :inline="true">
      <el-form-item>
        <el-input v-model="searchform.postername" placeholder="请输入需要搜索的内容"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="searchPosterInfo">搜索</el-button>
        <el-button type="primary" style="margin-right: 10px;" @click="dialogFormVisible = true">新建</el-button>
        <el-button @click="posterInfo">前台排片</el-button>
        <el-popconfirm title="确定要批量删除电影信息吗？" @confirm="deletePoster">
          <el-button slot="reference" type="danger" :disabled="deleteAllBtnStu">批量删除</el-button>
        </el-popconfirm>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" border stripe style="width: 100% ; margin-bottom: 20px;"
              @selection-change="selectionChange"
              :cell-style="{ padding: '2px' }">
      <el-table-column type="selection" width="50">
      </el-table-column>
      <el-table-column label="电影名称" width="90" prop="postername">
      </el-table-column>
      <el-table-column label="电影海报" width="200">

        <template slot-scope="scope">
          <div class="block">
            <el-image
                style="width: 100px"
                :src="scope.row.cover"
                fit="contain"></el-image>
          </div>
          <!--          <el-avatar size="big" :src="scope.row.url"></el-avatar>-->
        </template>

<!--        <template slot-scope="scope">-->
<!--          <el-image style="width: 200px; height: 150px" :src="scope.row.cover">-->
<!--          </el-image>-->
<!--        </template>-->
      </el-table-column>
      <el-table-column label="状态" width="65" prop="statu">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.statu === 1" size="mini" type="success">上架</el-tag>
          <el-tag v-else-if="scope.row.statu === 0" size="mini" type="danger">下架</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createtime" width="200">
      </el-table-column>
      <el-table-column label="修改时间" prop="updatetime" width="200">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="editposter(scope.row.id)">编辑</el-button>
          <el-divider direction="vertical"></el-divider>
          <el-popconfirm title="确定要删除该电影信息吗？" @confirm="deletePoster">
            <el-button slot="reference" type="text">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>


    <el-pagination background layout="total,sizes,prev, pager, next,jumper" :total="total" :page-size="size"
                   :page-sizes="[5, 10, 15, 20, 25]" :current-page="current">
    </el-pagination>
    <el-dialog title="电影信息" :visible.sync="dialogFormVisible" width="600px" :before-close="handleClose">
      <el-form :model="posterForm" ref="posterForm" label-width="100px" :rules="rules">
        <el-form-item label="电影海报" label-width="100px">
          <el-upload class="avatar-uploader" action="/api/upload" :show-file-list="false"
                     :on-success="handleAvatarSuccess" :headers="headers">
            <img v-if="posterForm.cover" :src="posterForm.cover" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="电影名称" label-width="100px" prop="postername">
          <el-input v-model="posterForm.postername" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态" label-width="100px" prop="statu">
          <el-radio-group v-model="posterForm.statu">
            <el-radio :label="1">上架</el-radio>
            <el-radio :label="0">下架</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="创建时间" label-width="100px" prop="createtime">
          <el-input v-model="posterForm.createtime" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="修改时间" label-width="100px" prop="updatetime">
          <el-input v-model="posterForm.updatetime" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('posterForm')">保存</el-button>
          <el-button @click="resetForm('posterForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rules: {
        postername: [{required: true, message: '请输入电影名称', trigger: 'blur'}],
        statu: [{required: true, message: '请输入状态', trigger: 'blur'}],
        createtime: [{required: true, message: '请输入创建时间', trigger: 'blur'}],
        updatetime:[{required:true,message:'请输入修改时间',trigger:'blur'}],
      },
      // 复选框选中的用户数据对象
      selection: [],
      // 是否显示对话框
      dialogFormVisible: false,
      // 用户表格显示的数据
      tableData: [],
      // 分页相关数据
      total: 0, //总记录数
      size: 10, //单页显示记录数
      current: 1, //当前页码数
      // 批量删除按钮禁用状态
      deleteAllBtnStu: true,
      searchform: {
        postername: ''
      },
      posterForm: {
        id: null,
        postername: '',
        cover: '',
        createtime: '',
        updatetime: '',
        statu: 1
      },
      headers: {
        token: localStorage.getItem('token')
      }
    }
  },
  created() {
    this.loadPosterList();
  },
  methods: {
    handleAvatarSuccess(response, file) {
      this.posterForm.cover=response.data
    },
    loadPosterList() {
      this.$axios.get('/system/poster/list', {
        current: this.current,//请求显示第几页
        size: this.size//每页显示几条
      }).then(response => {
        this.tableData = response.data.resultdata.records
        this.total = response.data.resultdata.total
        this.size = response.data.resultdata.size
        this.current = response.data.resultdata.current
      })
    },
    // 删除电影和批量删除电影的方法
    deletePoster(id) { //批量删除id不会赋值
      let ids = []; //存储要删除的ID数组
      // 单个删除:批量删除
      id ? ids.push(id) : this.selection.forEach(item => {
        ids.push(item.id)
      })
      this.$axios.post('/system/poster/delete', ids)
          .then(response => {
            // 弹出消息框
            this.$message({
              message: response.data.message,
              type: 'success',
              showClose: true,
              // 定义一个关闭消息框的回调 重新加载电影数据
              onClose: () => {
                this.loadPosterList()
              }
            })
          })
    },
    //搜索电影信息
    searchPosterInfo() {

    },
    //前台排片
    posterInfo() {

    },
    //关闭新建电影对话框之前，进行的操作
    handleClose() {
      this.dialogFormVisible = false
      //关闭对话框之前要重置表单
      this.resetForm()
    },
    // 提交新建电影
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 保存提交的电影数据（不包括头像文件）
          this.$axios.post('/system/poster/' + (this.posterForm.id ? 'update' : 'save'), this.posterForm)
              .then(response => {
                this.$message({
                  message: response.data.message,
                  type: 'success',
                  showClose: true,
                  // 定义一个关闭消息框的回调 重新加载用户数据
                  onClose: () => {
                    this.loadPosterList() //新建电影成功后，需要重新加载用户数据
                    this.dialogFormVisible = false //电影保存成功，对话框隐藏
                    this.resetForm() //电影保存成功，表单重置
                  }
                })
              })
        }
      })
    },
    //重置新建电影的表单方法
    resetForm() {
      this.posterForm = {}
    },
    // 选中表格中的复选框
    selectionChange(value) {
      this.selection = value;
      if (this.selection) { //如果有选中项
        this.deleteAllBtnStu = (this.selection.length === 0) //启用按钮
      }
    },
    // 编辑电影 查询id
    editposter(id) {
      this.$axios('/poster/posterinfo/' + id)
          .then(response => {
            this.posterForm = response.data.resultdata //将服务器返回的用户数赋值给this.posterForm对象
            this.dialogFormVisible = true
          })
    },
    // 取消编辑电影表单
    cancelSubmitForm() {
      this.dialogFormVisible = false
      this.resetForm()
    },
  },
  components: {}
}
</script>

<style scoped>
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

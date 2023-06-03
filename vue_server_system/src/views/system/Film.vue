<template>
  <div>
    <el-form ref="form" :model="searchform" :inline="true">
      <el-form-item>
        <el-input v-model="searchform.filmname" placeholder="请输入需要搜索的内容"></el-input>
      </el-form-item>
      <el-form-item>
        <el-tag>添加时间</el-tag>
      </el-form-item>
      <el-form-item>
        <el-time-select placeholder="起始时间" v-model="startTime" :picker-options="{
                    start: '08:30',
                    step: '00:15',
                    end: '18:30'
                }">
        </el-time-select>
        <el-time-select placeholder="结束时间" v-model="endTime" :picker-options="{
                    start: '08:30',
                    step: '00:15',
                    end: '18:30',
                    minTime: startTime
                }">
        </el-time-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="searchFilmInfo">搜索</el-button>
        <el-button @click="clearFilmInfo">清空</el-button>
        <el-button type="primary" style="margin-right: 10px;" @click="dialogFormVisible = true">新建</el-button>
        <el-popconfirm title="确定要批量删除电影信息吗？" @confirm="deleteFilm">
          <el-button slot="reference" type="danger" :disabled="deleteAllBtnStu">批量删除</el-button>
        </el-popconfirm>
      </el-form-item>

    </el-form>
    <el-table :data="tableData" border stripe style="width: 100% ; margin-bottom: 20px;"
              @selection-change="selectionChange"
              :cell-style="{ padding: '2px' }">
      <el-table-column type="selection" width="50">
      </el-table-column>
      <el-table-column label="电影封面" width="150">
        <template slot-scope="scope">
          <el-image style="width: 100px; height: 100px" :src="scope.row.cover">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="电影名称" width="90" prop="filmname">
      </el-table-column>
      <el-table-column label="类型" prop="leixing" width="100">
      </el-table-column>
      <el-table-column label="状态" width="65" prop="statu">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.statu === 1" size="mini" type="success">上架</el-tag>
          <el-tag v-else-if="scope.row.statu === 0" size="mini" type="danger">下架</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="地区" prop="region" width="80">
      </el-table-column>
      <el-table-column label="电影时长" prop="duration" width="90">
      </el-table-column>

      <el-table-column label="上映时间" prop="release_time" width="150">
      </el-table-column>
      <el-table-column label="评分" prop="value" width="200">
        <template slot-scope="scope">
          <el-rate v-model="scope.row.grade" disabled show-score text-color="#ff9900" score-template="{value}">
          </el-rate>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="editFilm(scope.row.id)">编辑</el-button>
          <el-divider direction="vertical"></el-divider>
          <el-popconfirm title="确定要删除该电影信息吗？" @confirm="deleteFilm(scope.row.id)">
            <el-button slot="reference" type="text">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="total,sizes,prev, pager, next,jumper" :total="total" :page-size="size"
                   :page-sizes="[5, 10, 15, 20, 25]" :current-page="current">
    </el-pagination>


    <el-dialog title="电影信息" :visible.sync="dialogFormVisible" width="600px" :before-close="handleClose">
      <el-form :model="filmForm" ref="FilmForm" label-width="100px" :rules="rules">
        <el-form-item label="电影图片" label-width="100px">
          <el-upload class="avatar-uploader" action="/api/upload" :show-file-list="false"
                     :on-success="handleAvatarSuccess" :headers="headers">
            <img v-if="filmForm.cover" :src="filmForm.cover" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="电影名称" label-width="100px" prop="filmname">
          <el-input v-model="filmForm.filmname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电影类型" label-width="100px" prop="leixing">
          <el-input v-model="filmForm.leixing" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态" label-width="100px" prop="statu">
          <el-radio-group v-model="filmForm.statu">
            <el-radio :label="0">下架</el-radio>
            <el-radio :label="1">上架</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="地区" label-width="100px" prop="region">
          <el-input v-model="filmForm.region" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电影时长" label-width="100px" prop="duration">
          <el-input v-model="filmForm.duration" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="上映时间" label-width="100px" prop="release_time">
          <el-input v-model="filmForm.release_time" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="评分" label-width="100px" prop="grade">
          <el-input v-model="filmForm.grade" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('FilmForm')">保存</el-button>
          <el-button @click="resetForm('FilmForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      startTime: '',
      endTime: '',
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
        filmname: ''
      },
      rules: {
        filmname: [{required: true, message: '请输入电影名称', trigger: 'blur'}],
        leixing: [{required: true, message: '请输入电影类型', trigger: 'blur'}],
        statu: [{required: true, message: '请输入状态', trigger: 'blur'}],
        region: [{required: true, message: '请输入地区', trigger: 'blur'}],
        duration: [{required: true, message: '请输入电影时长', trigger: 'blur'}],
        release_time: [{required: true, message: '请输入上映时间', trigger: 'blur'}],
        grade: [{required: true, message: '请输入评分', trigger: 'blur'}],
      },
      filmForm: {
        id: null,
        cover: '',
        filmname: '',
        leixing: '',
        region: '',
        duration: '',
        release_time: '',
        grade: '',
        statu: 1
      },
      headers: {
        token: localStorage.getItem('token')
      }
    }
  },
  created() {
    this.loadFilmList();
  },
  methods: {
    loadFilmList() {
      this.$axios.get('/system/film/list', {
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
    deleteFilm(id) { //批量删除id不会赋值
      let ids = []; //存储要删除的ID数组
      // 单个删除:批量删除
      id ? ids.push(id) : this.selection.forEach(item => {
        ids.push(item.id)
      })
      this.$axios.post('/system/film/delete', ids)
          .then(response => {
            // 弹出消息框
            this.$message({
              message: response.data.message,
              type: 'success',
              showClose: true,
              // 定义一个关闭消息框的回调 重新加载电影数据
              onClose: () => {
                this.loadFilmList()
              }
            })
          })
    },
    //搜索用户信息
    searchFilmInfo() {
    },
    //关闭新建电影对话框之前，进行的操作
    handleClose() {
      this.dialogFormVisible = false
      //关闭对话框之前要重置表单
      this.resetForm()
    },
    clearFilmInfo() {

    },
    handleAvatarSuccess(response, file) {
      this.filmForm.cover = response.data
    },
    // 提交新建电影
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 保存提交的用户数据（不包括头像文件）
          this.$axios.post('/system/film/' + (this.filmForm.id ? 'update' : 'save'), this.filmForm)
              .then(response => {
                this.$message({
                  message: response.data.message,
                  type: 'success',
                  showClose: true,
                  // 定义一个关闭消息框的回调 重新加载用户数据
                  onClose: () => {
                    this.loadFilmList() //新建用户成功后，需要重新加载用户数据
                    this.dialogFormVisible = false //用户保存成功，对话框隐藏
                    this.resetForm() //用户保存成功，表单重置
                  }
                })
              })
        }
      })
    },
    //重置新建电影的表单方法
    resetForm() {
      this.filmForm = {}
    },
    // 选中表格中的复选框
    selectionChange(value) {
      this.selection = value;
      if (this.selection) { //如果有选中项
        this.deleteAllBtnStu = (this.selection.length === 0) //启用按钮
      }
    },
    // 编辑用户 查询id
    editFilm(id) {
      this.$axios('/film/filminfo/' + id)
          .then(response => {
            this.filmForm = response.data.resultdata //将服务器返回的用户数赋值给this.filmForm对象
            this.dialogFormVisible = true
          })
    },
    // 取消编辑用户表单
    cancelSubmitForm() {
      this.dialogFormVisible = false
      this.resetForm()
    },
  },
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
  
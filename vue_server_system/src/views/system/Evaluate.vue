<template>
  <div>
    <el-input v-model="searchForm.username" placeholder="请输入用户名"></el-input>&nbsp;&nbsp;
    <el-input v-model="searchForm.filmname" placeholder="请输入电影名"></el-input>&nbsp;&nbsp;
    <el-input v-model="searchForm.evaluatename" placeholder="请输入评论内容"></el-input>&nbsp;&nbsp;
    <el-button @click="loadUserList">搜索</el-button>&nbsp;&nbsp;
<!--    <el-button type="primary" @click="dialogFormVisible=true" v-if="hasAuth('sys:evaluate:save')">新建</el-button>-->
    <el-button type="info" @click="clear">清空</el-button>&nbsp;&nbsp;
    <el-popconfirm title="确认要批量删除类别信息吗？" @confirm="deleteAUser">
      <el-button slot="reference" type="danger" :disabled="deleteAllBtnStu" v-if="hasAuth('sys:evaluate:delete')">批量删除</el-button>
    </el-popconfirm>
    <br>
    <br>

    <el-table :data="tableData" border style="width: 100%; margin-bottom: 20px;" :cell-style="{ padding: '2px' }"
              @selection-change="selectionChange">
      <el-table-column type="selection" width="50">
      </el-table-column>

      <el-table-column label="评论编号" width="90" prop="id">
      </el-table-column>

      <el-table-column label="电影编号" width="90" prop="fid">
      </el-table-column>

      <el-table-column label="电影名称" width="100" prop="fname">
      </el-table-column>

      <el-table-column label="手机号" width="150" prop="uid">
      </el-table-column>

      <el-table-column label="用户名" width="100" prop="username">
      </el-table-column>

      <el-table-column label="评分" width="180" prop="star">

        <template slot-scope="scope">
          <el-rate v-model="scope.row.star" disabled show-score text-color="#ff9900" score-template="{value}">
          </el-rate>
        </template>

      </el-table-column>

      <el-table-column label="评论内容" width="200" prop="comment">
      </el-table-column>

      <el-table-column label="添加时间" width="200" prop="created">
      </el-table-column>


      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="danger" @click="editUser(scope.row.id)" v-if="hasAuth('sys:evaluate:update')">编辑</el-button>
          <el-divider direction="vertical"></el-divider>
          <el-popconfirm title="确认要删除该用户信息吗？" @confirm="deleteAUser(scope.row.id)" >
            <el-button  type="danger" slot="reference"  v-if="hasAuth('sys:evaluate:delete')">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 显示分页页码 -->
    <el-pagination background layout="total, sizes,prev, pager,next,jumper" :total="total" :page-size="size"
                   :page-sizes="[5,10,15,20,25]" :current-page="current"
                   @size-change="handlerSizeChange"
                   @current-change="handlerCurrentChange">
    </el-pagination>

    <el-dialog title="用户信息" :visible.sync="dialogFormVisible" width="600px" :before-close="handleClose">
      <el-form :model="fForm" ref="fForm" label-width="100px" :rules="rules">

<!--        <el-form-item label="评论编号" label-width="100px" prop="id" :disabled="true">-->
<!--          <el-input v-model="fForm.id" autocomplete="off"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="用户名" label-width="100px" prop="username">-->
<!--          <el-input v-model="fForm.name" autocomplete="off"></el-input>-->
<!--        </el-form-item>-->
        <el-form-item label="电影编号" label-width="100px" prop="fid">
          <el-input v-model="fForm.fid" autocomplete="off"></el-input>
        </el-form-item>
<!--        <el-form-item label="电影名称" label-width="100px" prop="fname">-->
<!--          <el-input v-model="fForm.fname" autocomplete="off"></el-input>-->
<!--        </el-form-item>-->
        <el-form-item label="手机号" label-width="100px" prop="uid">
          <el-input v-model="fForm.uid" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="评分" label-width="100px" prop="star">
          <el-input v-model="fForm.star" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="评论内容" label-width="100px" prop="comment">
          <el-input v-model="fForm.comment" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('fForm')">保存用户</el-button>
          <el-button @click="resetForm('fForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>


  </div>
</template>

<script>
export default {
  data() {
    return {


      //是否显示新建用户的对话框
      dialogFormVisible: false,
      //用户数据显示 分页相关数据
      total: 8, //分页显示：用户的总记录数
      size: 10, //分页显示：一页显示的记录数
      current: 1,//分页显示：当前显示的页码，就是第几页

      //用户表格显示的数据: 用户对象数据就是数据库表字段
      tableData: [],
      //批量删除按钮是否可用,只要有选中的复选框，就改变值为false
      deleteAllBtnStu: true,
      //搜索栏对象
      searchForm: {
        username: '',
        filmname:'',
        evaluatename:'',
      },
      //新建用户的表单对象
      fForm: {
        // id: '',
        // fid: '',
        // fname: '',
        // uid: '',
        // name: '',
        // star: '',
        // comment: '',
        // created: '',
        // statu: '',
      },
      //针对于上传头像对服务器的请求，需要设置请求头 携带token
      headers: {
        token: this.$getSessionStorage('token')
      },
      rules: {
        id: [{required: true, message: '请输入用户编号', trigger: 'blur'}],
        name: [
          {required: true, message: '请输入用户名', trigger: 'blur'}
        ],
        fid: [{required: true, message: '请输入电影编号', trigger: 'blur'}],
        fname: [{required: true, message: '请输入电影名', trigger: 'blur'}],
        uid: [{required: true, message: '请输入手机号', trigger: 'blur'}],
        star: [
          {required: true, message: '请输入评分', trigger: 'blur'}
        ],
        comment: [
          {required: true, message: '请输入评论', trigger: 'blur'}
        ],
      }

    }

  },
  created() {
    this.loadUserList()
    console.log(this.tableData)
  },
  methods: {

    //【分页方法】：修改一页显示的记录数 val参数就是切换的一个最新个数
    handlerSizeChange(val) {
      this.size = val
      this.loadUserList()//重新加载角色的数据
    },

    //【分页方法】：切换页码，请求新一页数据
    handlerCurrentChange(val) { //参数val 就是点击的新的页码
      this.current = val
      this.loadUserList()

    },
    //请求服务器，加载所有用户的数据
    //如果是分页显示数据，java服务器的代码中就需要获得分页参数，传递给服务器需要显示第几页
    loadUserList() {
      this.$axios.get('/system/evaluate/list', {
        params: {
          name: this.searchForm.username,
          filmname:this.searchForm.filmname,
          evaluatename:this.searchForm.evaluatename,
          current: this.current,
          size: this.size
        }
      }).then(response => {
        //获得了分页的用户信息
        this.tableData = response.data.resultdata.records
        // this.tableData.fname=response.data.resultdata.records.film.name
        console.log(response.data.resultdata)
        //获得服务器发回分页相关的数据
        this.total = response.data.resultdata.total
        this.size = response.data.resultdata.size
        this.current = response.data.resultdata.current

      })
    },
    selectionChange(value) {
      this.selection = value //selection数组中存放的就是选中所有的用户对象数据
      if (this.selection) {
        //如果seleciton数组中有数据，代表页面上是有选中的用户的，就修改批量删除为可用
        this.deleteAllBtnStu = (this.selection.length === 0) //直接给false，或者判断数组如果长度为0，表示没有数据，赋值true(表示不可用)
      }
    },
    editUser(id) {
      //使用用户的编号 传递到服务器端，进行查询该用户信息，返回用户信息，回显 保存用户的对话框中
      this.$axios('/system/evaluate/info/' + id).then(response => {
        this.fForm = response.data.resultdata  //将服务器返回的用户数据赋值给this.fForm对象
        this.dialogFormVisible = true //显示对话框
      })
    },
    handleClose() {
      //因为对话框中是一个新建用户的表单---关闭对话框前要重置新建用户的表单
      this.resetForm('fForm')
      this.dialogFormVisible = false
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //提交保存新建用户数据：不包括用户头像
          this.$axios.post('/system/evaluate/' + (this.fForm.id ? 'update' : 'save'), this.fForm)
              .then(response => {
                this.$message({
                  message: response.data.message,
                  type: 'success',
                  showClose: true,
                  onClose: () => {
                    this.loadUserList() //新建用户成功后，需要重新加载用户数据
                    this.dialogFormVisible = false //用户保存成功，对话框隐藏
                    this.resetForm(formName) //用户保存成功，表单重置
                  }
                })
              })
        }
      })
    },
    resetForm(formName) {
      this.fForm = {}
      this.$refs[formName].resetFields()
    },
    clear() {
      this.searchForm.username='';
      this.searchForm.filmname='';
      this.searchForm.evaluatename='';
      this.loadUserList();
    },
    //删除一个用户
    deleteAUser(id) {
      //单个删除用户和批量删除用户
      //如果id有值，表示单个删除，如果id没有值，表示进行批量删除(批量删除用户数据 this.selection)
      let ids = [] // 表示要删除的一组用户的id
      id ? ids.push(id) : this.selection.forEach(u => {
        ids.push(u.id)
      })
      //ids存储就是单个删除的用户ID，或者批量删除的用户ID
      this.$axios.post('/system/evaluate/delete', ids).then(response => {
        this.$message({
          message: response.data.message,
          type: 'success',
          duration: 1200,
          //定义一个关闭消息框回调，需要重新加载用户的数据
          onClose: () => {
            this.loadUserList()
          }
        })
      })
    },

  }
}

</script>

<style scoped>
.el-input {
  width: 200px;
}
</style>

<template>
  <div>
    <!-- 页面工具条表单 -->
    <el-form ref="form" :model="searchForm" :inline="true">
      <el-form-item>
        <el-input v-model="searchForm.username" placeholder="请输入要搜索的用户名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="loadUserList">搜索</el-button>
        <el-button type="primary" @click="dialogFormVisible=true" v-if="hasAuth('sys:user:save')">新建</el-button>

        <el-popconfirm title="确认要批量删除用户信息吗？" @confirm="deleteUser">
          <el-button slot="reference" type="danger" :disabled="deleteAllBtnStu" v-if="hasAuth('sys:user:delete')">批量删除</el-button>
        </el-popconfirm>
      </el-form-item>
    </el-form>

    <!-- 显示用户信息表格  data表格显示的数据 -->
    <el-table :data="tableData" border stripe style="width: 100%; margin-bottom:20px;" :cell-style="{ padding:'2px'}"
              @selection-change="selectionChange">
      <el-table-column type="selection" width="50">
      </el-table-column>
      <el-table-column label="头像" width="55">

        <template slot-scope="scope">
          <el-avatar size="small" :src="scope.row.avatar"></el-avatar>
        </template>
      </el-table-column>
      <el-table-column label="用户名" width="120" prop="username">
      </el-table-column>
      <el-table-column label="角色" width="200">
        <template slot-scope="scope">
          <!-- 取到 每一行显示的用户对象。 scope.row.roles角色数组 -->
          <!-- <el-tag size="mini">超级管理员</el-tag><el-tag size="mini">普通用户</el-tag> -->
          <el-tag size="mini" v-for="(role,index) in scope.row.roles" :key="role.id" style="margin-right:2px;">
            {{ role.name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" prop="email" width="180">
      </el-table-column>
      <el-table-column label="电话" prop="tel" width="140">
      </el-table-column>
      <el-table-column label="状态" width="70" prop="statu">
        <template slot-scope="scope">
          <!-- 取出当前这一行显示用户的状态： scope.row.statu -->
          <!-- <el-tag size="mini" type="success">正常</el-tag> -->
          <el-tag size="mini" v-if="scope.row.statu===1" type="success">正常</el-tag>
          <el-tag size="mini" v-else-if="scope.row.statu===0" type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="created" width="200">
        <template slot-scope="scope">
          {{ scope.row.created | fmtDate }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="roleHandle(scope.row.id)" v-if="hasAuth('sys:user:role')">分配角色</el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button type="text" @click="editUser(scope.row.id)" v-if="hasAuth('sys:user:update')">编辑</el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button type="text" @click="resetPass(scope.row.id,scope.row.username)" v-if="hasAuth('sys:user:repass')">重置密码</el-button>
          <el-divider direction="vertical"></el-divider>

          <el-popconfirm title="确认要删除该用户信息吗？" @confirm="deleteUser(scope.row.id)" v-if="hasAuth('sys:user:delete')">
            <el-button slot="reference" type="text">删除</el-button>
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


    <!-- 新建用户和编辑用户的对话框 -->
    <el-dialog title="用户信息" :visible.sync="dialogFormVisible" width="600px" :before-close="handleClose">
      <el-form :model="UserForm" ref="UserForm" label-width="100px" :rules="rules">
        <el-form-item label="用户头像" label-width="100px">
          <el-upload class="avatar-uploader" action="/api/oss/uploadOneFile" :show-file-list="false"
                     :on-success="handleAvatarSuccess" :headers="headers">

            <img v-if="UserForm.avatar" :src="UserForm.avatar" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="用户名" label-width="100px" prop="username">
          <el-input v-model="UserForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="100px" prop="email">
          <el-input v-model="UserForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" label-width="100px" prop="tel">
          <el-input v-model="UserForm.tel" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态" label-width="100px">
          <el-radio-group v-model="UserForm.statu">
            <el-radio :label="0">禁用</el-radio>
            <el-radio :label="1">正常</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('UserForm')" v-if="hasAuth('sys:user:save')">保存用户</el-button>
          <el-button @click="resetForm('UserForm')" v-if="hasAuth('sys:user:save')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="dislogRoleFormVisbible" width="500px" :before-close="UserDiaogClose">
      <el-form :model="UserForm">
        <el-tree :data="roleTreeData" show-checkbox ref="roleTree" node-key="id" :check-strictly="true" :default-expand-all="true" :props="defaultProps">

        </el-tree>
        <el-form-item>
          <el-button type="primary" @click="submitUserRoleForm()">确定</el-button>
          <el-button @click="resetForm()">重置</el-button>
        </el-form-item>

      </el-form>
    </el-dialog>


  </div>
</template>

<script>
export default {

  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'name'
      },
//所有的角色的信息数组:
      roleTreeData: [],
//给用户分配的角色表单对象
      dislogRoleFormVisbible: false,

      //复选框选中的用户数据对象
      selection: [],
      //是否显示新建用户的对话框
      dialogFormVisible: false,
      //用户表格显示的数据：  用户对象数据：就是数据库表字段
      tableData: [],
      //用户数据显示 分页相关数据
      total: 0,  //分页显示：用户的总记录数
      size: 10,   //分页显示：一页显示的记录数
      current: 1,  //分页显示：当前显示的页码，就是第几页

      // //批量删除按钮是否可用  只要有选中复选框，改变值为 false
      deleteAllBtnStu: true,
      // //搜索栏对象
      searchForm: {
        username: ''
      },
      // //新建用户的表单对象
      UserForm: {
        avatar: '',  //头像
        username: '',
        email: '',
        tel: '',
        statu: 1,
      },
      // //针对于上传头像对服务器的请求，需要设置请求头 携带token
      headers: {
        token: localStorage.getItem('token')
      },
      rules: {
        username: [
          //非空验证
          {required: true, message: '请输入用户名', trigger: 'blur'}
        ],
        email: [
          {required: true, message: '请输入邮箱地址', trigger: 'blur'}
        ],
        tel: [
          {required: true, message: '请输手机号', trigger: 'blur'},
        ]
      }
    }
  },
  mounted() {
    this.loadUserList();
  },
  filters: {
    fmtDate: (value) => {  //传递进来日期是一个字符串类型，不是日期对象
      let date = new Date(value)  //将value中的日期字符串  转换为 日期对象date
      let y = date.getFullYear()
      let M = (date.getMonth() + 1).toString().padStart(2, '0')
      let d = date.getDate().toString().padStart(2, '0')

      let h = date.getHours().toString().padStart(2, '0')
      let m = date.getMinutes().toString().padStart(2, '0')
      let s = date.getSeconds().toString().padStart(2, '0')

      //2023年09月09日 22:11:00
      //ES6 拼接占位符  y+'年'+M+'月'
      return `${y}年${M}月${d}日 ${h}:${m}:${s}`
    }
  },
  methods: {

    submitUserRoleForm () {
//获得所设置角色所有的id，从Tree控件获得选中角色ID
      let roleIds = this.$refs.roleTree.getCheckedKeys();
//分配角色需要保存到用户中：
//请求服务器端参数1：用户id，参数2：保存角色的ids
      this.$axios.post('/system/user/role/' + this.UserForm.id, roleIds)
          .then(response => {
            this.$message({
              message: '用户权限数据分配成功',
              type: 'success',
              showClose: true,
//定义一个关闭消息框回调： 需要重新加载用户的数据
              onClose: () => {
                this.UserDiaogClose();
                this.loadUserList()
              }
            });
          })
    },

    //重置新建用户的表单方法
    resetForm() {
      this.UserForm = {}
      // this.$refs[formName].resetFields();  //重置表单  为默认值
    },

    UserDiaogClose() {
      this.UserForm = {};
      this.dislogRoleFormVisbible = false;
    },

    //分配角色方法
    roleHandle(id) {
      //根据用户id，获得该用户的 角色信息。
      this.$axios.get('/system/user/info/' + id)
          .then(response => {
            let user = response.data.resultdata; //user对象包含 当前用户的信息和具有角色信息
            this.UserForm = user
//获得当前这个用户 目前的角色信息
            let roleIds = [] //存储当前用户 角色id
//如果当前用户具有角色信息，就循环得到角色的id
            if (user.roles) {
              user.roles.forEach(r => {
//存储当前用户 角色id
                roleIds.push(r.id)
              })
              console.log('角色id', roleIds);
//设置Tree控件 按照roleIds中的角色id显示选中的角色
            }
//如果roleIds数组为[]。那么设置这个用户的Tree控件中所有角色都不会被选中。
            this.$refs.roleTree.setCheckedKeys(roleIds);
          })
      this.dislogRoleFormVisbible = true //设置true，对话框显示
    },

    //【分页方法】：修改一页显示的记录数 val参数就是切换的一个最新个数
    handlerSizeChange(val) {
      this.size = val
      this.loadUserList() //重新加载角色的数据
    },
//【分页方法】：切换页码，请求新一页数据
    handlerCurrentChange(val) { //参数val 就是点击的新的页码
      this.current = val
      this.loadUserList()
    },


    //重置用户密码
    resetPass(id, name) {
      this.$confirm('重置用户【' + name + '】的密码，是否继续执行该操作', '重置密码操作',
          {
            confirmButtonText: '确定',
            concelButtonText: '取消',
            type: 'warning'
          }
      )
          .then(_ => {
            //请求服务器重置该用户的密码:
            this.$axios.post('/system/user/repass', id).then((response) => {
              this.$message({
                message: response.data.message,
                type: 'success',
                showClose: true,
              });
            })
          })
    },
    //编辑用户的方法：  参数：要编辑的用户编号 id
    //编辑用户的方法： 参数：要编辑的用户编号 id
    editUser(id) {
//使用用户的编号 传递到服务器端， 进行查询该用户信息，返回用户信息，回显保存用户的对话框中。
      this.$axios('/system/user/info/' + id).then(response => {
        this.UserForm = response.data.resultdata //将服务器返回的用户数据赋值给this.UserForm对象，this.UserFormd对象数据是和表单控件双向数据绑定。
        this.dialogFormVisible = true //显示对话框
      })
    },

    //请求服务器，加载所有用户的数据
    //如果是分页显示数据，Java服务器的代码中就需要获得分页参数。例如，传递给服务器，我要显示第几页。
    loadUserList() {
      this.$axios.get('/system/user/list', {
        params: {
          username: this.searchForm.username,
          current: this.current,
          size: this.size
        }
      }).then(response => {
        this.tableData = response.data.resultdata.records
        // console.log(response.data.resultdata)
        this.total = response.data.resultdata.total
        this.size = response.data.resultdata.size
        this.current = response.data.resultdata.current
      })

      //请求服务器端，获得所有的角色信息，给到Tree控件
      this.$axios.get('/system/role/list').then(response => {
        this.roleTreeData = response.data.resultdata.records;
        // console.log(this.roleTreeData)
      })
    },
    //删除用户和批量删除用户的方法  参数 用户编号 id
    deleteUser(id) {
      //单个删除用户和批量删除用户
      //如果id有值，表示单个删除，如果id没有值，表示进行批量删除（批量删除用户数据 this.selection）。
      let ids = [];  //表示要删除的一组用户的id
      id ? ids.push(id) : this.selection.forEach(u => {
        ids.push(u.id)
      })

      //ids存储就是单个删除的用户ID，或者批量删除的用户ID  GET POST PUT DELETE
      this.$axios.post('/system/user/delete', ids).then(response => {
        this.$message({
          message: response.data.message,
          type: 'success',
          showClose: true,
          //定义一个关闭消息框回调： 需要重新加载用户的数据
          onClose: () => {
            this.loadUserList()
          }
        });
      })
    },
    //搜索用户信息
    searchUserInfo() {

    },
    //关闭新建用户对话框之前，进行操作
    handleClose() {
      //因为对话框中其实 是一个新建用户的表单---关闭对话框前，重置新建用户的表单
      // this.resetForm('UserForm')
      this.UserForm = {}
      this.dialogFormVisible = false
    },
    //用户头像上传成功回调
    handleAvatarSuccess (response, file) {
      console.log(response.resultdata);
//axios使用请求then()回调，取数据必须是：response.data.resultdata
//这里没有使用axios，所以返回response取数据，直接取response.resultdata
//使用上传控件，上传头像成功，服务器返回一个 上传后的图片的网络地址。
      this.UserForm.avatar = response.resultdata
    },
    //提交 新建用户的表单方法/system/user/save    更新用户的操作/system/user/update
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //提交保存新建用户数据： 不包括用户头像
          //this.UserForm.id 如果进行新建用户，那么新建用户只有提交服务器保存到数据库中，数据库id这个主键列才会自增，this.UserForm.id才会有值。
          //this.userForm.id如果有值，那么就是更新操作，因为在editUser方法中已经通过 点击编辑 按钮，将要编辑的用户id传递给服务器查询该用户的所有信息
          this.$axios.post('/system/user/' + (this.UserForm.id ? 'update' : 'save'), this.UserForm)
              .then(response => {
                this.$message({
                  message: response.data.message,
                  type: 'success',
                  showClose: true,
                  onClose: () => {
                    this.loadUserList() //新建用户成功后，需要重新加载用户数据
                    this.dialogFormVisible = false  //用户保存成功，对话框隐藏
                    this.resetForm(formName)   //用户保存成功，表单重置
                  }
                });
              })
        }
      })
    },

    //选中表格中复选框  参数value就是选中行对象（选中行 的用户数据）  返回一个数组。
    selectionChange(value) {
      this.selection = value;  //selection数组中存放就是选中所有的用户对象数据
      if (this.selection) {
        //如果selection数组中有数据，代表页面上是有选中的用户的。就修改批量删除为可用  deleteAllBtnStu
        this.deleteAllBtnStu = (this.selection.length === 0)   //直接给false，或者判断数组如果长度为0，表示没有数据，赋值true(不可用)
      }
    }

  }
}
</script>

<style scoped>
/* 上传用户头像控件的样式 */

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

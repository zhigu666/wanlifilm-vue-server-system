<template>
  <div>
    <!-- 页面工具条表单 -->
    <el-form ref="form" :model="searchForm" :inline="true">
      <el-form-item>
        <el-input v-model="searchForm.name" placeholder="请输入要搜索的角色"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="loadRoleList">搜索</el-button>
        <el-button type="primary" @click="dialogFormVisible=true">新建</el-button>

        <el-popconfirm title="确认要批量删除角色信息吗？" @confirm="deleteRole">
          <el-button slot="reference" type="danger" :disabled="deleteAllBtnStu">批量删除</el-button>
        </el-popconfirm>
      </el-form-item>
    </el-form>

    <!-- 显示所有角色的表格 -->
    <el-table :data="tableData" border stripe style="width: 100%; margin-bottom:20px;" :cell-style="{ padding:'2px'}"
              @selection-change="selectionChange">
      <el-table-column type="selection" width="50">
      </el-table-column>
      <el-table-column label="角色名称" width="200" prop="name">
      </el-table-column>
      <el-table-column label="角色编码" width="150" prop="code">
      </el-table-column>
      <el-table-column label="描述" width="500" prop="remark">
      </el-table-column>
      <el-table-column label="状态" width="70" prop="statu">
        <template slot-scope="scope">
          <!-- 取出当前这一行显示用户的状态： scope.row.statu -->
          <!-- <el-tag size="mini" type="success">正常</el-tag> -->
          <el-tag size="mini" v-if="scope.row.statu===1" type="success">正常</el-tag>
          <el-tag size="mini" v-else-if="scope.row.statu===0" type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="PermHandler(scope.row.id)">分配权限</el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button type="text" @click="editRole(scope.row.id)">编辑</el-button>
          <el-divider direction="vertical"></el-divider>


          <el-popconfirm title="确认要删除该角色信息吗？" @confirm="deleteRole(scope.row.id)">
            <el-button slot="reference" type="text">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>


    <!-- 显示分页页码 -->
    <el-pagination background layout="total, sizes,prev, pager,
next,jumper" :total="total" :page-size="size" :page-sizes="
[5,10,15,20,25]" :current-page="current"
                   @size-change="handlerSizeChange"
                   @current-change="handlerCurrentChange">
    </el-pagination>

    <!-- 新建角色 编辑角色对话框 -->
    <el-dialog title="角色信息" :visible.sync="dialogFormVisible" width="550px" :before-close="handleClose">
      <el-form :model="RoleForm" ref="RoleForm" label-width="100px" :rules="rules">
        <el-form-item label="角色名称" label-width="100px" prop="name">
          <el-input v-model="RoleForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色编码" label-width="100px" prop="code">
          <el-input v-model="RoleForm.code" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述" label-width="100px" prop="remark">
          <el-input v-model="RoleForm.remark" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="状态" label-width="100px">
          <el-radio-group v-model="RoleForm.statu">
            <el-radio :label="0">禁用</el-radio>
            <el-radio :label="1">正常</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('RoleForm')">保存角色</el-button>
          <el-button @click="resetForm('RoleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" :visible="dialogPermFormVisible" width="400px" :before-close="RoleDiaogClose">
      <el-form :model="PermForm" ref="PermForm" label-width="100px" >
        <el-tree ref="permTree" :data="permTreeData" show-checkbox node-key="id" :check-strictly="true" :default-expand-all="true" :props="defaultProps">
        </el-tree>
        <el-form-item>
          <el-button type="primary"
                     @click="submitPermtForm('PermForm')">确定</el-button>
          <el-button @click="resetForm('PermForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>


  </div>
</template>

<script>
export default {
  data() {
    return {
      //权限Tree控件的显示权限数据(显示所有的权限数据)
      permTreeData:[],
//分配权限的表单对象(角色权限)
      PermForm: {},
      //新建角色 和 编辑角色对话框中表单 对应的角色对象
      RoleForm: {
        name: '',
        code: '',
        remark: '',
        statu: 0,
      },
      //Tree控件如何从 返回菜单数据中取值
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      selection: [],  //复选框选中的角色的对象
      tableData: [],  //所有角色的数据
      deleteAllBtnStu: true,   //批量删除角色的按钮是否可用，默认是true，不可用
      dialogFormVisible: false,  //新建角色的对话框是否显示的变量
      dialogPermFormVisible:false,//分配权限对话框是否显示
      // //搜索栏对象
      searchForm: {
        name: ''    //角色名称
      },
      //用户数据显示 分页相关数据
      total: 0,  //分页显示：用户的总记录数
      size: 10,   //分页显示：一页显示的记录数
      current: 1,  //分页显示：当前显示的页码，就是第几页

      rules: {
        name: [
          //非空验证
          {required: true, message: '请输入角色的名称', trigger: 'blur'}
        ],
        code: [
          {required: true, message: '请输入角色编码', trigger: 'blur'}
        ],
        remark: [
          {required: true, message: '请输角色信息的描述', trigger: 'blur'},
        ]
      }
    }
  },
  created() {
    this.loadRoleList()
  },
  methods: {
    submitPermtForm(){
      let menuIds=this.$refs.permTree.getCheckedKeys();
      console.log(1)
      this.$axios.post('/system/role/perm/'+this.PermForm.id,menuIds)
      .then(response=>{
        this.$message({
          message: "权限数据保存成功",
          type: 'success',
          showClose: true,
          // duration: 1500,
          onClose: () => {
            this.RoleDiaogClose()
            this.loadRoleList() //新建用户成功后，需要重新加载用户数据
          }
        });
      })
    },
    //分配权限的方法
    PermHandler(role_id){
      this.dialogPermFormVisible=true;
      //加载请求当前角色的权限信息

      this.$axios.get('/system/role/roleinfo/'+role_id)
      .then(response=>{
        this.$refs.permTree.setCheckedKeys(response.data.resultdata.menuIds);
        this.PermForm=response.data.resultdata;
      })
    },

    //关闭分配权限对话框
    RoleDiaogClose() {
//this.$refs[formName].resetFields();
      this.PermForm = {}
      this.dialogPermFormVisible = false
    },

    //【分页方法】：修改一页显示的记录数 val参数就是切换的一个最新个数
    handlerSizeChange(val) {
      this.size = val
      this.loadRoleList() //重新加载角色的数据
    },
//【分页方法】：切换页码，请求新一页数据
    handlerCurrentChange(val) { //参数val 就是点击的新的页码
      this.current = val
      this.loadRoleList()
    },


    //保存新建角色信息。
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //请求服务器进行  保存角色  或者  更新角色  操作
          //this.$axios.post(路径,参数)
          this.$axios.post('/system/role/' + (this.RoleForm.id ? 'update' : 'save'), this.RoleForm)
              .then((response) => {
                this.$message({
                  message: response.data.message,
                  type: 'success',
                  // showClose: true,
                  duration: 1500,
                  onClose: () => {
                    this.loadRoleList() //新建用户成功后，需要重新加载用户数据
                    this.dialogFormVisible = false  //用户保存成功，对话框隐藏
                    this.resetForm(formName)   //用户保存成功，表单重置
                  }
                });
              })
        }
      })
    },
    //重置新建或编辑角色 对话框表单的 方法
    resetForm(formName) {
      this.RoleForm = {}
      this.$refs[formName].resetFields();
    },
    //关闭新建或者 编辑角色对话框的回调函数
    handleClose() {
      this.RoleForm = {}   //关闭角色对话框，首先清空 RoleForm角色对象信息
      this.dialogFormVisible = false  //设置对话框变量为false，对话框就不显示
    },
    //加载页面的所有的角色信息。
    //如果searchForm.name属性为空，代表搜索栏没有输入内容，默认加载所有的角色信息
    //如果searchForm.name属性有值，代表搜索栏的输入有内容，按照内容去服务器模糊查询相关的角色信息
    loadRoleList() {
      //请求服务器，加载 所有的角色的信息，赋值给 this.tableData
      this.$axios.get('/system/role/list', {
        params: {
          name: this.searchForm.name,
          current: this.current,
          size: this.size
        }
      }).then(response => {
        this.tableData = response.data.resultdata.records
        this.total = response.data.resultdata.total
        this.size = response.data.resultdata.size
        this.current = response.data.resultdata.current
      })

      //请求服务器，获得所有的权限的数据给到PermTreeData:
      this.$axios.get('/system/menu/list').then(reponse => {
        this.permTreeData = reponse.data.resultdata
      })
    },
    // deleteRole () {  //删除角色的方法
    //   console.log(1);
    // },
    selectionChange(value) { //选中表格的复选框 要执行的操作
      this.selection = value;  //将表格复选框 选中的 角色对象赋值给 selection 数组
      if (this.selection) {
        this.deleteAllBtnStu = (this.selection.length === 0)
      }
    },
    editRole(id) {  //编辑角色的方法
      //根据角色的id查询该角色的详细信息
      this.$axios('/system/role/roleinfo/' + id).then(response => {
        this.RoleForm = response.data.resultdata
        //RoleForm对象 是和 角色对话框 中表单是双向数据绑定，所以  RoleForm有数据，对话框的表单就有数据。
        this.dialogFormVisible = true  //显示对话框
      })
    },
    deleteRole(id) {  //删除角色的方法
      //删除角色与删除用户思路一致，如果id没有值，那么批量删除( this.selection )，如果id有值，进行单个用户删除( id )。
      let ids = [];
      id ? ids.push(id) : this.selection.forEach(r => {
        ids.push(r.id)
      })
      this.$axios.post('/system/role/delete',ids).then(response => {
        this.$message({
          message: response.data.message,
          type: 'success',
          showClose: true,
          //定义一个关闭消息框回调：
          onClose: () => {
            this.loadRoleList()   //需要重新加载表格中角色的数据
          }
        });
      })
    }
  },
  components: {}
}
</script>

<style scoped>
</style>

<template>
 <div>
  <!-- 创建菜单页面工具栏 -->
  <el-form :inline="true">
    <el-form-item>
      <el-button type="primary" @click="dialogFormVisible=true">新增菜单</el-button>
    </el-form-item>
  </el-form>

  <!-- 菜单表格 -->
  <el-table :data="tableData"   border  row-key="id"  :tree-props="{children: 'children', hasChildren: 'hasChildren'}"   style="width: 100%; margin-bottom:20px;" :cell-style="{ padding:'2px'}">
    <el-table-column label="名称" width="180" prop="name" > 
    </el-table-column>
    <el-table-column label="权限编码" width="180" prop="perms" > 
    </el-table-column>
    <el-table-column label="菜单图标" width="180" prop="icon" > 
    </el-table-column>
    <el-table-column label="菜单类别" width="120" prop="type" >
      <template slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.type===0">目录</el-tag>
          <el-tag size="mini" v-else-if="scope.row.type===1" type="success">菜单</el-tag>
          <el-tag size="mini" v-else-if="scope.row.type===2" type="warning">按钮</el-tag>
      </template> 
    </el-table-column>
    <el-table-column label="菜单URL"  prop="path" > 
    </el-table-column>
    <el-table-column label="菜单组件"  prop="component" > 
    </el-table-column>
    <el-table-column label="状态"  prop="statu" > 
      <template slot-scope="scope">     
        <el-tag size="mini" v-if="scope.row.statu===1" type="success">正常</el-tag>
        <el-tag size="mini" v-else-if="scope.row.statu===0" type="danger">禁用</el-tag>
        </template>
    </el-table-column>
      <el-table-column label="操作"  > 
        <template slot-scope="scope">         
          <el-button type="text" @click="editMenu(scope.row.id)">编辑</el-button>
          <el-divider direction="vertical"></el-divider>
          <el-popconfirm title="确认要删除该菜单信息吗？" @confirm="deleteMenu(scope.row.id)">
            <el-button slot="reference" type="text">删除</el-button>
          </el-popconfirm>  
        </template>
    </el-table-column>
  </el-table>

  <!-- 新建菜单对话框 -->
  <el-dialog title="新建菜单" :visible.sync="dialogFormVisible" width="550px" :before-close="handleClose" >
    <el-form :model="MenuForm" ref="MenuForm" label-width="100px" :rules="MenuRules" >
      <!-- 下拉列表显示父菜单 以及 子菜单 -->
      <el-form-item label="上级菜单" prop="parentId">
        <el-select v-model="MenuForm.parentId" placeholder="请选择上级菜单">
          <el-option :label="0" value="0"></el-option>
          <template v-for="(item,index) in tableData">
            <el-option   :label="item.name" :value="item.id" >
            </el-option>

            <!-- 二级菜单 -->
            <template v-for="(childMenu,i) in item.children" >
                <el-option  :label="childMenu.name" :value="childMenu.id"  :key="childMenu.id">
                  <span style="padding-left:20px;">{{ ' -'+childMenu.name }}</span>
                </el-option>
            </template>
          </template>
        </el-select>
      </el-form-item>

      <el-form-item label="菜单名称" prop="name" label-width="100px">
        <!-- autocomplete="off" 清空文本框历史输入痕迹 -->
        <el-input v-model="MenuForm.name" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="权限编码" prop="perms" label-width="100px">
        <!-- autocomplete="off" 清空文本框历史输入痕迹 -->
        <el-input v-model="MenuForm.perms" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="图标" prop="icon" label-width="100px">
        <!-- autocomplete="off" 清空文本框历史输入痕迹 -->
        <el-input v-model="MenuForm.icon" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="菜单URL" prop="path" label-width="100px">
        <!-- autocomplete="off" 清空文本框历史输入痕迹 -->
        <el-input v-model="MenuForm.path" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="菜单组件" prop="component" label-width="100px">
        <!-- autocomplete="off" 清空文本框历史输入痕迹 -->
        <el-input v-model="MenuForm.component" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="菜单类型" prop="type" label-width="100px">
         <el-radio-group v-model="MenuForm.type">
          <el-radio :label="0">目录</el-radio>
          <el-radio :label="1">菜单</el-radio>
          <el-radio :label="2">按钮</el-radio>
        </el-radio-group>
      </el-form-item>

       <el-form-item label="菜单状态" prop="statu" label-width="100px">
         <el-radio-group v-model="MenuForm.statu">
          <el-radio :label="0">禁用</el-radio>
          <el-radio :label="1">正常</el-radio>
        </el-radio-group>
      </el-form-item>  

      <el-form-item>
          <el-button type="primary" @click="submitForm('MenuForm')">保存菜单</el-button>
          <el-button @click="resetForm('MenuForm')">重置</el-button>
        </el-form-item>
    </el-form>
  </el-dialog>
 </div>
</template>

<script>
export default {
  data() {
    return {
      MenuForm: {},  //菜单对象
      dialogFormVisible: false,  //新建菜单 对话框是否显示的变量
      tableData: [],   //菜单表格显示 数据
      MenuRules: {
        parentId: [
          {required:true,message:'请选择上级菜单',trigger:'blur'}
        ],
        name: [
          {required:true,message:'请输入菜单的名称',trigger:'blur'}
        ],
        perms: [
          {required:true,message:'请输入权限编码',trigger:'blur'}
        ],
        type: [
          {required:true,message:'请选择菜单类型',trigger:'blur'}
        ],
        statu: [
          {required:true,message:'请选择菜单状态',trigger:'blur'}
        ],
      },
    }
  },
  created () { 
    this.loadMenuList();
  },
  methods: {
    //提交保存菜单的对话框
    submitForm (formName) { 
      this.$refs[formName].validate((valid) => { 
        if (valid) {
          this.$axios.post('/system/menu/' + (this.MenuForm.id ? 'update' : 'save'), this.MenuForm)
            .then((response) => { 
              this.$message({
                    message: response.data.message,
                    type: 'success',
                    duration:1000,
                    onClose: () => { 
                      this.loadMenuList() //新建用户成功后，需要重新加载用户数据
                      this.dialogFormVisible = false  //用户保存成功，对话框隐藏
                      this.resetForm(formName)   //用户保存成功，表单重置
                    }
                });
            })
        } else { 
          return false
        }
      })
    },
    //关闭新建菜单对话框
    handleClose () { 
      this.dialogFormVisible = false;
      this.resetForm('MenuForm')
    },
    //删除菜单
    deleteMenu (id) {
      console.log(id)
      this.$axios.post('/system/menu/delete/'+id)
        .then((response) => { 
             this.$message({
                    message: response.data.message,
                    type: 'success',
                    duration:1000,
                    onClose: () => { 
                      this.loadMenuList() //新建用户成功后，需要重新加载用户数据 
                    }
              });
        })
    },
    //编辑菜单
    editMenu (id) { 
      //请求服务器端，通过菜单编号获得 菜单详细数据   实际请求地址：/system/menu/info/10
      this.$axios.get('/system/menu/info/' + id).then((response) => { 
        this.MenuForm = response.data.resultdata
        this.dialogFormVisible = true  
      })
    },
    loadMenuList () { 
       //请求Java服务器，获得所有菜单的数据
      this.$axios.get('/system/menu/list').then((response => { 
        this.tableData = response.data.resultdata
      }))
    },
    
    //重置保存菜单的对话框
    resetForm (formName) { 
      this.MenuForm = {}
      this.$refs[formName].resetFields();
    }
  },
  components: {
  }
}
</script>

<style scoped>
</style>

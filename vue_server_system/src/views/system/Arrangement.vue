<template>
  <div>
    <el-form ref="form" :model="searchForm" :inline="true">
      <el-form-item>
        <el-input v-model="searchForm.name" placeholder="请输入要搜索的内容"></el-input>
      </el-form-item>
      <!-- <el-form-item> -->
      <!-- <el-form-item style="margin-right: 8px;">添加时间</el-form-item>
  </el-form-item>
      <template>
          <el-date-picker type="date" placeholder="选择开始日期" style="margin-right: 8px;">
          </el-date-picker>
          <el-date-picker type="date" placeholder="选择截止日期" style="margin-right: 8px;">
          </el-date-picker>
      </template> -->
      <el-form-item>
        <el-button @click="searchFilmInfo">搜索</el-button>
        <!-- <el-button type="info">清空</el-button> -->
        <el-button type="primary" @click="dialogFormVisible = true"
                   v-if="hasAuth('sys:arrangement:save')">新建</el-button>
        <el-popconfirm title="确认要批量删除角色消息吗？" @confirm="deleteArrangement">
          <el-button slot="reference" type="danger" :disabled="deleteAllBtnStu" style="margin-left: 8px;"
                     v-if="hasAuth('sys:arrangement:delete')">批量删除</el-button>
        </el-popconfirm>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" border stripe style="width: 100%; margin-bottom: 20px;" :cell-style="{ padding: '2px' }"
              @selection-change="selectionChange">
      <el-table-column type="selection" width="50">
      </el-table-column>
      <el-table-column label="电影名称" width="100" prop="name">
      </el-table-column>
      <el-table-column width="100" label="开放座位" prop="seatsnumber">
      </el-table-column>
      <el-table-column width="50" label="类型" prop="type">
      </el-table-column>
      <el-table-column width="90" label="票房统计" prop="statistics">
      </el-table-column>
      <el-table-column width="60" label="价格" prop="price">
      </el-table-column>
      <el-table-column width="120" label="电影放映日期" prop="date">
      </el-table-column>
      <el-table-column label="电影开始时间" prop="starttime" width="180">
      </el-table-column>
      <el-table-column label="电影结束时间" prop="endtime" width="180">
      </el-table-column>
      <el-table-column label="状态" width="70">
        <template slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.statu === 1" type="success">上架</el-tag>
          <el-tag size="mini" v-else-if="scope.row.statu === 0" type="danger">下架</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="editArrangement(scope.row.id)"
                     v-if="hasAuth('sys:arrangement:update')">编辑</el-button>
          <el-divider direction="vertical"></el-divider>
          <el-popconfirm title="确认要删除角色信息吗？" @confirm="deleteArrangement(scope.row.id)">
            <el-button slot="reference" type="text" v-if="hasAuth('sys:arrangement:delete')">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 显示分页页码 -->
    <el-pagination background layout="total, sizes,prev, pager,next,jumper" :total="total" :page-size="size"
                   @size-change="handlerSizeChange" @current-change="handlerCurrentChange" :page-sizes="[5, 10, 15, 20, 25]"
                   :current-page="current">
    </el-pagination>

    <el-dialog title="排片信息" :visible.sync="dialogFormVisible" width="550px" :before-close="handleClose">
      <el-form :model="ArrangementForm" ref="ArrangementForm" label-width="100px" :rules="rules">
        <el-form-item label="电影名称" label-width="100px" prop="name">
          <el-input v-model="ArrangementForm.name" autocomplete="off">
          </el-input>
        </el-form-item>

        <el-form-item label="开放座位" label-width="100px" prop="seatsnumber">
          <el-input v-model="ArrangementForm.seatsnumber" autocomplete="off">
          </el-input>
        </el-form-item>

        <el-form-item label="类型" label-width="100px" prop="type">
          <el-input v-model="ArrangementForm.type" autocomplete="off">
          </el-input>
        </el-form-item>
        <el-form-item label="票房统计" label-width="100px" prop="statistics">
          <el-input v-model="ArrangementForm.statistics" autocomplete="off">
          </el-input>
        </el-form-item>
        <el-form-item label="价格" label-width="100px" prop="price">
          <el-input v-model="ArrangementForm.price" autocomplete="off">
          </el-input>
        </el-form-item>
        <el-form-item label="放映日期" label-width="100px" prop="date">
          <el-date-picker type="date" v-model="ArrangementForm.date" placeholder="选择电影放映日期" autocomplete="off">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="开始时间" label-width="100px" prop="starttime">
          <!-- <el-date-picker v-model="ArrangementForm.starttime" type="datetime" placeholder="选择日期时间"
              autocomplete="off">
          </el-date-picker> -->
          <el-time-picker arrow-control v-model="ArrangementForm.starttime" :picker-options="{
                        selectableRange: '09:30:00 - 18:30:00'
                    }" placeholder="选择时间点">
          </el-time-picker>


        </el-form-item>
        <el-form-item label="结束时间" label-width="100px" prop="endtime">
          <!-- <el-date-picker v-model="ArrangementForm.endtime" type="datetime" placeholder="选择日期时间"
              autocomplete="off">
          </el-date-picker> -->

          <el-time-picker arrow-control v-model="ArrangementForm.endtime" :picker-options="{
                        selectableRange: '12:00:00 - 23:00:00'
                    }" placeholder="选择时间点">
          </el-time-picker>

        </el-form-item>
        <el-form-item label="状态" label-width="100px" prop="statu">
          <el-radio-group v-model="ArrangementForm.statu">
            <el-radio :label="0">下架</el-radio>
            <el-radio :label="1">上架</el-radio>
          </el-radio-group>
        </el-form-item>


        <el-form-item>
          <el-button type="primary" @click="submitForm('ArrangementForm')">保存排片</el-button>
          <el-button @click="resetForm('ArrangementForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div></template>

<script>
export default {
  data() {
    return {
      ArrangementForm: {
        starttime: '',
        endtime: '',
        statu: 1,
        name: '',
        price: '',
        seatsnumber: '',
        type: '',
        statistics: '',
        date: '',
      },
      selection: [],
      total: 0,
      size: 5,
      current: 1,
      tableData: [],
      deleteAllBtnStu: true,
      dialogFormVisible: false,
      searchForm: {
        name: ''
      },
      rules: {
        name: [
          //非空验证
          { required: true, message: '请输入电影名称', trigger: 'blur' }
        ],
        seatsnumber: [
          //非空验证
          { required: true, message: '请输入开放座位数量', trigger: 'blur' }
        ],
        type: [
          //非空验证
          { required: true, message: '请输入电影类型', trigger: 'blur' }
        ],
        statistics: [
          //非空验证
          { required: true, message: '请输入票房总数', trigger: 'blur' }
        ],
        price: [
          //非空验证
          { required: true, message: '请输入电影票价格', trigger: 'blur' }
        ],
        date: [
          //非空验证
          { required: true, message: '请选择电影放映日期', trigger: 'blur' }
        ],
        // starttime: [
        //     //非空验证
        //     { required: true, message: '请选择电影开始时间', trigger: 'blur' }
        // ],
        // endtime: [
        //     //非空验证
        //     { required: true, message: '请选择电影结束时间', trigger: 'blur' }
        // ],
        statu: [
          //非空验证
          { required: true, message: '请选择电影状态', trigger: 'blur' }
        ],
      },
    }
  },
  components: {

  },
  created() {
    this.loadArrangementList()
  },
  methods: {
    handlerCurrentChange(val) {
      this.current = val
      this.loadArrangementList();
    },
    handlerSizeChange(val) {
      this.size = val
      this.loadArrangementList();
    },
    selectionChange(value) {
      this.selection = value;
      if (this.selection) {
        this.deleteAllBtnStu = (this.selection.length == 0)
      }
    },
    searchFilmInfo() {
      this.loadArrangementList();
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios.post('/system/arrangement/' + (this.ArrangementForm.id ? 'update' : 'save'), this.ArrangementForm)
              .then(response => {
                this.$message({
                  message: response.data.message,
                  type: 'success',
                  // showClose: true,
                  duration: 1000,
                  onClose: () => {
                    this.loadArrangementList()
                    this.dialogFormVisible = false//自动退出
                    this.resetForm(formName)//重置表单
                  }
                })
              })
        }
      })
    },
    // submitForm(formName) {
    //     this.$refs[formName].validate(valid => {
    //         if (valid) {
    //             this.$axios.post('/system/menu/' + (this.MenuForm.id ? 'update' : 'save'), this.MenuForm)
    //                 .then((response) => {
    //                     this.$message({
    //                         message: response.data.message,
    //                         type: "success",
    //                         duration: 1200,
    //                         onClose: () => {
    //                             this.loadMenuList()
    //                             this.dialogFormVisible = false
    //                             this.restForm(formName)
    //                         }
    //                     });
    //                 })
    //         } else {
    //             return false
    //         }
    //     })
    // },
    resetForm(formName) {
      this.ArrangementForm = {}
      this.$refs[formName].resetFields()
    },
    handleClose() {
      // this.resetForm('UserForm')
      this.ArrangementForm = {}
      this.dialogFormVisible = false
    },
    // loadArrangementList() {
    //     this.$axios.get('/system/arrangement/list').then(response => {
    //         this.tableData = response.data.resultdata.records
    //         this.total = response.data.resultdata.total
    //         this.size = response.data.resultdata.size
    //         this.current = response.data.resultdata.current
    //     })
    // },
    loadArrangementList() {
      this.$axios.get('/system/arrangement/list',
          {
            params: {
              starttime: this.searchForm.starttime,
              endtime: this.searchForm.endtime,
              name: this.searchForm.name,
              current: this.current,
              size: this.size
            }
          }
      ).then(repsonse => {
        //获得分页的用户信息
        this.tableData = repsonse.data.resultdata.records
        // console.log('111', this.tableData);
        //获得服务器发回分页相关的数据
        this.total = repsonse.data.resultdata.total
        this.size = repsonse.data.resultdata.size
        this.current = repsonse.data.resultdata.current
      })
      // //请求服务器端，获得所有的角色信息，给到Tree控件
      // this.$axios.get('/system/role/list').then(response => {
      //     this.roleTreeData = response.data.resultdata.records;
      // })
    },

    // editArrangement(id) {
    //     this.$axios('/arrangement/arrangementinfo/*' + id).then(response => {
    //         this.ArrangementForm = response.data.data
    //         this.dialogFormVisible = true
    //     })
    // },
    editArrangement(id) {
      this.$axios.get('/system/arrangement/info/' + id).then(response => {
        this.ArrangementForm = response.data.resultdata
        this.dialogFormVisible = true
      })
    },
    deleteArrangement(id) {
      let ids = [];//要删除的一组数据的id
      id ? ids.push(id) : this.selection.forEach(u => {
        ids.push(u.id)
      })
      console.log(ids)
      this.$axios.post('/system/arrangement/delete', ids).then(response => {
        this.$message({
          message: response.data.message,
          type: 'success',
          showClose: true,
          onClose: () => {
            this.loadArrangementList()
          }
        })
      })
    },
  }
}
</script>

<style scoped></style>

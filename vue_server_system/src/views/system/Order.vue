<template>
  <div>
    <el-form ref="form" :model="searchForm" :inline="true">
      <el-form-item>
        <el-input v-model="searchForm.username" placeholder="请输入要搜索的订单名称"></el-input>
      </el-form-item>
      <!-- <el-form-item>
          <el-tag>添加时间</el-tag>
      </el-form-item>
      <template>
          <el-time-select style="margin-right: 8px;" placeholder="请选择开始时间" v-model="startTime" :picker-options="{
              start: '08:30',
              step: '00:15',
              end: '18:30'
          }">
          </el-time-select>
          <el-time-select style="margin-right: 8px;" placeholder="请选择截止时间" v-model="endTime" :picker-options="{
              start: '08:30',
              step: '00:15',
              end: '18:30',
              minTime: startTime
          }">
          </el-time-select>
      </template> -->
      <el-form-item>
        <el-button @click="searchOrdersInfo">搜索</el-button>
        <!-- <el-button type="info">清空</el-button> -->

        <el-popconfirm title="确认要批量删除用户消息吗？" @confirm="deleteOrder">
          <el-button slot="reference" type="danger" :disabled="deleteAllBtnStu"
                     style="margin-left: 8px;" v-if="hasAuth('sys:order:delete')">批量删除</el-button>
        </el-popconfirm>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" border stripe style="width: 100%; margin-bottom: 20px;" :cell-style="{ padding: '2px' }"
              @selection-change="selectionChange">
      <el-table-column type="selection" width="50">
      </el-table-column>
      <el-table-column label="订单编号" width="80" prop="id">
      </el-table-column>
      <el-table-column width="200" label="用户ID(手机号)" prop="uid">
      </el-table-column>
      <el-table-column width="120" label="用户名" prop="username">
      </el-table-column>
      <el-table-column width="150" label="电影名称" prop="name">
      </el-table-column>
      <el-table-column width="150" label="座位" prop="seats">
      </el-table-column>
      <!-- <el-table-column label="创建时间" width="200" prop="created">
          <template slot-scope="scope">
              {{ scope.row.created | fmtDate }}
          </template>
      </el-table-column> -->
      <el-table-column width="200" label="电影开始时间" prop="releasetime">
        <template slot-scope="scope">
          {{ scope.row.releasetime | fmtDate }}
        </template>
      </el-table-column>
      <el-table-column label="金额" prop="price" width="80">
      </el-table-column>
      <el-table-column label="状态" width="90" prop="statu">
        <template slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.statu === 1" type="success">支付成功</el-tag>
          <el-tag size="mini" v-else-if="scope.row.statu === 0" type="danger">支付失败</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="电影结束时间" prop="endtime" width="200">
        <template slot-scope="scope">
          {{ scope.row.endtime | fmtDate }}
        </template>
      </el-table-column>
      <el-table-column label="支付时间" prop="created" width="200">
        <template slot-scope="scope">
          {{ scope.row.created | fmtDate }}
        </template>
      </el-table-column>

      <el-table-column label="操作" width="100px">
        <template slot-scope="scope">
          <el-popconfirm title="确认要删除该用户信息吗？" @confirm="deleteOrder(scope.row.id)">
            <el-button slot="reference" type="danger" v-if="hasAuth('sys:order:delete')">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- <el-pagination background layout="total, sizes, prev, pager, next, jumper" :total="total" :page-size="size"
        :page-sizes="[5, 10, 15, 20, 25]" :current-page="current">
    </el-pagination> -->


    <!-- 显示分页页码 -->
    <el-pagination background layout="total, sizes,prev, pager,next,jumper" :total="total" :page-size="size"
                   @size-change="handlerSizeChange" @current-change="handlerCurrentChange" :page-sizes="[5, 10, 15, 20, 25]"
                   :current-page="current">
    </el-pagination>
  </div>
</template>

<script>

export default {
  data() {
    return {
      deleteAllBtnStu: true,
      startTime: '',
      endTime: '',
      selection: [],
      tableData: [],
      total: 0,
      size: 5,
      current: 1,
      // deleteAllBtnStu: false,
      searchForm: {
        uid: '',
        ordername: '',
        id: '',
        endtime: '',
        created: '',
        statu: 1,
        username: '',
        price: '',
        name: '',
        seats: '',
        releasetime: '',
      },
      headers: {
        token: localStorage.getItem('token')
      },
    }
  },
  created() {
    this.loadOrderList()
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
  components: {
  },
  mounted() {
    this.loadOrderList()
  },
  methods: {
    handlerCurrentChange(val) {
      this.current = val
      this.loadOrderList();
    },
    handlerSizeChange(val) {
      this.size = val
      this.loadOrderList();
    },
    selectionChange(value) {
      this.selection = value;
      if (this.selection) {
        this.deleteAllBtnStu = (this.selection.length == 0)
      }
    },
    handleClose() {
      // this.resetForm('UserForm')
      this.OrderForm = {}
      this.dialogFormVisible = false
    },
    handleAvatarSuccess(response, file) {
      this.OrderForm.avatar = response.data
    },
    searchOrdersInfo() {
      //模糊查询
      this.loadOrderList();

    },
    deleteOrder(id) {
      let ids = []
      id ? ids.push(id) : this.selection.forEach(u => {
        ids.push(u.id)
      })
      this.$axios.post('/system/order/delete', ids).then(response => {
        this.$message({
          message: response.data.message,
          type: 'success',
          showClose: true,
          onClose: () => {
            this.loadOrderList()
          }
        })
      })

    },
    // //删除用户
    // deleteUser(id) {
    //     //单个用户进行删除和批量删除
    //     //只有一个id表示单个删除,如果id没有值，表示批量删除
    //     let ids = [];//要删除的一组数据的id
    //     id ? ids.push(id) : this.selection.forEach(u => {
    //         ids.push(u.id)
    //     })
    //     console.log(ids)
    //     //ids是要删除的id
    //     this.$axios.post('/system/user/delete', ids).then(response => {
    //         this.$message({
    //             message: response.data.message,
    //             type: "success",
    //             duration: 1200,
    //             onClose: () => {
    //                 this.loadUserList()
    //             }
    //         })
    //     })
    // },
    loadOrderList() {
      this.$axios.get('/system/order/list',
          {
            params: {
              username: this.searchForm.username,
              current: this.current,
              size: this.size
            }
          }
      ).then(repsonse => {
        //获得分页的用户信息
        this.tableData = repsonse.data.resultdata.records
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

    // loadOrderList() {
    //     this.$axios.get('/system/order/list', {
    //         current: this.current,
    //         size: this.size,
    //     }).then(response => {
    //         this.tableData = response.data.resultdata.records
    //         this.total = response.data.resultdata.total
    //         this.size = response.data.resultdata.size
    //         this.current = response.data.resultdata.current
    //     })
    // }
  }
}
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px solid #666;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
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

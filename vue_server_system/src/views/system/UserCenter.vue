<template>
  <el-container style="margin-top: 20px;">

    <el-header>
      <div>
        <el-row :gutter="20">
          <el-col :span="4" :offset="1">
            <div style="padding: 15px;">
              <i class="el-icon-user-solid" style="font-size:30px;">
                <div class="a1">人员</div>
                <div class="a2">people</div>
              </i>
              <el-statistic title="人数统计">
                <template slot="formatter"> 7</template>
              </el-statistic>
            </div>
          </el-col>

          <el-col :span="4" :offset="1">
            <div style="padding: 15px;">
              <i class="el-icon-video-camera-solid" style="font-size:30px;">
                <div class="a1">电影</div>
                <div class="a2">movie</div>
              </i>
              <el-statistic title="电影统计">
                <template slot="formatter"> 11</template>
              </el-statistic>
            </div>
          </el-col>

          <el-col :span="4" :offset="1">
            <div style="padding: 15px;">
              <i class="el-icon-coin" style="font-size:30px;">
                <div class="a1">消费</div>
                <div class="a2">consume</div>
              </i>
              <el-statistic title="消费统计">
                <template slot="formatter"> 3520</template>
              </el-statistic>
            </div>
          </el-col>

          <el-col :span="4" :offset="1">
            <div style="padding: 15px;">
              <i class="el-icon-files" style="font-size:30px;">
                <div class="a1">订单</div>
                <div class="a2">order</div>
              </i>
              <el-statistic title="订单统计">
                <template slot="formatter"> 28</template>
              </el-statistic>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-header>
    <el-main></el-main>
    <el-footer></el-footer>
  </el-container>
</template>

<script>
export default {}
</script>

<style scoped>
.i {
  font-size: 30px;
}

.el-col {
  box-shadow: 2px 2px 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
}

.el-statistic {
  position: relative;
  top: -30px;
  right: -30px;
}

.a1 {
  font-size: 10px;
  position: relative;
  top: -28px;
  right: -35px;
}

.a2 {
  font-size: 10px;
  position: relative;
  top: -26px;
  right: -35px;
  font-weight: 200;
}
</style>
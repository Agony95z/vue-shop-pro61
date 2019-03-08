<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card class="box-card">
      <!--搜索框 和 添加按钮-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入搜索内容"
            class="input-with-select"
            v-model="queryParams.query"
            :clearable="true"
            @clear="getGoodsInfos"
            @keyup.enter.native="getGoodsInfos"
          >
            <el-button slot="append" icon="el-icon-search" @click="getGoodsInfos"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!--数据列表展示区域-->
      <el-table :data="tableData3" border style="width: 100%" height="250">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column property="goods_name" label="商品名称"></el-table-column>
        <el-table-column property="goods_price" label="商品价格(元)" width="120"></el-table-column>
        <el-table-column property="goods_weight" label="商品重量(g)" width="120"></el-table-column>
        <el-table-column prop="add_time" :formatter="filter_m" label="创建时间" width="220"></el-table-column>
        <el-table-column label="操作" width="230">
          <template>
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryParams.pagenum"
        :page-size="queryParams.pagesize"
        :page-sizes="[3, 5, 10, 20]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getGoodsInfos()
  },
  data() {
    return {
      // 分页相关
      queryParams: {
        query: '',
        pagenum: 1, // 当前页码
        pagesize: 5 // 每页显示条数
      },
      // 后台商品数据接收
      tableData3: [],
      total: 0
    }
  },
  methods: {
    // 格式化时间
    filter_m(a, b, c, d) {
      var time = new Date(c)
      var year = time.getFullYear()
      var month = (time.getMonth() + 1 + '').padStart(2, 0)
      var day = (time.getDate() + '').padStart(2, 0)
      var hour = (time.getHours() + '').padStart(2, 0)
      var minute = (time.getMinutes() + '').padStart(2, 0)
      var second = (time.getSeconds() + '').padStart(2, 0)
      return `${year}-${month}-${day} ${hour}:${minute}:${second}`
    },
    // 添加商品相关
    goAddPage() {
      // 重定向到到goodsAdd路由
      this.$router.push('goodsadd')
    },
    // 获取首屏商品数据
    async getGoodsInfos() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryParams
      })
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.tableData3 = res.data.goods
      this.total = res.data.total
      // console.log(res)
    },
    // 每页信息条数变化回调函数处理
    handleSizeChange(val) {
      // console.log(val)
      this.queryParams.pagesize = val
      this.getGoodsInfos()
    },
    // 当前页码变化回调函数处理
    handleCurrentChange(val) {
      // console.log(val)
      this.queryParams.pagenum = val
      this.getGoodsInfos()
    }
  }
}
</script>

<style lang="less" scoped>
</style>

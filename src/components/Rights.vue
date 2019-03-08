<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card class="box-card">
      <!--数据列表展示区域-->
      <el-table :data="formRights" border style="width: 100%" height="250">
        <el-table-column type="index" label="序号" width="70"></el-table-column>
        <el-table-column property="authName" label="名称"></el-table-column>
        <el-table-column property="path" label="路径" width="120"></el-table-column>
        <el-table-column label="等级" width="130">
          <template slot-scope="info">
            <el-tag v-if="info.row.level==0">一级</el-tag>
            <el-tag v-else-if="info.row.level==1" type="success">二级</el-tag>
            <el-tag v-else type="danger">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getRightsInfo()
  },
  data() {
    return {
      formRights: []
    }
  },
  methods: {
    async getRightsInfo() {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.formRights = res.data
    }
  }
}
</script>

<style lang="less" scoped>
</style>

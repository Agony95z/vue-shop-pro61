<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card class="box-card">
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" :closable="false" show-icon></el-alert>
      <el-row>
        <el-col>
          <span>选择商品分类:</span>
          <el-cascader
            expand-trigger="hover"
            :options="catInfos"
            v-model="selectedCat"
            @change="handleChange"
            :props="cateInfosProps"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- 标签切换区 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="showButton">添加动态参数</el-button>
          <!-- 数据列表展示区域 -->
          <el-table :data="manyParamsInfos" border style="width: 100%" height="250">
            <el-table-column type="expand">
              <template slot-scope="info">
                <!-- 展示可宣传参数，这里key加上随机数为了确保key值是唯一的，方便diff -->
                <el-tag
                  v-for="item in info.row.attr_vals_arr"
                  :key="item+Math.random()"
                  closable
                  :disable-transitions="true"
                >{{item}}</el-tag>
                <!-- 添加可选值按钮 -->
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(info.row)"
                  @blur="handleInputConfirm(info.row)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column property="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作" width="230">
              <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态参数" name="only">
          <el-button type="primary" size="mini" :disabled="showButton">添加静态参数</el-button>
          <!-- 数据列表展示区域 -->
          <el-table :data="onlyParamsInfos" border style="width: 100%" height="250">
            <el-table-column type="expand">
              <template slot-scope="info">
                <!-- 展示可宣传参数，这里key加上随机数为了确保key值是唯一的，方便diff -->
                <el-tag
                  v-for="item in info.row.attr_vals_arr"
                  :key="item+Math.random()"
                  closable
                  :disable-transitions="true"
                >{{item}}</el-tag>
                <!-- 添加可选值按钮 -->
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm"
                  @blur="handleInputConfirm"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column property="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作" width="230">
              <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getCategoriesInfos()
  },
  data() {
    return {
      // 商品分类信息
      catInfos: [],
      // 级联选择器选中的分类信息
      selectedCat: [],
      // 级联选择器，信息属性设置，给各个节点设置值，名称，子集
      cateInfosProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 默认选中的tab标签
      activeName: 'many',
      // 开关默认禁用
      showButton: true,
      // 存储静态参数
      onlyParamsInfos: [],
      // 存储动态参数
      manyParamsInfos: [],
      // 存储第三级别组件的id值
      catThreeId: 0,
      // 按钮/输入框 显示 控制开关
      inputVisible: false,
      // 接收 输入框 输入的可选值信息
      inputValue: ''
    }
  },
  methods: {
    // 添加参数的input框的回车,失去焦点的回调处理
    // 形参data是info.row获取的数组中的每一项，是对象
    handleInputConfirm(data) {
      if (!this.inputValue.trim()) return
      data.attr_vals_arr.push(this.inputValue.trim())
      // 隐藏input显示button
      this.inputVisible = false
      this.inputValue = ''
    },
    // 添加 参数可选值 按钮被点击后触发回调
    showInput() {
      // 显示input隐藏button
      this.inputVisible = true
      // 给显示的input框设置获得焦点效果
      // $nextTick: 表示页面全部内容已经通过vue"渲染"完毕
      // (那么给页面input框设置focus事件就正合适)
      this.$nextTick(_ => {
        // 下述有调用了两次$refs,是固定语法
        // 表示要获得el-input组件内部的原始的input框元素
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    async getCategoriesInfos() {
      const { data: res } = await this.$http.get('categories', {
        params: {
          type: 3
        }
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.catInfos = res.data
    },
    // 级联选择器数据发生变化触发回调
    // 要求选择了第三级别分类才可以去获取静态和动态参数
    handleChange() {
      if (this.selectedCat.length !== 3) {
        // 重置级联选择器
        this.selectedCat = []
        this.showButton = true
        // 满足条件后手动清除级联选择器，之前成功显示的参数信息要手动清除
        this.manyParamsInfos = []
        this.onlyParamsInfos = []
        // 清空之前获取到的第三级别的id值
        this.catThreeId = 0
      } else {
        this.showButton = false
        // 把级联选择器变化捕获到的第三级别catThreeId的id赋值给作为id信息发送到后台
        this.catThreeId = this.selectedCat[2]
        // 调用参数信息函数
        this.getParamsInfos()
      }
    },
    // 切换tab标签的时候的回调
    handleClick() {
      // 如果第三级别分类id为空阻止往下调用方法显示
      if (!this.catThreeId) {
        return null
      }
      this.getParamsInfos()
    },
    // 获取参数列表方法
    async getParamsInfos() {
      const { data: res } = await this.$http.get(
        `categories/${this.catThreeId}/attributes`,
        {
          params: {
            sel: this.activeName
          }
        }
      )
      console.log(res)
      // 把动态参数和静态参数的可选值进行变形，由字符串变为数组
      res.data.forEach(element => {
        // res.data是个数组，数组中的每一项是一个对象，通过.的方式创建attr_vals_arr，并将字符串attr_vals通过分割成数组赋值给
        element.attr_vals_arr = element.attr_vals.split(' ')
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 将获取到的信息通过判断赋值给
      if (this.activeName === 'many') {
        this.manyParamsInfos = res.data
      }
      this.onlyParamsInfos = res.data
    }
  }
}
</script>

<style lang="less" scoped>
.el-row {
  margin-top: 15px;
}
.el-tag {
  margin: 5px;
}
// 给添加 参数可选值 的输入框设置样式
.input-new-tag {
  width: 100px;
}
</style>

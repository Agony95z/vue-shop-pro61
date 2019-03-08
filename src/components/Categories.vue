<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card class="box-card">
      <el-button type="primary" @click="addCategories">添加分类</el-button>
      <zk-table
        :data="categoriesInfos"
        :columns="categoriesColumns"
        :selection-type="false"
        :expand-type="false"
        show-index
      >
        <template slot="order" slot-scope="info">
          <el-tag v-if="info.row.cat_level==0">一级</el-tag>
          <el-tag v-else-if="info.row.cat_level==1" type="success">二级</el-tag>
          <el-tag v-else type="danger">三级</el-tag>
        </template>
        <template slot="operation" slot-scope="info">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="editCategories(info.row.cat_id)"
          >编辑</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="delCategories(info.row.cat_id)"
          >删除</el-button>
        </template>
      </zk-table>
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
      <!-- 添加分类dialog -->
      <!-- 添加用户的dialog弹窗-->
      <el-dialog
        title="添加分类"
        :visible.sync="CategoriesDialogVisible"
        @close="categoriesDialogClose"
        width="50%"
      >
        <el-form label-width="100px" :rules="cateFormRules" ref="cateFormRef" :model="addForm">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="分类上级">
            <el-cascader
              expand-trigger="hover"
              :options="catInfosTwo"
              v-model="selectedCat"
              @change="handleChange"
              :props="cateInfosProps"
              change-on-select
              clearable
            ></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="CategoriesDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCategoriesTo">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改分类的dialog -->
      <el-dialog
        title="修改分类"
        :visible.sync="editCategoriesDialogVisible"
        @close="editcategoriesDialogClose"
        width="50%"
      >
        <el-form
          label-width="100px"
          :rules="editcateFormRules"
          ref="editcateFormRef"
          :model="editForm"
        >
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="editForm.cat_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editCategoriesDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editCategoriesTo">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getCategories()
  },
  data() {
    return {
      categoriesColumns: [
        { label: '分类名称', prop: 'cat_name' },
        { label: '排序', type: 'template', template: 'order' },
        { label: '操作', type: 'template', template: 'operation' }
      ],
      // 存储查询到的分类信息
      categoriesInfos: [],
      queryParams: {
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      // 默认dialog关闭
      CategoriesDialogVisible: false,
      // 修改分类的dialog默认关闭
      editCategoriesDialogVisible: false,
      // 添加分类修改form表单时的验证规则
      cateFormRules: {
        cat_name: [{ required: true, message: '分类名称必填', trigger: 'blur' }]
      },
      // 修改时的验证规则
      editcateFormRules: {
        cat_name: [{ required: true, message: '分类名称必填', trigger: 'blur' }]
      },
      // 级联选择器相关成员
      catInfosTwo: [], // 第1/2级别分类信息(供选取使用)
      selectedCat: [], // 设定分类 后的接收变量
      // 给级联节点定义：值、名称、子级
      cateInfosProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 向后台提交新添加的分类信息要携带的数据
      addForm: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0
      },
      // 编辑分类时存储数据
      editForm: {}
    }
  },
  methods: {
    // 删除分类
    delCategories(id) {
      this.$confirm('确实删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const { data: res } = await this.$http.delete(`categories/${id}`)
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          // 判断当前页是否只有一条数据,若只有一条删除后页码--
          if (this.categoriesInfos.length === 1 && this.queryParams.pagenum > 1) {
            this.queryParams.pagenum--
          }
          this.getCategories()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 修改分类按钮打开获取分类数据展示到dialog里面
    async editCategories(id) {
      this.editCategoriesDialogVisible = true
      const { data: res } = await this.$http.get(`categories/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.editForm = res.data
    },
    // 添加分类按钮打开获取分类数据展示到dialog里面
    async addCategories() {
      this.CategoriesDialogVisible = true
      const { data: res } = await this.$http.get('categories', {
        params: {
          type: 2
        }
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.catInfosTwo = res.data
    },
    // 添加分类提交给后台
    addCategoriesTo() {
      this.$refs.cateFormRef.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.post(
            'categories',
            this.addForm
          )
          if (res.meta.status !== 201) {
            return this.message.error(res.meta.msg)
          }
          this.CategoriesDialogVisible = false
          this.$message.success(res.meta.msg)
          this.getCategories()
        }
      })
    },
    // 编辑分类提交到后台
    editCategoriesTo() {
      this.$refs.editcateFormRef.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.put(
            `categories/${this.editForm.cat_id}`,
            this.editForm
          )
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          this.$message.success(res.meta.msg)
          this.editCategoriesDialogVisible = false
          this.getCategories()
        }
      })
    },
    // 关闭添加分类
    categoriesDialogClose() {
      this.$refs.cateFormRef.resetFields()
      // 关闭dialog框重置级联选择器
      this.selectedCat = []
    },
    // 关闭编辑分类清空输入框
    editcategoriesDialogClose() {
      this.$refs.editcateFormRef.resetFields()
    },
    // 级联选择器变化时回调
    handleChange() {
      // console.log(this.selectedCat) // 自动获取你选中的分类的id，若选中一级分类，则显示一个id值在数组中，选择了二级分类，则显示两个id值在数组中
      // [] 没有选取分类
      // [102]  选取了1级别分类
      // [103,115] 选取了2级别分类
      if (this.selectedCat.length === 0) {
        // 没有选取上级，本身作为第一级别分类添加
        this.addForm.cat_pid = 0
        this.addForm.cat_level = 0
      } else {
        // 选取了第1级别或者第2级别分类
        var len = this.selectedCat.length
        this.addForm.cat_pid = this.selectedCat[len - 1]
        this.addForm.cat_level = len
      }
    },
    // 查询分类
    async getCategories() {
      const { data: res } = await this.$http.get('categories', {
        params: {
          type: 3,
          pagenum: this.queryParams.pagenum,
          pagesize: this.queryParams.pagesize
        }
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.categoriesInfos = res.data.result
      this.total = res.data.total
    },
    // 每页信息条数变化回调函数处理
    handleSizeChange(val) {
      // console.log(val)
      this.queryParams.pagesize = val
      this.getCategories()
    },
    // 当前页码变化回调函数处理
    handleCurrentChange(val) {
      // console.log(val)
      this.queryParams.pagenum = val
      this.getCategories()
    }
  }
}
</script>

<style lang="less" scoped>
.zk-table {
  margin-top: 15px;
}
</style>

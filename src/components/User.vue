<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
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
            @clear="getUserInfos"
            @keyup.enter.native="getUserInfos"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserInfos"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!--数据列表展示区域-->
      <el-table :data="tableData3" border style="width: 100%" height="250">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column property="username" label="用户名"></el-table-column>
        <el-table-column property="mobile" label="手机号码" width="120"></el-table-column>
        <el-table-column property="role_name" label="角色" width="120"></el-table-column>
        <el-table-column property="email" label="邮箱" width="120"></el-table-column>
        <el-table-column label="状态" width="70">
          <!-- 通过info接收数据 -->
          <el-switch
            slot-scope="info"
            v-model="info.row.mg_state"
            @change="changeState(info.row.id,info.row.mg_state)"
          ></el-switch>
        </el-table-column>
        <el-table-column label="操作" width="230">
          <template slot-scope="info">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(info.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delUser(info.row.id)"
            ></el-button>
            <el-tooltip :enterable="false" content="分配角色" placement="top-end">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
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
      <!-- 添加用户的dialog弹窗-->
      <el-dialog title="提示" :visible.sync="dialogVisible" @close="addDialogClose" width="50%">
        <span slot="footer" class="dialog-footer">
          <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="addForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="addForm.password" type="password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="addForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
              <el-input v-model="addForm.mobile"></el-input>
            </el-form-item>
          </el-form>
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改用户的弹窗 -->
      <el-dialog title="提示" :visible.sync="showDialogVisible" width="50%">
        <span slot="footer" class="dialog-footer">
          <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="editForm.username" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="editForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
              <el-input v-model="editForm.mobile"></el-input>
            </el-form-item>
          </el-form>
          <el-button @click="showDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUser">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getUserInfos()
  },
  data() {
    // 自定义校验器
    // var checkAge = (rule, value被检测数据, callback) => {}
    // 自己校验手机号
    var checkMobile = (rule, value, callback) => {
      // 校验手机号码规则：13/5/7/8后接9位数字(一共11位)
      // 正则对象.==test(字符串)== ; 用于检测字符串是否==匹配== 某个规则,返回true和false
      if (!/^1[35789]\d{9}$/.test(value)) {
        // 校验失败
        return callback(new Error('手机格式不正确'))
      }
      // 校验通过
      callback() // 继续执行
    }
    return {
      // 控制添加dialog是否弹出
      dialogVisible: false,
      // 控制修改的dialog是否弹出
      showDialogVisible: false,
      // dialog form数据表单部分
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 修改用户的form表单部分
      editForm: {
        username: '',
        email: '',
        mobile: ''
      },
      // 添加时form表单校验规则
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 修改时form表单验证规则
      editFormRules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 向后台发送携带数据
      queryParams: {
        query: '',
        pagenum: 1, // 当前页码
        pagesize: 3 // 每页显示条数
      },
      // 后台数据接收
      tableData3: [],
      total: 0
    }
  },
  methods: {
    // 修改用户时  用户信息展示
    async showEditDialog(id) {
      this.showDialogVisible = true
      // 根据id查询用户信息
      const { data: res } = await this.$http.get(`users/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.editForm = res.data
    },
    // 修改用户
    editUser() {
      this.$refs.editFormRef.validate(async value => {
        if (value) {
          const { data: res } = await this.$http.put(
            'users/' + this.editForm.id,
            this.editForm
          )
          console.log(res)
          if (res.meta.status !== 200) {
            this.$message.error(res.meta.msg)
          }
          // 关闭 dialog 窗口
          this.showDialogVisible = false
          this.$message.success(res.meta.msg)
          this.getUserInfos()
        }
      })
    },
    // 删除用户
    delUser(id) {
      this.$confirm('此操作将删除该会员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const { data: res } = await this.$http.delete(`users/${id}`)
          console.log(res)
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 添加用户
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.post('users', this.addForm)
          if (res.meta.status !== 201) {
            return this.$message.error('添加用户失败')
          }
          // 关闭dialog
          this.dialogVisible = false
          // 提示添加成功
          this.$message.success(res.meta.msg)
          // 重新加载页面
          this.getUserInfos()
        }
      })
    },
    // 添加用户时关闭dialog的时候清空输入框
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    // 获取首屏用户数据
    async getUserInfos() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryParams
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.tableData3 = res.data.users
      this.total = res.data.total
      // console.log(res)
    },
    // 每页信息条数变化回调函数处理
    handleSizeChange(val) {
      // console.log(val)
      this.queryParams.pagesize = val
      this.getUserInfos()
    },
    // 当前页码变化回调函数处理
    handleCurrentChange(val) {
      // console.log(val)
      this.queryParams.pagenum = val
      this.getUserInfos()
    },
    // 修改用户状态
    async changeState(id, state) {
      const { data: res } = await this.$http.put(`users/${id}/state/${state}`)
      if (res.meta.status !== 200) {
        return this.$message.error('修改用户状态失败')
      }
      this.$message({
        message: '修改状态成功',
        type: 'success',
        duration: 1500
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>

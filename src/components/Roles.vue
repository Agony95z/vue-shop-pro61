<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card class="box-card">
      <!--添加按钮展示区-->
      <el-button type="primary" @click="addRolesDialogVisible = true">添加角色</el-button>
      <!--数据列表展示区域-->
      <el-table :data="roleInfos" border style="width: 100%" height="250">
        <el-table-column type="expand" width="50">
          <template slot-scope="info">
            <el-row
              v-for="(item,k) in info.row.children"
              :key="item.id"
              :style="{'borderBottom':'1px solid #EBEEF5','borderTop':k===0?'1px solid #EBEEF5':''}"
            >
              <el-col :span="6">
                <el-tag closable @close="closeTag(info.row.id,item.id)">{{item.authName}}</el-tag>
              </el-col>
              <el-col :span="18">
                <el-row
                  v-for="(item2,kk) in item.children"
                  :key="item2.id"
                  :style="{'border-top':kk!==0?'1px solid #EBEEF5' : ''}"
                >
                  <el-col :span="8">
                    <el-tag
                      closable
                      type="success"
                      @close="closeTag(info.row.id,item2.id)"
                    >{{item2.authName}}</el-tag>
                  </el-col>
                  <el-col>
                    <el-tag
                      closable
                      type="warning"
                      @close="closeTag(info.row.id,item3.id)"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column property="roleName" label="名称"></el-table-column>
        <el-table-column property="roleDesc" label="角色描述" width="120"></el-table-column>
        <el-table-column label="操作" width="330">
          <template slot-scope="info">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(info.row.id)"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delRole(info.row.id)"
            >删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showDistributionRoles(info.row)"
            >分配角色</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加用户弹出dialog -->
      <el-dialog title="添加角色" :visible.sync="addRolesDialogVisible" width="30%">
        <el-form
          label-width="80px"
          :model="addForm"
          :rules="addRules"
          ref="addRuleFormRef"
          @close="addDialogClose"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addRolesDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRolesForm">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑弹出的dialog -->
      <el-dialog title="编辑角色" :visible.sync="editRolesDialogVisible" width="30%">
        <el-form
          label-width="80px"
          :model="editForm"
          :rules="editRules"
          ref="editRuleFormRef"
          @close="editDialogClose"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editRolesDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editRolesForm">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 分配角色dialog弹窗 -->
      <el-dialog title="分配权限" :visible.sync="distributionRolesDialogVisible" width="50%">
        <el-form label-width="120px" :model="distributionRoles">
          <el-form-item label="角色名称：">{{distributionRoles.roleName}}</el-form-item>
          <el-form-item label="供分配权限">
            <el-tree
              :data="roleTree"
              show-checkbox
              default-expand-all
              node-key="id"
              ref="distributionTree"
              highlight-current
              :props="roleTreeProps"
              :default-checked-keys="defaultChecckedKeys"
            ></el-tree>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="distributionRolesDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="distributionRolesForm">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getRolesInfos()
  },
  data() {
    return {
      roleInfos: [],
      // 添加角色dialog默认关闭
      addRolesDialogVisible: false,
      // 编辑的dialog
      editRolesDialogVisible: false,
      // 添加的dialog
      distributionRolesDialogVisible: false,
      // 存储 添加用户的的Form表单
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      // 编辑用户的 form表单
      editForm: {
        roleName: '',
        roleDesc: ''
      },
      // 查询到的角色信息 用于显示角色名称
      distributionRoles: {
        roleName: '', // 用于显示角色名称
        id: 0 // 当前分配角色的id供后期使用
      },
      // 接收tree型结构的数据
      roleTree: [],
      roleTreeProps: {
        label: 'authName',
        children: 'children'
      },
      // 树形结构默认勾选的节点的 key 的数组
      defaultChecckedKeys: [],
      // 添加校验规则
      addRules: {
        roleName: [
          { required: true, message: '角色名称必填', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '角色描述必填', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
        ]
      },
      editRules: {
        roleName: [
          { required: true, message: '角色名称必填', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '角色描述必填', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 添加 关闭dialog的时候清空
    addDialogClose() {
      this.$refs.addRuleFormRef.resetFields()
    },
    // 修改 关闭dialog 清空
    editDialogClose() {
      this.$refs.editRuleFormRef.resetFields()
    },
    // 删除用户对应的权限
    closeTag(userId, rightsId) {
      this.$confirm('此操作将永久删除该成员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const { data: res } = await this.$http.delete(
            `roles/${userId}/rights/${rightsId}`
          )
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          this.getRolesInfos()
          this.$message.success(res.meta.msg)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 分配角色时展示dialog
    async showDistributionRoles(role) {
      this.distributionRolesDialogVisible = true
      // 将查询获得的role信息 赋值给
      // console.log(role)
      this.distributionRoles = role
      // 获取可供选择的tree型权限信息
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.roleTree = res.data
      // 从role中，把当前角色拥有的权限(第三级别的权限的id)给获取出来
      // default-checked-keys默认勾选的节点的key的数组，类型为array
      var idArr = []
      this.getHaveRights(role, idArr)
      // console.log(idArr)
      this.defaultChecckedKeys = idArr
    },
    getHaveRights(node, keys) {
      if (!node.children) {
        return keys.push(node.id)
      }
      node.children.forEach(item => {
        return this.getHaveRights(item, keys)
      })
    },
    // 分配权限修改提交到后台
    async distributionRolesForm() {
      // :roleId角色ID,不能为空携带在url中
      // rids,权限 ID 列表（字符串）以 , 分割的权限 ID 列表（获取所有被选中、叶子节点的key和半选中节点的key, 包括 1，2，3级节点）
      // 上述为后台api接口要求提供的数据格式
      // 获得“全选”的节点的id信息，数组返回
      var ids1 = this.$refs.distributionTree.getCheckedKeys()
      // 获得“半选”的节点的id信息
      var ids2 = this.$refs.distributionTree.getHalfCheckedKeys()
      // console.log(ids1, ids2)
      // 把两个数组拼接成一个字符串
      var allIds = [...ids1, ...ids2].join(',')
      // console.log(allIds) // 05,116,101,104
      if (!allIds) {
        return this.$message.error('请至少选择一个权限')
      }
      const { data: res } = await this.$http.post(
        `roles/${this.distributionRoles.id}/rights`,
        {
          rids: allIds
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.getRolesInfos()
      this.distributionRolesDialogVisible = false
    },
    // 编辑时展示dialog
    async showEditDialog(id) {
      this.editRolesDialogVisible = true
      // 获得被修改的数据信息
      const { data: res } = await this.$http.get(`roles/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // console.log(res)
      this.editForm = res.data
    },
    // 删除用户
    delRole(id) {
      this.$confirm('此操作将永久删除该成员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const { data: res } = await this.$http.delete(`roles/${id}`)
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          this.getRolesInfos()
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
    // 修改角色提交到后台
    editRolesForm() {
      this.$refs.editRuleFormRef.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.put(
            `roles/${this.editForm.roleId}`,
            this.editForm
          )
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          this.$message.success(res.meta.msg)
          this.editRolesDialogVisible = false
          this.getRolesInfos()
        }
      })
    },
    // 添加角色提交到后台
    addRolesForm() {
      this.$refs.addRuleFormRef.validate(async value => {
        if (value) {
          const { data: res } = await this.$http.post('roles', this.addForm)
          if (res.meta.status !== 201) {
            return this.$message.error(this.meta.msg)
          }
          this.addRolesDialogVisible = false
          this.getRolesInfos()
          // 为啥数据不显示 而是显示后台的提示内容
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1000
          })
        }
      })
    },
    // 获取角色名称
    async getRolesInfos() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.roleInfos = res.data
      // console.log(this.roleInfos)
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 5px;
}
.el-row {
  display: flex;
  align-items: center;
}
</style>

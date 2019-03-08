<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card class="box-card">
      <el-alert title="消息提示的文案" type="info" center show-icon></el-alert>
      <el-steps :active="activeStep-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-tabs v-model="activeStep" tab-position="left">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">商品参数</el-tab-pane>
          <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              class="upload-demo"
              :action="uploadUrl"
              list-type="picture"
              :headers="uploadParams"
              :on-success="uploadSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce" ref="myQuillEditor"></quill-editor>
          </el-tab-pane>
          <el-button type="primary" style="marginTop:20px" @click="addGoods">添 加</el-button>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'
export default {
  components: {
    quillEditor
  },
  data() {
    return {
      // 图片上传 服务器端api地址设置
      uploadUrl: 'http://127.0.0.1:8765/api/private/v1/upload',
      // 图片上传，请求头信息的设置
      uploadParams: { Authorization: window.sessionStorage.getItem('token') },
      activeStep: '0',
      addForm: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        // 后台要求传图片的时候携带的信息
        pics: [],
        goods_introduce: '',
        goods_cat: '1,2,3'
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [{ required: true, message: '价格必填', trigger: 'blur' }],
        goods_weight: [
          { required: true, message: '重量必填', trigger: 'blur' }
        ],
        goods_number: [{ required: true, message: '数量必填', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 添加商品到后台
    async addGoods() {
      // console.log(this.addForm)
      const { data: res } = await this.$http.post('goods', this.addForm)
      if (res.meta.status !== 201) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.$router.push('goods')
    },
    // 图片上传成功的回调
    // 上传成功后，res会携带上传成功的信息
    uploadSuccess(res) {
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 上传成功，根据后台api要求，把res中的图片的tmp_path包装成一个对象放到pics数组中
      var obj = { pic: res.data.tmp_path }
      this.addForm.pics.push(obj)
    }
  }
}
</script>

<style lang="less" scoped>
.el-steps {
  margin-top: 15px;
}
.el-tabs {
  margin-top: 20px;
}
</style>

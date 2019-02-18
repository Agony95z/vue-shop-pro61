<template>
  <el-container>
    <el-header>
      <div id="logo-box">
        <img src="../assets/img/heima.png" alt>
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="menushow?'65px':'200px'">
        <div id="control" @click="menushow=!menushow">|||</div>
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#409EFF"
          :collapse-transition="false"
          :collapse="menushow"
          :unique-opened="true"
          :router="true"
        >
          <el-submenu :index="item.id+''" v-for="(item,k) in menuList" :key="item.id"
          :style="menushow?'width:65px;':'width:200px'"
          >
            <template slot="title">
              <i :class="'iconfont icon-'+menuicon[k]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item v-for="item2 in item.children" :key="item2.id" :index="item2.path">
              <i class="el-icon-menu"></i>
                <span>{{item2.authName}}</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created() {
    this.getMenuList()
  },
  data() {
    return {
      menushow: false,
      menuList: [],
      menuicon: ['users', 'tijikongjian', 'shangpin', 'danju', 'baobiao'] // 左侧权限图标
    }
  },
  methods: {
    logout() {
      // 退出功能
      // 先确认是否退出
      this.$confirm('是否确认退出?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 确认退出 移除token 重定向到 login
          window.sessionStorage.removeItem('token')
          this.$router.push('/login')
        })
        .catch(() => {})
    },
    // 获取左侧功能按钮数据
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 把获得的数据给menuList
      this.menuList = res.data
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
  .el-header {
    background-color: rgb(55, 61, 65);
    padding: 0;
    padding-right: 20px;
    // 弹性布局
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  #logo-box {
    font-size: 22px;
    color: #fff;
    display: flex;
    align-items: center;
    // 禁止用户赋值
    user-select: none;
    img {
      width: 50px;
      height: 50px;
      margin-right: 10px;
    }
  }
  .el-aside {
    background-color: #333744;
    #control {
      height: 25px;
      color: #fff;
      text-align: center;
      line-height: 25px;
      background-color: rgb(74, 80, 100);
      font-size: 12px;
      letter-spacing: 0.1em;
      cursor: pointer;
      user-select: none;
    }
  }
  .el-main {
    background-color: #eaedf1;
  }
}
</style>

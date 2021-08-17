<template>
  <el-container class="home_container">
    <!-- 头部 -->
    <el-header>
      <div class="header_title">
        <img src="../assets/logo.jpg" alt="" />
        <span>包谷地电商系统</span>
      </div>
      <div class="header_btns">
        <el-button type="primry" @click="loginOut">退出</el-button>
      </div>
    </el-header>
    <el-container>
      <!-- 左边导航栏 -->
      <el-aside :width="isshow ? '64px' : '200px'">
        <!-- 左边菜单折叠 -->
        <div
          style="color:#fff;background:rgb(74,80,100); 
          text-align: center;cursor:pointer"
          @click="isshow = !isshow"
        >
          |||
        </div>

        <el-menu
          :default-active="activepath"
          class="el-menu-vertical-demo"
          background-color="rgb(55, 61, 65)"
          active-text-color="#409EFF"
          :router="true"
          :unique-opened="true"
          :collapse="isshow"
          :collapse-transition="false"
        >
          <!-- 一级导航 -->
          <el-submenu :index="item.id + ''" v-for="item in list" :key="item.id">
            <template slot="title">
              <i :class="icon[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级导航 -->
            <el-menu-item
              :index="'/' + item2.path"
              v-for="item2 in item.children"
              :key="item2.id"
              @click="changepath('/' + item2.path)"
            >
              <i class="el-icon-menu"></i>
              <span slot="title">{{ item2.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 内容区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      list: [],
      // icon图标
      icon: {
        "125": "iconfont icon-user",
        "103": "iconfont icon-shangpin",
        "101": "iconfont icon-danju",
        "102": "iconfont icon-tijikongjian",
        "145": "iconfont icon-baobiao",
      },
      activepath: "",
      isshow: false,
    };
  },
  mounted() {
    this.getlist();
    this.activepath = window.localStorage.getItem("path");
  },
  methods: {
    // 点击跳转
    changepath(path) {
      // 保存当前激活项
      window.localStorage.setItem("path", path);
      this.activepath = path;
    },
    getlist() {
      this.$axios.get("menus").then((res) => {
        if (res.data.meta.status !== 200) {
          this.$messge.error("请求导航栏失败");
        }
        this.list = res.data.data;
      });
    },
    loginOut() {
      window.sessionStorage.removeItem("token");
      this.$router.push("/");
    },
  },
};
</script>
<style lang="less" scoped>
.home_container {
  height: 100%;
}
.el-header {
  background-color: rgb(55, 61, 65);
  display: flex;
  justify-content: space-between;
  .header_title {
    line-height: 60px;
    color: gray;
    font-size: 16px;
    img {
      width: 80px;
      height: 60px;
      vertical-align: middle;
      margin-right: 20px;
    }
  }
  .header_btns {
    margin-top: 10px;
  }
}
.el-aside {
  background-color: rgb(51, 55, 68);
  span {
    color: white;
  }
}
.el-main {
  background-color: rgb(234, 237, 241);
}
</style>

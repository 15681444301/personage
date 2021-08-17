<template>
  <div>
    <div class="bg"><img src="../assets/img/bg.jpg" alt="" /></div>
    <div class="login_context">
      <!-- from 表单验证 -->
      <div class="login_context_input">
        <el-form
          :model="loginfrom"
          :rules="loginfromRul"
          ref="loginfromRel"
          label-width="60px"
        >
          <el-form-item label="账号" prop="username">
            <el-input
              prefix-icon="el-icon-user"
              v-model="loginfrom.username"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              prefix-icon="el-icon-lock"
              type="password"
              v-model="loginfrom.password"
            ></el-input>
          </el-form-item>
          <el-form-item class="login_context_btns">
            <el-button @click="login">登录</el-button>
            <el-button>重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginfrom: {
        username: "",
        password: "",
      },
      // 表单验证规则
      loginfromRul: {
        username: [
          { required: true, message: "请输入账号", trigger: "blur" },
          {
            min: 5,
            max: 10,
            message: "长度在 5 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 5,
            max: 15,
            message: "长度在 5 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    // 登录
    login() {
      // 登录前先表单验证
      this.$refs.loginfromRel.validate((vaild) => {
        if (!vaild) return;
        this.$axios.post("login", this.loginfrom).then((res) => {
          // console.log(res);
          // 判断登录成功或失败
          if (res.data.meta.status !== 200) {
            return this.$message.error("登陆失败");
          }
          this.$message.success("登录成功");
          // 保存当前token
          window.sessionStorage.setItem("token", res.data.data.token);
          // 登录成功跳转首页
          this.$router.push("/home");
        });
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login_context {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 200px;
  .login_context_input {
    margin-top: 10px;
  }
  .btns_left {
    margin-left: 150px;
  }
  .login_context_btns {
    display: flex;
    justify-content: flex-end;
  }
}
.bg {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}
</style>

<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 搜索 -->
      <el-row :gutter="15">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            class="input-with-select"
            clearable
            @clear="getDeta"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getDeta"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button @click="addUsersVisivle = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 渲染表格 -->

      <el-table :data="list">
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="create_time" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="changeStatus(scope.row.id, $event)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editUser(scope.row)"
            ></el-button>

            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="showRoles(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUseritem(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="SizeChange"
        @current-change="CurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[4, 8]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加用户-- -->
    <el-dialog
      title="添加用户"
      :visible.sync="addUsersVisivle"
      width="50%"
      @close="closeaddUserDialog"
    >
      <!-- 表达提交 -->
      <el-form
        :v-model="addUserForm"
        ref="addUserFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部提交 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUsersVisivle = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editUsersVisivle"
      width="50%"
      @close="closeaddUserDialog"
    >
      <!-- 表达提交 -->
      <el-form
        :v-model="editUserParms"
        ref="editUserParmsRel"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名">
          <el-input v-model="editUserParms.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="editUserParms.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input v-model="editUserParms.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部提交 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editUsersVisivle = false">取 消</el-button>
        <el-button type="primary" @click="editUserList">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色 -->
    <el-dialog :visible.sync="RolesDialogVisible" width="50%">
      <p>当前用户:{{ userInfo.username }}</p>
      <p>当前的角色:{{ userInfo.role_name }}</p>
      <p>
        分配的角色:
        <el-select v-model="roleid" placeholder="请选择">
          <el-option
            v-for="item in RolesList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="RolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRoles">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      inputvalue: "",
      //   请求参数
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 4,
      },
      list: [],
      //   当前数据总数
      total: 0,
      //   添加用户点击按钮显示隐藏
      addUsersVisivle: false,
      //   添加用户
      addUserForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      //   存储修改信息
      editUserParms: {
        email: "",
        mobile: "",
        username: "",
        id: "",
      },
      editUsersVisivle: false,
      // 分配角色对话框显示和隐藏
      RolesDialogVisible: false,
      // 点击分配角色按钮先保存当前用户信息
      userInfo: {},
      // 保存所有的角色信息
      RolesList: [],
      // 选中当前select选框中的角色ID
      roleid: "",
    };
  },
  mounted() {
    this.getDeta();
  },
  methods: {
    // 点击确认按钮发送请求设置角色
    setRoles() {
      this.$axios
        .put(`users/${this.userInfo.id}/role`, { rid: this.roleid })
        .then((res) => {
          console.log(res);
          if (res.data.data.meta !== 200) {
            return;
          }
          this.getDeta();
        });
      this.RolesDialogVisible = !this.RolesDialogVisible;
    },
    // 点弹出分配角色loa对话框
    showRoles(row) {
      // 点击分配角色按钮先保存当前用户信息
      this.userInfo = row;
      console.log(row);
      // 发送后台请求获取所有角色
      this.$axios.get(`roles`).then((res) => {
        console.log(res);
        this.RolesList = res.data.data;
      });
      this.RolesDialogVisible = !this.RolesDialogVisible;
    },
    // 删除用户
    removeUseritem(row) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 点击确定，发送后台请求,删除该用户
          this.$axios.delete(`users/${row.id}`).then((res) => {
            console.log(res);
            if (res.data.meta.status !== 200) {
              return this.$message.error("删除用户失败");
            }
          });
          this.$message.success("删除用户成功");
          this.getDeta();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //   点击确定发送修改信息
    editUserList() {
      this.$axios
        .put(`users/${this.editUserParms.id}`, this.editUserParms)
        .then((res) => {
          console.log(res);
          this.$message.success("修改成功");
          this.getDeta();
        });
    },
    //   编辑用户
    editUser(row) {
      // 根据用户ID获取当前用户信息
      this.$axios.get(`users/${row.id}`).then((res) => {
        console.log(res);
        this.editUserParms.email = res.data.data.email;
        this.editUserParms.mobile = res.data.data.mobile;
        this.editUserParms.username = res.data.data.username;
        this.editUserParms.id = res.data.data.id;
        this.editUsersVisivle = !this.editUsersVisivle;
        // 存储获取信息
      });
    },
    //   关闭对话成功后数据清空
    closeaddUserDialog() {
      this.$refs.addUserFormRef.resetFields();
    },
    addUser() {
      this.$axios.post("users", this.addUserForm).then((res) => {
        // console.log(res);
        this.addUsersVisivle = !this.addUsersVisivle;
        this.$message.success("创建成功");
        this.getDeta();
      });
    },
    changeStatus(id, status) {
      //   当前status状态
      //   console.log(id);
      this.$axios.put(`users/${id}/state/${status}`).then((res) => {
        if (res.data.meta.status !== 200) {
          //   status=!status
          return this.$message.error("请求用户列表失败");
        }
        this.getDeta();
        console.log(res);
      });
    },
    //   每页数据条数发生改变时候触发
    SizeChange(newsize) {
      this.queryInfo.pagesize = newsize;
      this.getDeta();
    },
    // 当前页码发生改变
    CurrentChange(newnum) {
      this.queryInfo.pagenum = newnum;
      this.getDeta();
    },
    //   获取数据
    getDeta() {
      this.$axios.get("users", { params: this.queryInfo }).then((res) => {
        console.log(res);
        if (res.data.meta.status !== 200) {
          return this.$message.error("请求用户列表失败");
        }
        this.list = res.data.data.users;
        this.total = res.data.data.total;
      });
    },
    searchVal() {},
  },
};
</script>

<style lang="less" scoped>
.el-card {
  margin-top: 20px;
}
</style>

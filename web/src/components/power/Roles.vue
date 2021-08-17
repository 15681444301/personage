<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 角色 -->
    <el-card>
      <el-table :data="roleslist" style="width:100%" class="botter-bd">
        <el-table-column type="expand" width="180">
          <template slot-scope="scope">
            <el-row
              v-for="item in scope.row.children"
              :key="item.id"
              class="botter-bd"
            >
              <!-- 一级权限 -->
              <el-col :span="10">
                <el-tag closable>{{ item.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级权限三级权限 -->
              <el-col :span="14">
                <!-- 循环二级 -->
                <el-row
                  v-for="item1 in item.children"
                  :key="item1.id"
                  class="botter-bd"
                >
                  <el-col>
                    <el-tag closable type="success">{{
                      item1.authName
                    }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col>
                    <el-tag
                      closable
                      type="waring"
                      v-for="item2 in item1.children"
                      :key="item2.id"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column prop="level" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">
              编辑</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-delete"
              size="mini"
              @click="showRights(scope.row)"
            >
              分配权限</el-button
            >
            <el-button type="danger" icon="el-icon-setting" size="mini">
              删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="RightsdialogVisible"
      width="50%"
      @close="closeRightsdialog"
    >
      <!-- 对话框主体 -->
      <!-- :default-checked-keys 展示选中节点 -->
      <el-tree
        :data="rightslist"
        show-checkbox
        node-key="id"
        :default-checked-keys="showArr"
        :props="rightsProps"
        ref="treeRights"
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="RightsdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 角色列表
      roleslist: [],
      //   控制分配权限对话框
      RightsdialogVisible: false,
      //   存储权限
      rightslist: [],
      //   展示角色拥有的权限列表
      showArr: [],
      //  Props属性选项
      rightsProps: {
        label: "authName",
        children: "children",
      },
      //   保存角色ID
      RoleId: "",
    };
  },
  mounted() {
    this.getRoleslist();
  },
  methods: {
    //   点击确认按钮、发送后台数据,分配权限
    setRights() {
      // 1获取所有的节点id和半选id,合并直一个数组
      let arrCheAll = [
        ...this.$refs.treeRights.getCheckedKeys(),
        ...this.$refs.treeRights.getHalfCheckedKeys(),
      ].join(",");

      //   console.log(arrCheAll);
      this.$axios
        .post(`roles/${this.RoleId}/rights`, { rids: arrCheAll })
        .then((res) => {
          console.log(res);
          if (res.data.meta.status !== 200) {
            return;
          }
          this.getRoleslist();
        });
      //   console.log("全选", this.$refs.treeRights.getCheckedKeys());
      //   console.log("半选", this.$refs.treeRights.getHalfCheckedKeys());
      this.RightsdialogVisible = !this.RightsdialogVisible;
    },
    //    点击分配权限按钮,弹出dialog 对话框
    showRights(role) {
      // 保存角色ID
      this.RoleId = role.id;
      this.$axios.get(`rights/tree`).then((res) => {
        // console.log(res);
        this.rightslist = res.data.data;
      });
      //  把获取的权限用递归方法推送树形展示到dilog对话框
      //   console.log(rloe);
      this.getCheked(role, this.showArr);
      console.log(this.showArr);
      // 展示dilog对话框
      this.RightsdialogVisible = !this.RightsdialogVisible;
    },
    // 获取角色列表
    getRoleslist() {
      this.$axios.get(`roles`).then((res) => {
        // console.log(res);
        this.roleslist = res.data.data;
      });
    },
    getCheked(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => this.getCheked(item, arr));
    },
    // 关闭分配权限的dialog对话框,上一次存放节点的ID清空
    closeRightsdialog() {
      this.showArr = [];
    },
  },
};
</script>

<style lang="less" socped>
.botter-bd {
  border-bottom: 1px solid #ddd;
}
.el-row {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}
</style>

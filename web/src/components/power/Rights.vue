<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table :data="rightslist" style="width:100%">
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="authName" label="权限名称"> </el-table-column>
        <el-table-column prop="path" label="路程"> </el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level == '0'"> 一级</el-tag>
            <el-tag v-if="scope.row.level == '1'" type="success">二级</el-tag>
            <el-tag v-if="scope.row.level == '2'" type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 当前列表数据
      rightslist: [],
    };
  },
  mounted() {
    this.getRightslist();
  },
  methods: {
    // 获取权限列表
    getRightslist() {
      this.$axios.get(`rights/list`).then((res) => {
        console.log(res);
        this.rightslist = res.data.data;
      });
    },
  },
};
</script>

<style lang="less" scoped>
.el-card {
  margin-top: 10px;
}
</style>

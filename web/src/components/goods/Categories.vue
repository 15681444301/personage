<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 商品 -->
    <el-card>
      <el-row>
        <el-button type="primary">添加</el-button>
      </el-row>
      <tree
        :data="CategoryList"
        :columns="columns"
        show-header
        show-index
        index-text="#"
        :selection-type="false"
        :expand-type="false"
        border
      >
        <template slot="effect" slot-scope="scope">
          <i
            class="el-icon-success"
            style="color:lightgreen"
            v-if="scope.row.cat_deleted == false"
          ></i>
          <i class="el-icon-error" style="color:red" v-else></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level == 0">一级</el-tag>
          <el-tag v-if="scope.row.cat_level == 1" type="success">二级</el-tag>
          <el-tag v-if="scope.row.cat_level == 2" type="warning">三级</el-tag>
        </template>
        <template slot="operation">
          <el-button type="primary" icon="el-icon-edit" size="mini"
            >编辑</el-button
          >
          <el-button type="danger" icon="el-icon-delete" size="mini"
            >删除</el-button
          >
        </template>
      </tree>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      CategoryList: [],
      //   绑定各列数据
      columns: [
        { label: "分类名称", prop: "cat_name" },
        { label: "是否有效", prop: "", type: "template", template: "effect" },
        { label: "等级", prop: "", type: "template", template: "order" },
        { label: "操作", prop: "", type: "template", template: "operation" },
      ],
    };
  },
  mounted() {
    this.getCategoryList();
  },
  methods: {
    getCategoryList() {
      this.$axios.get("categories").then((res) => {
        console.log(res);
        this.CategoryList = res.data.data;
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

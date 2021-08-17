<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        title="注意:只允许为第三级分类设置相关参数"
        type="warning"
        show-icon
      >
      </el-alert>
      <p>
        选择商品分类
        <el-cascader
          v-model="value"
          :options="CategotyList"
          :props="cateprops"
          @change="handleChange"
        >
        </el-cascader>
      </p>
      <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 渲染动态数据 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary">添加参数</el-button>
          <br />
          <el-table :data="manyArr" border style="width: 100%">
            <el-table-column type="expand" width="180"> </el-table-column>
            <el-table-column type="index" width="180"> </el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <template>
                <el-button type="primary" icon="el-icon-edit" size="mini"
                  >编辑</el-button
                >
                <el-button type="danger" icon="el-icon-delete" size="mini"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态参数" name="only">
          <el-button type="primary">添加参数</el-button>
          <br />
          <el-table :data="onlyArr" border style="width: 100%">
            <el-table-column type="expand" width="180"> </el-table-column>
            <el-table-column type="index" width="180"> </el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <template>
                <el-button type="primary" icon="el-icon-edit" size="mini"
                  >编辑</el-button
                >
                <el-button type="danger" icon="el-icon-delete" size="mini"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      CategotyList: [],
      cateprops: {
        expandTrigger: "hover",
        label: "cat_name",
        value: "cat_id",
        children: "children",
      },
      //   当前选中分类的ID列表
      value: [],
      activeName: "many",
      //   存储动态参数
      manyArr: [],
      //   存储静态参数
      onlyArr: [],
    };
  },
  mounted() {
    this.getCategotyList();
  },
  methods: {
    getCategotyList() {
      this.$axios.get("categories").then((res) => {
        console.log(res);
        this.CategotyList = res.data.data;
      });
    },
    handleChange() {
      //   选择分类列表
      //  console.log(this.value);
      this.$axios
        .get(`categories/${this.value[this.value.length - 1]}/attributes`, {
          params: { sel: this.activeName },
        })
        .then((res) => {
          if (this.activeName == "many") {
            this.manyArr = res.data.data;
          } else if (this.activeName == "only") {
            this.onlyArr = res.data.data;
          }
          console.log(res);
        });
    },
    // 切换tabs栏,改变activename
    handleClick() {
      this.handleChange();
    },
  },
};
</script>

<style lang="less" scoped>
.el-card {
  margin-top: 10px;
}
</style>

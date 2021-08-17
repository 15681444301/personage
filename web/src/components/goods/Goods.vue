<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索 -->
    <el-card>
      <!-- 搜索 -->
      <el-row :gutter="10">
        <el-col :span="8">
          <el-input
            v-model="queryInfo.query"
            placeholder="请输入内容"
            class="input-with-select"
            clearable
            @clear="getgoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getgoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button>添加商品</el-button>
        </el-col>
      </el-row>
      <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->
      <el-table :data="goodsList">
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column prop="goods_price" label="商品价格"> </el-table-column>
        <el-table-column prop="goods_weight" label="商品数量">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.add_time | getTime() }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
          ></el-button>
        </el-table-column>
      </el-table>

      <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: "",
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      //   保存商品列表数据
      goodsList: [],
      total: 0,
    };
  },
  mounted() {
    this.getgoodsList();
  },
  methods: {
    //   当页面发生改变时触发
    handleCurrentChange(newnum) {
      this.queryInfo.pagenum = newnum;
      this.getgoodsList();
    },
    // 当前数据个数发生改变触发
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize;
      this.getgoodsList();
    },
    //   获取商品列表数据
    getgoodsList() {
      this.$axios.get(`goods`, { params: this.queryInfo }).then((res) => {
        console.log(res);
        this.goodsList = res.data.data.goods;
        this.total = res.data.data.total;
      });
    },
  },
  filters: {
    getTime(item) {},
  },
};
</script>

<style lang="less" scoped>
.el-card {
  margin-top: 10px;
}
</style>

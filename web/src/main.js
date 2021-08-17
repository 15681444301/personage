import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

// 导入elemnt
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

Vue.use(ElementUI);

//引入树形组件
import tree from "vue-table-with-tree-grid";
Vue.component("tree", tree);

// 导入全局样式
import "./assets/css/global.css";
import "./assets/fonts/iconfont.css";

// 导入Axios
import axios from "axios";
// 基本请求默认地址
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/";
// 请求拦截器
axios.interceptors.request.use((config) => {
  config.headers.Authorization = window.sessionStorage.getItem("token");
  return config;
});
Vue.prototype.$axios = axios;

//  全局getTime  过滤器
Vue.filter("getTime", function(time) {
  var datetime = new Date(item);
  var yy = datetime.getFullYear();
  var mm = (datetime.getMonth() + 1 + "").padStart(2, 0);
  var dd = (datetime.getDate() + "").padStart(2, 0);
  var hh = (datetime.getHours() + "").padStart(2, 0);
  var ff = (datetime.getMinutes() + "").padStart(2, 0);
  var ss = (datetime.getSeconds() + "").padStart(2, 0);
  return `${yy}-${mm}-${dd}-${hh}-${ff}-${ss}`;
});
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");

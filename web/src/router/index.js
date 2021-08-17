import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/Login";
import Home from "../views/Home";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/home",
    name: "Home",
    redirect: "welcome",
    component: Home,
    children: [
      {
        path: "/welcome",
        name: "Welcome",
        component: () => import("../components/Welcome.vue"),
      },
      {
        path: "/users",
        name: "User",
        component: () => import("../components/Users.vue"),
      },
      {
        path: "/rights",
        name: "Rights",
        component: () => import("../components/power/Rights.vue"),
      },
      {
        path: "/roles",
        name: "Roles",
        component: () => import("../components/power/Roles.vue"),
      },
      {
        path: "/categories",
        name: "Categories",
        component: () => import("../components/goods/Categories.vue"),
      },
      {
        path: "/Params",
        name: "Params",
        component: () => import("../components/goods/Params.vue"),
      },
      {
        path: "/goods",
        name: "Goods",
        component: () => import("../components/goods/Goods.vue"),
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

// 路由导航守卫
router.beforeEach((to, form, next) => {
  if (to.path == "/login") {
    next();
  } else {
    const token = window.sessionStorage.getItem("token");
    if (!token) {
      next("/login");
    } else {
      next();
    }
  }
});

export default router;

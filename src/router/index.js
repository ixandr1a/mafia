import Vue from "vue";
import VueRouter from "vue-router";

import Home from "../pages/Home.vue";
Vue.use(VueRouter);
const routes = [{
  path: "/",
  name: "Home",
  component: Home
},
];
const router = new VueRouter({
  mode: "history",
  routes
});

// router.beforeEach((to, from, next) => {
//   const token = Cookies.get("token");
//   const requireAuth = to.matched.some(record => record.meta.auth);
//   requireAuth && !token ? next("/login") : next();
// });

export default router;
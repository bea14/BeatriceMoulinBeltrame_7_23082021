import Vue from "vue";
import VueRouter from "vue-router";

import Home from "../views/Home.vue";
import signup from "../views/Signup.vue";
import login from "../views/Login.vue";
import posts from "../views/Posts.vue";
import createpost from "../views/CreatePost.vue";
import profile from "../views/Profile.vue";
import admin from "../views/Admin.vue";
import UpdatePost from "../views/UpdatePost.vue";
import UpdateComment from "../views/UpdateComment.vue";
import User from "../views/User.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    //component: () =>
    //import(/* webpackChunkName: "about" */ "../views/Home.vue"),
  },
  {
    path: "/Login",
    name: "Login",
    component: login,
  },
  {
    path: "/Signup",
    name: "Signup",
    component: signup,
  },
  {
    path: "/Posts",
    name: "Posts",
    component: posts,
  },
  /*{
    path: '/posts/:id',
    name: 'ViewPost',
    component: posts,
  },*/
  {
    path: '/Posts/:id',
    name: 'UpdatePost',
    component: UpdatePost,
  },  
  {
    path: '/Posts/:postId/Comments/:commentId',
    name: 'UpdateComment',
    component: UpdateComment,
  },
  {
    path: "/Profile/:userId",
    name: "Profile",
    component: profile,
  },
  {
    path: "/CreatePost",
    name: "Createpost",
    component: createpost,
  },
  {
    path: "/Admin",
    name: "Admin",
    component: admin,
  },
  {
    path: "/User/:userId",
    name: "User",
    component: User,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;

import Vue from 'vue';
import Router from 'vue-router';

import auth from "./auth/authService";

import Dashboard from "./views/Dashboard";
import Callback from './views/auth/Callback';
import Profile from "./views/Profile";

import PostsList from "./views/posts/List";
import PostForm from "./views/posts/Form";

import Error404 from "./views/errors/404";

Vue.use(Router);

const routes = [
    {
        path: "/",
        name: "dashboard",
        component: Dashboard
    },
    {
        path: '/callback',
        name: 'callback',
        component: Callback
    },
    {
        path: "/profile",
        name: "profile",
        component: Profile
    },
    {
        path: "/posts",
        name: "posts",
        component: PostsList
    },
    {
        path: "/posts/create",
        name: "posts.create",
        component: PostForm
    },
    {
        path: "/posts/:postId",
        name: "posts.edit",
        component: PostForm
    },
    { path: "*", component: Error404 }
];

const router = new Router({
    mode: 'history',
    routes
});

router.beforeEach((to, from, next) => {
    return next();
    if (to.path === "/" || to.path === "/callback" || auth.isAuthenticated()) {
    }

    // Specify the current path as the customState parameter, meaning it
    // will be returned to the application after auth
    auth.login({ target: to.path });
});

export default router;
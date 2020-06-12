import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: Login },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
    // to将要访问的路径
    // from从哪个路径跳转而来的
    // next()是一个函数表示放行,当传一个路由地址表示强制跳转到该页面
    if(to.path==='/login') return next();
    // 获取token
    const tokenStr = window.sessionStorage.getItem('token');
    if(!tokenStr) return next('/login');
    next();
})

export default router

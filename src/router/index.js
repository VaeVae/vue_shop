import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/users.vue'
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: Login },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children:[
      { path: '/welcome' , component: Welcome },
      { path: '/users' , component: Users },
    ]
  }
]

// 解决重复点菜单报错的问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

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

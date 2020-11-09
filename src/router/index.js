import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const login = ()=>import('../views/login/login.vue')
const Profile = ()=>import('../views/Profile/Profile.vue')
const register = ()=>import('../views/Register/Register.vue')
const settings = ()=>import('../views/Profile/menu/settings.vue')
const appointments = ()=>import('../views/Profile/menu/appointments.vue')
const mine = ()=>import('../views/Profile/menu/mine.vue')
const history = ()=>import('views/Profile/menu/history.vue')



//用于解决重复点击已活跃路由的报错
const originalPush = VueRouter.prototype.push
   VueRouter.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}

const routes = [
  {
    path:'',
    redirect: '/login'
  },
  {
    path: '/login',
    name:'login',
    component: login
  },
  {
    path: '/Profile',
    component:Profile,
    meta: { title:"我的" },
    children:[
      {
        path:'',
        redirect: 'mine'
      },
      {
        path:'settings',
        name:'settings',
        component:settings,
        meta: { title:"个人设置" }
      },
      {
        path:'history',
        name:'history',
        component:history,
        meta: { title:"历史预约" }
      },
      {
        path:'appointments',
        name:'appointments',
        component:appointments,
        meta: { title:"用户预约" }
      },
      {
        path:'mine',
        name:'mine',
        component:mine,
        meta: { title:"我的预约" }
      },

    ]
  },
  {
    path: '/register',
    name:'register',
    component: register,
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,

 
})
router.beforeEach((to,from,next)=>{
  //从from跳转到to
  //document.title = to.meta.title
  // console.log(to);
  next()
});

export default router

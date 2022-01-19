import {
  createRouter,
  createWebHashHistory,
} from 'vue-router'
import Layout from '@/layout/index.vue'

/**
 * 自动加载其他路由模块
 */
const file = require.context('.', true, /\.js$/)
const modules = []
file.keys().forEach(key => {
  if (key === './index.js') return
  modules.push(file(key).default)
})

// 固定路由
export const constantRoutes = [ {
    path: '/',
    component: Layout,
    redirect: '/Home', 
    name: '首页',
    children: [
      {
        path: '/Home',
        component: () => import(/* webpackChunkName: "Home" */ '@/views/Home/index.vue'),
        meta: {
        },
      },
      {
        path: '/redirect',
        component: Layout,
        hidden: true,
        children: [{
          path: '/redirect/:path(.*)',
          component: () => import(/* webpackChunkName: "redirect" */ '@/views/redirect/index')
        }]
      },
      {
        path: '/:pathMatch(.*)',
        component: () => import(/* webpackChunkName: "redirect" */ '@/views/404/index.vue'),
        hidden: true
      }
    ]
  },
  ...modules,
  {
    path: '/login',
    name: 'login',
    hidden: true, 
    component: () => import( /* webpackChunkName: "login" */ '@/views/Login/index.vue')
  },
]

// 异步路由
export const asyncRoutes = [
  {
    path: '/pdf',
    component: Layout,
    name: 'PDF',
    redirect: '/pdf/index',
    children: [{
      path: 'index',
      meta: {
        roles: ['admin']
      },
      component: () => import('@/views/PDF/index'),
    }]
  },
  {
    path: '/permission',
    component: Layout,
    name: 'permission',
    redirect: '/permission/index',
    children: [{
      path: 'index',
      meta: {
        roles: ['editor']
      },
      component: () => import('@/views/Permission/index'),
    }]
  },{
    path: '/:pathMatch(.*)',
    name: '404',
    component: () => import(/* webpackChunkName: "redirect" */ '@/views/404/index.vue'),
    hidden: true
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes
})

// 重置路由
export function resetRouter() {
  // const newRouter = createRouter()
  // router.matcher = newRouter.matcher 
  router.options.routes = []
}

export default router

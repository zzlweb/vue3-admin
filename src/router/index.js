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
    children: [{
        path: 'Home',
        name: '首页',
        component: () => import(/* webpackChunkName: "Home" */ '@/views/Home/index.vue'),
        meta: {
          title: '首页'
        }
      },
      ...modules,

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
    redirect: '/pdf/index',
    meta: {
      title: 'pdf',
      roles: ['admin']
    },
    children: [{
      path: 'index',
      component: () => import('@/views/PDF/index'),
      name: 'pdf',
    }]
  },
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/index',
    meta: {
      title: 'permission',
      roles: ['editor']
    },
    children: [{
      path: 'index',
      component: () => import('@/views/Permission/index'),
      name: 'permission',
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

import {
  createRouter,
  createWebHashHistory
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
export const constantRoutes = [{
  path: '/',
  component: Layout,
  redirect: '/Home',
  name: '首页',
  meta: {
    title: '首页'
  },
  children: [
    {
      path: '/Home',
      name: '首页',
      component: () => import(/* webpackChunkName: "Home" */ '@/views/Home/index.vue')
    },
    {
      path: '/redirect',
      component: Layout,
      hidden: true,
      children: [{
        path: '/redirect/:path(.*)',
        component: () => import(/* webpackChunkName: "redirect" */ '@/views/redirect/index')
      }]
    }
  ]
},
...modules,
{
  path: '/login',
  name: 'login',
  hidden: true,
  component: () => import(/* webpackChunkName: "login" */ '@/views/Login/index.vue')
}
]

// 异步路由
export const asyncRoutes = [
  {
    path: '/pdf',
    component: Layout,
    redirect: '/pdf/index',
    name: 'PDF',
    meta: {
      title: 'PDF',
      roles: ['admin']
    },
    children: [{
      path: 'index',
      name: 'PDF',
      component: () => import(/* webpackChunkName: "PDF" */ '@/views/PDF/index')
    }]
  },
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/index',
    name: '权限页面',
    meta: {
      title: '权限页面',
      roles: ['admin']
    },
    children: [{
      path: 'index',
      name: '权限页面',
      component: () => import(/* webpackChunkName: "permission" */'@/views/Permission/index')
    }]
  },
  {
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
// reset router
export function resetRouter () {
  router.getRoutes().forEach((route) => {
    const { name } = route
    router.hasRoute(name) && router.removeRoute(name)
  })
}

export default router

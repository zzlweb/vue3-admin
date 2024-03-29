import {
  createRouter,
  createWebHashHistory
} from 'vue-router'
import Layout from '@/layout/index.vue'

import ExcelModule from './Excel'
import ThreeModule from './ThreeRouter'

// 固定路由
export const constantRoutes = [{
  path: '/',
  component: Layout,
  redirect: '/Home',
  name: '首页',
  meta: {
    title: '首页'
  },
  children: [{
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
{
  path: '/svgEditor',
  component: Layout,
  redirect: '/svgEditor/index',
  name: '贝塞尔编辑器',
  meta: {
    title: '贝塞尔编辑器'
  },
  children: [{
    path: 'index',
    name: '贝塞尔编辑器',
    component: () => import(/* webpackChunkName: "svgEditor" */ '@/views/svgEditor/index.vue')
  }
  ]
},
{
  path: '/drill',
  component: Layout,
  redirect: '/drill/index',
  name: '钻取图',
  meta: {
    title: '钻取图'
  },
  children: [{
    path: 'index',
    name: '钻取图',
    component: () => import(/* webpackChunkName: "DrillMap" */ '@/views/DrillMap/index.vue')
  }
  ]
},
ExcelModule,
{
  path: '/login',
  name: 'login',
  hidden: true,
  component: () => import(/* webpackChunkName: "login" */ '@/views/Login/index.vue')
}
]

// 异步路由
export const asyncRoutes = [
  ThreeModule,
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
      component: () => import(/* webpackChunkName: "permission" */ '@/views/Permission/index')
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
export const resetRouter = () => {
  const newRouter = createRouter({
    history: createWebHashHistory(),
    routes: constantRoutes
  })

  router.matcher = newRouter.matcher
}

export default router

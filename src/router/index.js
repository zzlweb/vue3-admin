import {
  createRouter,
  createWebHashHistory,
} from 'vue-router'
import Home from '@/views/Home/index.vue'
import NotFound from '@/views/404/index.vue'
import Layout from '@/layout/index.vue'

/**
 * 自动加载其他路由模块
 */
const file = require.context('.', true, /\.ts$/)
const modules = []
file.keys().forEach(key => {
  if (key === './index.ts') return
  modules.push(file(key).default)
})

const routes = [{
    path: '/login',
    name: 'login',
    component: () => import( /* webpackChunkName: "login" */ '@/views/Login/index.vue')
  }, {
    path: '/',
    component: Layout,
    redirect: '/Home',
    children: [{
        path: 'Home',
        name: '首页',
        component: Home,
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
          component: () => import('@/views/redirect/index')
        }]
      },
      {
        path: '/:pathMatch(.*)',
        component: NotFound,
        hidden: true
      }
    ]
  },
  {
    path: '/:pathMatch(.*)',
    name: '404',
    component: NotFound,
    hidden: true
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

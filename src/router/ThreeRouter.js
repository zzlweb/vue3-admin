import Layout from '@/layout/index.vue'

/** 关于我们页面的路由配置 */
const ThreeRouter = {
  path: '/Three',
  component: Layout,
  redirect: '/Three/model',
  name: 'Three',
  meta: {
    title: 'Three',
    roles: ['admin']
  },
  children: [
    {
      name: 'Three model',
      path: 'model',
      meta: {
        title: 'Three model'
      },
      component: () => import(/* webpackChunkName: "Three" */ '@/views/Three/ThreeModel/index')
    }, {
      name: 'Three House',
      path: 'index',
      meta: {
        title: 'Three House'
      },
      component: () => import(/* webpackChunkName: "Three" */ '@/views/Three/ThreeHouse/index')
    }]
}

export default ThreeRouter

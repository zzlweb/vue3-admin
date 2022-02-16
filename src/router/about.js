import Layout from '@/layout/index.vue'

/** 关于我们页面的路由配置 */
const AboutRouter = {
  path: '/test',
  component: Layout,
  redirect: '/test/index',
  name: '测试',
  meta: {
    title: '测试'
  },
  children: [{
    name: '测试页面',
    path: 'index',
    meta: {
      title: '测试页面'
    },
    component: () => import(/* webpackChunkName: "about" */ '@/views/About/index.vue')
  }, {
    path: 'svg',
    name: 'svg页面',
    component: () => import(/* webpackChunkName: "about" */ '@/views/Svg/index.vue'),
    meta: {
      title: 'svg页面'
    }
  }]
}

export default AboutRouter
import Layout  from '@/layout/index.vue'

/** 关于我们页面的路由配置 */
const AboutRouter= {
  path: '/test',
  component: Layout, 
  name: '测试页面',
  redirect: '/test/index',
  children: [{
    path: 'index', 
    name:"关于页面",
    meta: { },
    component: () => import(/* webpackChunkName: "about" */ '@/views/About/index.vue'),
  }, {
    path: 'svg', 
    name:"svg页面",
    component: () => import(/* webpackChunkName: "about" */ '@/views/Svg/index.vue'),
    meta: {}
  }]
}

export default AboutRouter
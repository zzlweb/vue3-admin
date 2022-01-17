import Layout  from '@/layout/index.vue'

/** 关于我们页面的路由配置 */
const AboutRouter= {
  path: '/about',
  component: Layout, 
  name: '关于页面',
  meta: { title: '关于页面'},
  redirect: '/about/index',
  children: [{
    path: 'index', 
    component: () => import(/* webpackChunkName: "about" */ '@/views/About/index.vue'),
  }]
}

export default AboutRouter
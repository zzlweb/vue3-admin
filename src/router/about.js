import { RouteRecordRaw } from 'vue-router'

/** 关于我们页面的路由配置 */
const AboutRouter= {
  path: '/about',
  name: 'about',
  component: () => import(/* webpackChunkName: "about" */ '@/views/About/index.vue'),
}

export default AboutRouter
import Layout from '@/layout/index.vue'

/** 关于我们页面的路由配置 */
const ExcelRouter = {
  path: '/Excel',
  component: Layout,
  redirect: '/Excel/index',
  name: 'Excel',
  meta: {
    title: 'Excel'
  },
  children: [{
    name: '导出 Excel',
    path: 'index',
    meta: {
      title: '导出 Excel'
    },
    component: () => import(/* webpackChunkName: "Excel" */ '@/views/Excel/index.vue')
  }, {
    path: 'index2',
    name: '上传 Excel',
    component: () => import(/* webpackChunkName: "ExcelUpload" */ '@/views/ExcelUpload/index.vue'),
    meta: {
      title: '上传 Excel'
    }
  }]
}

export default ExcelRouter
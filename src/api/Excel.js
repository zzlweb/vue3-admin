import http from '@/utils/http/axios'

const Api = {
  getData: '/Excel/getData'
}

/**
 * @description:获取表格数据
 */
export function getData(params) {
  return http({
    url: Api.getData,
    method: 'GET',
    params
  })
}

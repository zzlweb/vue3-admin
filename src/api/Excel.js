import http from '@/utils/http/axios'

const Api = {
  getData: '/Excel/getData',
  addData: '/Excel/add'
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

/**
 * @description:添加表格数据
 */
 export function addData(params) {
  return http({
    url: Api.addData,
    method: 'post',
    data: {...params}
  })
}

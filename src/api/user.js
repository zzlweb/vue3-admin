import http from '@/utils/http/axios'

const Api = {
  login: '/user/login',
  getInfo: '/user/getInfo'
}

/**
 * @description:用户登录
 */
export function login(params) {
  return http({
    url: Api.login,
    method: 'POST',
    data: {...params}
  })
}

export function getInfo(params) {
  return http({
    url: Api.getInfo,
    method: 'POST',
    data: {params}
  })
}

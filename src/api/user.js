import http from '@/utils/http/axios'

const Api =  {
  login = '/login',
  logout = '/logout'
}

/**
 * @description:用户登录
 */
export function login(params) {
  return http({
    url: Api.login,
    method: 'POST',
    params
  }, {
    isTransformRequestResult: false
  })
}

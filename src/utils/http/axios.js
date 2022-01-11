/**
 * @description 定义axios配置
 */
import Axios, { AxiosResponse, AxiosRequestConfig, AxiosError } from 'axios'
import router from '@/router'
import { message } from 'ant-design-vue'
import Store from '@/store'
import { getToken } from '@/utils/auth.js'
/**
 * 根据状态码获取message
 * @param {AxiosResponse} response Axios  response object
 */
const getErrorCode2text = (response) => {
  /** http status code */
  const code = response.code
  /** notice text */
  let message = 'Request Error'
  switch (code) {
    case 400:
      message = 'Request Error'
      break
    case 401:
      message = 'Unauthorized, please login'
      break
    case 403:
      message = '拒绝访问'
      break
    case 404:
      message = '访问资源不存在'
      break
    case 408:
      message = '请求超时'
      break
    case 500:
      message = '位置错误'
      break
    case 501:
      message = '承载服务未实现'
      break
    case 502:
      message = '网关错误'
      break
    case 503:
      message = '服务暂不可用'
      break
    case 504:
      message = '网关超时'
      break
    case 505:
      message = '暂不支持的 HTTP 版本'
      break
    default:
      message = '位置错误'
  }
  return message
}

/**
 * @returns  {AxiosResponse} result
 * @tutorial see more:https://github.com/onlyling/some-demo/tree/master/typescript-width-axios
 * @example
 * service.get<{data: string; code: number}>('/test').then(({data}) => { console.log(data.code) })
 */
const http = Axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
  timeout: 10000,
})

/**
 * @description 请求发起前的拦截器
 * @returns {AxiosRequestConfig} config
 */
http.interceptors.request.use((config) => {
  if (Store.getters.token) {
    config.headers['X-Token'] = getToken()
  }
  return config
})

/**
 * @description 响应收到后的拦截器
 * @returns {}
 */
http.interceptors.response.use(
  response => {
    const res = response.data
    // 接口请求失败
    if (res.code !== 200) {
      message.info(res.message || 'error', 2)
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        message.error('身份认证过期', 2)
        Store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    message.error(error.message, 2)
    return Promise.reject(error)
  }
)

export default http
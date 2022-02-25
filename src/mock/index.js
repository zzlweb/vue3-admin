import Mock from 'mockjs'
// import homeApi from './home'
import userApi from './user'

// 设置200-2000毫秒延时请求数据
// Mock.setup({
//   timeout: '200-2000'
// })

// 首页相关
// 拦截的是 /home/getData
// Mock.mock(/\/home\/getData/, 'get', homeApi.getStatisticalData)

// 用户相关
// 登录
Mock.mock(/\/user\/login/, 'post', userApi.login)
// 获取用户信息
Mock.mock(/\/user\/getInfo/, 'post', userApi.getInfo)
// 获取excel数据
Mock.mock(/\/Excel\/getData/, 'get', userApi.getDataList)
// 添加excel数据
Mock.mock(/\/Excel\/add/, 'post', userApi.addDataList)

// 以下暂无作用
Mock.mock(/\/user\/del/, 'get', userApi.deleteUser)
Mock.mock(/\/user\/batchremove/, 'get', userApi.batchremove)
// Mock.mock(/\/user\/add/, 'post', userApi.createUser)
Mock.mock(/\/user\/edit/, 'post', userApi.updateUser)
// Mock.mock(/\/home\/getData/, 'get', homeApi.getStatisticalData)

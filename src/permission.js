import router from './router'
import store from './store'
import {
  message
} from 'ant-design-vue'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import {
  getToken
} from '@/utils/auth' // get token from cookie
// import getPageTitle from '@/utils/get-page-title'

NProgress.configure({
  showSpinner: false
}) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()
  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({
        path: '/'
      })
      NProgress.done()
    } else {
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          const {
            roles
          } = await store.dispatch('user/getInfo')

          const accessRoutes = await store.dispatch(
            'permission/generateRoutes',
            roles
          )
          accessRoutes.forEach((item) => {
            router.addRoute(item)
          })

          next({
            ...to,
            replace: true
          })
        } catch (error) {
          // 有token, 没有角色, 重新登陆。
          await store.dispatch('user/resetToken')
          message.error('身份过期')
          // 判断to.path 是否为异步路由，如果为异步路由，redirect => 首页
          if (['/permission/index', '/pdf/index'].indexOf(to.path) !== -1) {
            next(`/login?redirect=/`)
          } else {
            next(`/login?redirect=${to.path}`)
          }
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token */

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      if (['/permission/index', '/pdf/index'].indexOf(to.path) !== -1) {
        next(`/login?redirect=/`)
      } else {
        next(`/login?redirect=${to.path}`)
      }
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

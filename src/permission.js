import router from './router'
import store from './store'
import { message } from 'ant-design-vue'
import { getRoles } from '@/utils/auth.js'
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

  // set page title
  // document.title = getPageTitle(to.meta.title)

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
      // 正确为逻辑为有角色next() 没有角色去获取然后动态生成可访问路由。这里是为了mock,每次路由访问都动态生成路由。
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        const roles = getRoles()
        // generate accessible routes map based on roles
        const accessRoutes = await store.dispatch('permission/generateRoutes', roles)

        // dynamically add accessible routes
        router.addRoute(accessRoutes)

        // hack method to ensure that addRoutes is complete
        // set the replace: true, so the navigation will not leave a history record
        next()
        NProgress.done()
      } else {
        // 有token, 没有角色, 重新登陆。
        await store.dispatch('user/resetToken')
        message.error('身份过期')
        next(`/login?redirect=${to.path}`)
        NProgress.done()
        }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

import {
  createStore
} from 'vuex'
import getters from './getters'

// 动态引入所有的module
const files = require.context('./modules', true, /\.js$/)
const modules = {}
files.keys().forEach((key) => {
  if (key === './index.js') return
  const path = key.replace(/(\.\/|\.js)/g, '')
  const namespace = path
  if (!modules[namespace]) {
    modules[namespace] = {
      namespaced: true
    }
  }
  modules[namespace]= files(key).default
})


const store = createStore({
  modules: {
    ...modules
  }, 
  getters
})

export default store

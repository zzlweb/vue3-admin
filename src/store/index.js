import { createStore } from 'vuex'
import { App } from "vue";

const store = createStore({
  modules: {}, 
  mutations: {}, 
  getters: {}, 
})

// 定义你自己的“useStore”组合函数
export function useStore() {
  return store 
}

// 注册使用vuex
export function setupStore(app) {
  app.use(store);
}

export default store

<template>
  <a-layout class="flex-row">
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
      <div class="logo-area flex-row">Vue3 Admin</div>
      <side />
    </a-layout-sider>
    <a-layout>
      <Headers :collapsed="collapsed" @changeCollapsed="changeCollapsed" />
      <a-layout-content style="padding: 0 24px 24px" class="flex-col">
          <a-breadcrumb style="margin: 16px 0">
            <a-breadcrumb-item v-for="(item, index) in list" :key="index">
              <router-link
                v-if="!item.redirect"
                :to="{ path: item.path === '' ? '/' : item.path }"
              >
                {{ item.name }}
              </router-link>
              <span v-else>{{ item.name }}</span>
            </a-breadcrumb-item>
          </a-breadcrumb>
        <a-layout-content
          :style="{
            background: '#fff',
            padding: '10px',
            margin: 0,
            minHeight: '280px',
          }"
          class="content-area"
        >
          <router-view></router-view>
        </a-layout-content>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
import {
  defineComponent,
  onMounted,
  toRefs,
  watch,
  reactive
} from 'vue'
import { useRoute } from 'vue-router'
import Side from './Side/index.vue'
import Headers from './Header.vue'
export default defineComponent({
  components: {
    Side,
    Headers
  },

  setup () {
    const route = useRoute()

    const state = reactive({
      list: [],
      name: '',
      collapsed: false
    })

    const getBreadCrumb = () => {
      state.list = []
      state.name = route.name
      const matched = route.matched
      matched.forEach((item) => {
        state.list.push(item)
      })

      // 如果匹配到的路由不小于2个, 并且匹配到的第一个和第二个重复,删除第一个
      if (
        state.list.length >= 2 &&
        state.list[0].meta.title === state.list[1].name
      ) {
        state.list = state.list.splice(0, 1)
      }

      // 过滤首页
      if (!state.list.some((item) => item.name === '首页')) {
        state.list.unshift({ name: '首页', path: '/' })
      }
    }

    const changeCollapsed = () => {
      state.collapsed = !state.collapsed
    }

    onMounted(() => {
      getBreadCrumb()
    })

    watch(
      () => route.matched,
      () => {
        getBreadCrumb()
      }
    )

    return {
      ...toRefs(state),
      changeCollapsed
    }
  }
})
</script>
<style lang="less">
@import "../styles/antd.less";

#components-layout-demo-top-side-2 .logo {
  float: left;
  width: 120px;
  height: 31px;
  margin: 16px 24px 16px 0;
  background: rgba(255, 255, 255, 0.3);
}

.ant-row-rtl #components-layout-demo-top-side-2 .logo {
  float: right;
  margin: 16px 0 16px 24px;
}

.site-layout-background {
  background: #fff;
}

.logo-area {
  width: 100%;
  height: 64px;
  background-image: linear-gradient(60deg, #64b3f4 0%, #c2e59c 100%);
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 20px;
  overflow: hidden;
  white-space: nowrap;
}

.content-area{
  overflow-y: auto;
  height: 100%;
}
</style>

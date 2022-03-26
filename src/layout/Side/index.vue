<template>
    <a-menu
      v-model:openKeys="openKeys"
      v-model:selectedKeys="selectedKeys"
      mode="inline"
      @click="clickMenuItem"
      @openChange="onOpenChange"
      :style="{ height: '100%', borderRight: 0 }"
    >
      <side-item
        v-for="(route, index) in list"
        :key="index"
        :item="route"
        :base-path="route.path"
      ></side-item>
    </a-menu>
</template>

<script>
import { defineComponent, reactive, toRefs, watch, computed } from 'vue'
import sideItem from './SideItem.vue'
import store from '@/store'
import { useRoute, useRouter } from 'vue-router'
export default defineComponent({
  setup () {
    const currentRoute = useRoute()
    const router = useRouter()

    // 获取当前打开的子菜单
    const state = reactive({
      rootSubmenuKeys: ['测试'],
      // 选择了name作为menu的key
      openKeys: [currentRoute.matched[0].name],
      selectedKeys: [currentRoute.name]
    })
    // 点击菜单
    const clickMenuItem = ({ key }) => {
      // 重复跳转
      if (key === currentRoute.name) return
      // 如果是外链接
      if (/http(s)?:/.test(key)) {
        window.open(key)
      } else {
        router.push({ name: key })
      }
    }

    watch(
      () => currentRoute.path,
      () => {
        state.selectedKeys = [currentRoute.name]
      }
    )

    const list = computed(() => {
      return store.getters.permissionRouter
    })

    // 互斥 submenu 展开收起的回调
    const onOpenChange = (openKeys) => {
      const latestOpenKey = openKeys.find(
        (key) => state.openKeys.indexOf(key) === -1
      )
      if (state.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        state.openKeys = openKeys
      } else {
        state.openKeys = latestOpenKey ? [latestOpenKey] : []
      }
    }

    return {
      list,
      currentRoute,
      ...toRefs(state),
      clickMenuItem,
      onOpenChange
    }
  },
  components: {
    'side-item': sideItem
  }
})
</script>

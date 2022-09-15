<template>
  <div class="drill">
    <!-- 高德地图  -->
    <div id="container">
    </div>

    <!-- 区域检索 -->
    <div class="search-area">
      <div class="input-item flex-row">
        <div class="input-item-prepend" v-if="level === 'province'"><span class="input-item-text">省市区</span></div>
        <div class="input-item-prepend" v-else-if="level === 'city'"><span class="input-item-text">地级市</span></div>
        <div class="input-item-prepend" v-else><span class="input-item-text">区县</span></div>
        <select style="width:100px" v-model="chosedOptinOne" @change="search">
          <option :value="i.adcode" v-for="i in SelectOption" :key="i.adcode">{{i.name}}</option>
        </select>
      </div>
    </div>

    <div class="mask" v-if="complate">
      加载中...
    </div>
  </div>

</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader'
import { shallowRef, onMounted, ref, reactive, watch } from 'vue'
// 设置安全密钥
window._AMapSecurityConfig = {
  securityJsCode: 'adf4a7a1a350382a5cb6948d8e0ab2fa'
}
export default {
  setup () {
    // map dom
    const map = shallowRef(null)
    // 边界信息集合
    const polygons = ref([])
    // 地图设置参数
    const config = reactive({
      zoom: 4,
      center: [116.3683244, 39.915085],
      searchData: []
    })
    // 钻取实例
    const district = ref(null)
    // 选取地区
    const SelectOption = ref(null)
    // 当前选取地区
    const chosedOptinOne = ref(null)
    // 当前选取的层级
    const level = ref(null)
    // 是否显示遮罩
    const complate = ref(true)

    // 钻取配置
    const opts = {
      subdistrict: 1, // 返回下一级行政区
      extensions: 'all',
      showbiz: false // 最后一级返回街道信息
    }
    // 初始化map
    const initMap = () => {
      AMapLoader.load({
        key: '8e4c111539b6d7df333e0f88cc34207f', // 申请好的Web端开发者Key，首次调用 load 时必填
        version: '', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: [
          'Map3D',
          'AMap.DistrictLayer',
          'AMap.Scale',
          'AMap.ToolBar',
          'AMap.DistrictSearch'
        ] // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      })
        .then((AMap) => {
          district.value = new AMap.DistrictSearch(opts)
          district.value.search('中国', (status, result) => {
            if (status === 'complete') {
              complate.value = false
              config.searchData = result.districtList[0]
              level.value = 'province'
              SelectOption.value = result.districtList[0].districtList
              getData(result.districtList[0], level.value)
            }
          })
        })
        .catch((e) => {
          console.log(e)
        })
    }

    // 渲染钻取数据
    const getData = (data, level) => {
      var bounds = data.boundaries
      var mask = []
      for (var i = 0; i < bounds.length; i += 1) {
        mask.push([bounds[i]])
      }

      map.value = new AMap.Map('container', {
        mask: mask,
        center: config.center,
        disableSocket: true,
        viewMode: '3D',
        labelzIndex: 130,
        pitch: 0,
        zoom: config.zoom,
        layers: [],
        mapStyle: 'amap://styles/grey',
        resizeEnable: true // 是否监控地图容器尺寸变化
      })

      map.value.setCenter(config.center)

      // 添加描边
      if (bounds) {
        for (let i = 0, l = bounds.length; i < l; i++) {
          // eslint-disable-next-line no-new
          var polygon = new AMap.Polyline({
            path: bounds[i],
            strokeColor: '#99ffff',
            strokeWeight: 6,
            map: map.value
          })
          polygons.value.push(polygon)
        }
      }
    }

    // 搜索
    const search = () => {
      // for (var i = 0, l = polygons.value.length; i < l; i++) {
      //   polygons.value[i].setMap(null)
      // }
      if (level.value === 'district') return
      district.value.setExtensions('all')
      // 行政区查询
      // 按照adcode进行查询可以保证数据返回的唯一性
      district.value.search(chosedOptinOne.value, (status, result) => {
        if (status === 'complete') {
          SelectOption.value = result.districtList[0].districtList
          level.value = result.districtList[0].level
          if (level.value === 'province') {
            config.zoom = 7
          } else if (level.value === 'city') {
            config.zoom = 7
          } else {
            config.zoom = 7
          }
          getData(result.districtList[0], level.value)
        }
      })
    }

    watch(chosedOptinOne, () => {
      const item = SelectOption.value.filter(
        (item) => item.adcode === chosedOptinOne.value
      )
      config.center = [item[0].center.R, item[0].center.Q]
    })

    onMounted(() => {
      initMap()
    })
    return {
      map,
      initMap,
      search,
      SelectOption,
      chosedOptinOne,
      level,
      complate
    }
  }
}
</script>

<style lang="less" scoped>
@import "./index.less";
</style>

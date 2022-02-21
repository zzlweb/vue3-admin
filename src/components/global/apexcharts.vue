<template>
  <div id="chart"></div>
</template>

<script>
import * as ApexCharts from "apexcharts";
import { defineComponent, onMounted,nextTick } from "vue";
export default defineComponent({
  props: {
    options: {
      type: Object,
      required: true 
    }
  }, 
  setup(props) {
    // 使用ref
    onMounted(() => {
      var chartDom = document.querySelector("#chart");

      var chart = new ApexCharts(chartDom, props.options);

      nextTick(() => {
          chart.render()
      })
    });

    return {};
  },
});
</script>

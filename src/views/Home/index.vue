<template>
  <div class="home">
    <a-row>
      <a-col :span="24">
        <apexcharts :options="options" />
      </a-col>
    </a-row>
  </div>
</template>

<script >
import { defineComponent, ref } from 'vue'
export default defineComponent({
  name: 'Home',
  setup () {
    const options = ref({
      series: [
        {
          name: 'Type A',
          type: 'column',
          data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30]
        },
        {
          name: 'Type B',
          type: 'area',
          data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43]
        },
        {
          name: 'Type C',
          type: 'line',
          data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39]
        }
      ],
      chart: {
        height: 350,
        type: 'line',
        stacked: false
      },
      stroke: {
        width: [0, 2, 5],
        curve: 'smooth'
      },
      plotOptions: {
        bar: {
          columnWidth: '50%'
        }
      },
      fill: {
        opacity: [0.85, 0.25, 1],
        gradient: {
          inverseColors: false,
          shade: 'light',
          type: 'vertical',
          opacityFrom: 0.85,
          opacityTo: 0.55,
          stops: [0, 100, 100, 100]
        }
      },
      labels: [
        '01/01/2022',
        '02/01/2022',
        '03/01/2022',
        '04/01/2022',
        '05/01/2022',
        '06/01/2022',
        '07/01/2022',
        '08/01/2022',
        '09/01/2022',
        '10/01/2022',
        '11/01/2022'
      ],
      markers: {
        size: 0
      },
      xaxis: {
        type: 'datetime'
      },
      yaxis: {
        title: {
          text: 'Points'
        },
        splitLine: {
          show: false
        },
        min: 0
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: function (y) {
            if (typeof y !== 'undefined') {
              return y.toFixed(0) + ' points'
            }
            return y
          }
        }
      },
      toolbar: {
        show: false
      },
      grid: {
        clipMarkers: false
      }
    })

    return {
      options
    }
  }
})
</script>

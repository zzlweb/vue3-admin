<template>
  <div class="canvas-dom">
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100%" height="100%">
      <!-- 网格 -->
      <defs>
        <pattern id="Pat01" width="10" height="10" patternUnits="userSpaceOnUse">
          <rect width="10" height="10" fill="#FFFFFF" stroke="#000000" stroke-width="0.1" />
        </pattern>
      </defs>

      <rect x="0" y="0" width="100%" height="100%" fill="url(#Pat01)" />

      <path d="M20,50 H320 V350 H20 Z" fill="none" stroke="none" stroke-width="0.5" stroke-dasharray="2 2" />

      <path fill="none" id="control-path" stroke="#E8C48E" d="M20,350 L231,159 320,350 " />
      <path stroke="red" fill="none" id="bezier-path" stroke-width="1.2" d="M20,350 Q231,159 320,350 " />

      <!-- 点 -->
      <circle r="4" fill="red" stroke="red" id="marker" stroke-width="1" cx="-10" cy="-10" />
      <svg x="0" y="330">
        <circle r="4" fill="white" stroke="#E8C48E" stroke-width="1" cx="20" cy="20" style="cursor: pointer" />
        <text x="12" y="12" style="font-size:16px;font-weight:bold">1</text>
      </svg><svg x="211" y="139">
        <circle r="4" fill="white" stroke="#E8C48E" stroke-width="1" cx="20" cy="20" style="cursor: pointer" />
        <text x="12" y="12" style="font-size:16px;font-weight:bold">2</text>
      </svg><svg x="300" y="330">
        <circle r="4" fill="white" stroke="#E8C48E" stroke-width="1" cx="20" cy="20" style="cursor: pointer" />
        <text x="12" y="12" style="font-size:16px;font-weight:bold">3</text>
      </svg>
    </svg>
  </div>
</template>

<script>
import { defineComponent, onMounted } from 'vue'

export default defineComponent({
  setup () {
    const box = {
      left: 20,
      top: 50,
      right: 320,
      bottom: 350
    }

    let pointsIn = location.search.match(/p=(.*?)($|&)/)[1]
    // // don't show a piece of control path between P2 and P3
    const hideMiddleControlPath = location.search.match('nocpath=1')
    pointsIn = pointsIn.split(',')
    const points = []
    // // read points from ?p=...
    for (let i = 0; i < pointsIn.length; i++) {
      const x = box.left + (box.right - box.left) * pointsIn[i]
      const y = box.bottom + (box.top - box.bottom) * pointsIn[++i]
      points.push({
        x: x,
        y: y
      })
    }
    const bezierPath = document.getElementById('bezier-path')
    const controlPath = document.getElementById('control-path')
    // controlPath.style.display = location.search.match('nocpath=1') ? 'none' : 'block';
    const tPathTemplate = document.getElementById('t-path-template')
    tPathTemplate.parentNode.removeChild(tPathTemplate)

    const drawPath = () => {
      let letter
      switch (points.length) {
        case 4:
          letter = 'C'
          break
        case 3:
          letter = 'Q'
          break
        default:
          letter = 'L'
      }
      let bezierPathD = 'M' + points[0].x + ',' + points[0].y + ' ' + letter
      let controlPathD = 'M' + points[0].x + ',' + points[0].y + ' L'
      for (let i = 1; i < points.length; i++) {
        bezierPathD += points[i].x + ',' + points[i].y + ' '
        controlPathD += points[i].x + ',' + points[i].y + ' '
      }
      bezierPath.setAttribute('d', bezierPathD)
      controlPath.setAttribute('d', controlPathD)

      function dist (a, b) {
        return Math.round(
          Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y))
        )
      }
      if (hideMiddleControlPath) {
        controlPath.setAttribute(
          'stroke-dasharray',
          dist(points[0], points[1]) +
            ' ' +
            dist(points[1], points[2]) +
            ' 9999 9999'
        )
      }
    }
    // // draw control points
    const drawPoints = (points) => {
      const p = document.getElementById('p-template')
      p.removeAttribute('id')
      p.parentNode.removeChild(p)
      for (let i = 0; i < points.length; i++) {
        const point = p.cloneNode(true)
        point.getElementsByTagName('text')[0].firstChild.data = i + 1
        setPointCoords(point, i)
        setPointHandler(point, i)
        document.documentElement.appendChild(point)
      }
    }
    // control points coords are shifted from Left-Upper corner a bit
    // to give them space to render
    const setPointCoords = (point, i) => {
      point.setAttribute('x', points[i].x - 20)
      point.setAttribute('y', points[i].y - 20)
    }

    const setPointHandler = (point, i) => {
      const circle = point.getElementsByTagName('circle')[0]
      circle.onmousedown = function () {
        document.onmousemove = function (e) {
          let x = e.pageX
          let y = e.pageY
          // constrain withing the box
          if (x < box.left) x = box.left
          if (x > box.right) x = box.right
          if (y > box.bottom) y = box.bottom
          if (y < box.top) y = box.top
          points[i].x = x
          points[i].y = y
          setPointCoords(point, i)
          drawPath()
        }
        document.onmouseup = function () {
          document.onmousemove = document.onmouseup = null
        }
        return false
      }
    }

    onMounted(() => {
      document.documentElement.ondragstart = function () {
        return false
      }
      drawPath()
      drawPoints(points)
    })
  }
})
</script>

<style lang="less" scoped>
.canvas-dom {
  height: 100%;
  background: #000;
}
</style>

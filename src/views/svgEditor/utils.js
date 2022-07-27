/**
 *
 * @param {String} n
 * @returns number
 *
 * 将字符串转换成为一个整数
 */
export const positiveNumber = (n) => {
  n = parseInt(n)
  if (isNaN(n) || n < 0) n = 0

  return n
}

// 获取镜像的点 p1原点 p2手的位置
export function getMirrorPoint (p1, p2, w) {
  // 获取两点之间的弧度
  const radian = getRadian(p1, p2)
  // 弧度转角度
  const degrees = radian2Angle(radian)
  // 求出距离作为半径
  const radius = getDistance(p1, p2)

  // 根据半径[radius],原点[p1.x,p1.y]坐标, 计算出角度[degrees]对应的圆上坐标点
  let x = parseInt(p1.x + radius * Math.cos((degrees * Math.PI) / 180))
  let y = parseInt(p1.y + radius * Math.sin((degrees * Math.PI) / 180))
  // 添加边界条件限制
  if (w) {
    if (x < 0) {
      x = 0
      y = parseInt(p1.y + p1.x * Math.sin((degrees * Math.PI) / 180))
    }
    if (x > w) {
      x = w
      y = parseInt(p1.y + (w - p1.x) * Math.sin((degrees * Math.PI) / 180))
    }
  }
  return {
    x, y
  }
}

// 获取镜像的点 p1原点 p2手的位置
export function getAnglePoint (p1, p2) {
  // 获取两点之间的弧度
  const radian = getRadian(p1, p2)
  // 弧度转角度
  const degrees = radian2Angle(radian)

  return {
    degrees
  }
}

// 获取两点之间的弧度
function getRadian (p1, p2) {
  return Math.atan2(p1.y - p2.y, p1.x - p2.x)
}

// 弧度转角度
function radian2Angle (radian) {
  return (180 / Math.PI) * radian
}

// 获取两点的距离
export function getDistance (p1, p2) {
  const dx = Math.abs(p1.x - p2.x)
  const dy = Math.abs(p1.y - p2.y)
  const radius = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
  return radius
}

/**
 * @desc 贝塞尔曲线算法，包含了3阶贝塞尔
 */
export class Bezier {
  /**
   * @desc 获取点，这里可以设置点的个数
   * @param {number} num 点个数
   * @param {Array} p1 点坐标
   * @param {Array} p2 点坐标
   * @param {Array} p3 点坐标
   * @param {Array} p4 点坐标
   * 如果参数是 num, p1, p2 为一阶贝塞尔
   * 如果参数是 num, p1, c1, p2 为二阶贝塞尔
   * 如果参数是 num, p1, c1, c2, p2 为三阶贝塞尔
   */
  getBezierPoints (num = 100, p1, p2, p3, p4) {
    let func = null
    const points = []
    if (!p3 && !p4) {
      func = this.oneBezier
    } else if (p3 && !p4) {
      func = this.twoBezier
    } else if (p3 && p4) {
      func = this.threeBezier
    }
    for (let i = 0; i < num; i++) {
      points.push(func(i / num, p1, p2, p3, p4))
    }
    if (p4) {
      points.push([...p4])
    } else if (p3) {
      points.push([...p3])
    }
    return points
  }

  /**
   * @desc 一阶贝塞尔
   * @param {number} t 当前百分比
   * @param {Array} p1 起点坐标
   * @param {Array} p2 终点坐标
   */
  oneBezier (t, p1, p2) {
    const [x1, y1] = p1
    const [x2, y2] = p2
    const x = x1 + (x2 - x1) * t
    const y = y1 + (y2 - y1) * t
    return [x, y]
  }

  /**
   * @desc 二阶贝塞尔
   * @param {number} t 当前百分比
   * @param {Array} p1 起点坐标
   * @param {Array} p2 终点坐标
   * @param {Array} cp 控制点
   */
  twoBezier (t, p1, cp, p2) {
    const [x1, y1] = p1
    const [cx, cy] = cp
    const [x2, y2] = p2
    const x = (1 - t) * (1 - t) * x1 + 2 * t * (1 - t) * cx + t * t * x2
    const y = (1 - t) * (1 - t) * y1 + 2 * t * (1 - t) * cy + t * t * y2
    return [x, y]
  }

  /**
   * @desc 三阶贝塞尔
   * @param {number} t 当前百分比
   * @param {Array} p1 起点坐标
   * @param {Array} p2 终点坐标
   * @param {Array} cp1 控制点1
   * @param {Array} cp2 控制点2
   */
  threeBezier (t, p1, cp1, cp2, p2) {
    const [x1, y1] = p1
    const [x2, y2] = p2
    const [cx1, cy1] = cp1
    const [cx2, cy2] = cp2
    const x =
          x1 * (1 - t) * (1 - t) * (1 - t) +
          3 * cx1 * t * (1 - t) * (1 - t) +
          3 * cx2 * t * t * (1 - t) +
          x2 * t * t * t
    const y =
          y1 * (1 - t) * (1 - t) * (1 - t) +
          3 * cy1 * t * (1 - t) * (1 - t) +
          3 * cy2 * t * t * (1 - t) +
          y2 * t * t * t
    return [x, y]
  }
}

// 二维数组去重
export function binaryArrayDuplicate (arr) {
  const obj = {}
  const out = []
  for (let index = 0; index < arr.length; index++) {
    if (!obj[arr[index]]) {
      out.push(arr[index])
      obj[arr[index]] = true
    }
  }
  return out
}

const floatEpsilon = Math.pow(2, -23)
export function equal (a, b) {
  return Math.abs(a - b) <= floatEpsilon * Math.max(Math.abs(a), Math.abs(b))
}

// 筛选符合值
export function removeDuplicates (arr) {
  for (let left = 0; left < arr.length; left++) {
    for (let right = 1; right < arr.length; right++) {
      if (arr[right][0] > 1) {
        arr[right][0] = 1
      }
      // 如果第一个值相等并且第二个值小于前一个第二个值
      if ((equal(arr[left][0], arr[right][0])) && (arr[left][1] <= arr[right][1])) {
      // 将left 的值改为right的值
        arr[left][1] = arr[right][1]
      }
    }
  }
  // 去重
  arr = binaryArrayDuplicate(arr)
  return arr
}

// 从一个数组中均匀的取出10个数, 包含首尾
export function getEvenNumber (arr, nub) {
  if (!arr) {
    return []
  }

  const data = []
  // 获取首项
  data[0] = arr[0]
  // 获取数组长度
  const total = arr.length
  // 如果数组长度大于0 ，小于要获取的总数, 返回数组
  if (total > 0 && total < nub) {
    return arr
  } else {
    // 获取整数
    const diff = Math.floor(total / (nub - 2))
    // 赋值
    for (let i = 1; i <= nub - 2; i++) {
      data[i] = arr[diff * i]
    }

    // 添加尾部
    data.push(arr[total - 1])

    return data
  }
}

export function throttle (method, delay, context) {
  clearTimeout(method.timerId)
  method.timerId = setTimeout(function () {
    method.call(context)
  }, delay)
}

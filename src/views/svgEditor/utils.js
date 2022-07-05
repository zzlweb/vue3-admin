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
export function getMirrorPoint (p1, p2) {
  // 获取两点之间的弧度
  const radian = getRadian(p1, p2)
  // 弧度转角度
  const degrees = radian2Angle(radian)
  // 求出距离作为半径
  const radius = getDistance(p1, p2)
  // 根据半径[radius],原点[p1.x,p1.y]坐标, 计算出角度[degrees]对应的圆上坐标点
  const x = p1.x + radius * Math.cos((degrees * Math.PI) / 180)
  const y = p1.y + radius * Math.sin((degrees * Math.PI) / 180)
  return { x, y }
}
// 获取两点之间的弧度
export function getRadian (p1, p2) {
  return Math.atan2(p1.y - p2.y, p1.x - p2.x)
}
// 弧度转角度
export function radian2Angle (radian) {
  return (180 / Math.PI) * radian
}
// 获取两点的距离
export function getDistance (p1, p2) {
  const dx = Math.abs(p1.x - p2.x)
  const dy = Math.abs(p1.y - p2.y)
  const radius = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
  return radius
}

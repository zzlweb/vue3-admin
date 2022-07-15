import * as THREE from 'three'

// 获得曲线点集
export function getPoints (waypoints, radius) {
  var pta = round3DLine(waypoints, [radius / 4, radius / 4 * 2, -radius / 4 * 2, -radius / 4])
  var pts = []
  // 逐个组处理圆角，并合并
  pta.map(a => {
    var v = points2Vectors(a)
    if (v.length === 4) {
      var curve = new THREE.CubicBezierCurve3(v[0], v[1], v[2], v[3])
      var points = curve.getPoints(10)
      pts = [...pts, ...points]
    } else {
      v.map(n => {
        pts.push(new THREE.Vector3(n))
      })
    }
  })
  console.log(pts)
  return pts
}

function points2Vectors (points) {
  /* fx :: 空间点数组转为空间向量数组 */
  return points.map(n => new THREE.Vector3(n[0], n[1], n[2]))
}

function round3DLine (points, offset) {
  /* fx :: 将折线的点按圆角进行分组 */
  //
  if (points.length <= 1) return
  var pts = []
  var corner = []
  // 筛选出offset里的极值，极值的和作为长度的筛选长度，不够筛选长度的线将直接被跳过
  var ofset = offset.map(n => Math.abs(n))
  ofset = ofset.sort((a, b) => b - a)
  var lengthFilter = ofset[0] + ofset[1]
  var prevPoint = points[0]
  for (var n = 1; n < points.length; n++) {
    // 筛选掉长度小于offset的点
    var len = getPointsDistance(prevPoint, points[n])
    if (len >= lengthFilter) {
      var np = get3DLinePoint(prevPoint, points[n], offset)
      corner.push(np[0])
      corner.push(np[1])
      pts.push(corner)
      corner = np.slice(2)
    }
    prevPoint = points[n]
  }
  pts.push(corner)
  return pts
}

function getPointsDistance (point1, point2) {
  /* fx :: 获得两个空间点的距离 */
  var dx = point1[0] - point2[0]
  var dy = point1[1] - point2[1]
  var dz = point1[2] - point2[2]
  return Math.sqrt(dx * dx + dy * dy + dz * dz)
}

function get3DLinePoint (start, end, offset) {
  /* fx :: 获得三维空间内两个点之间的距离偏移点的三维坐标（数组） */
  //
  var points = get2DlinePoint(start, end, offset)
  var pointsZ = get2DlinePoint(start.slice(1), end.slice(1), offset)
  return offset.map((n, i) => [points[i][0], points[i][1], pointsZ[i][1]])
}

function get2DlinePoint (start, end, offset) {
  /* fx :: 获得二维平面内两个点之间的距离偏移点的二维坐标（数组） */
  if (start[0] === end[0]) {
    var step = start[1] < end[1] ? 1 : (start[1] > end[1] ? -1 : 0)
    return offset.map(n => {
      if (n > 0) return [start[0], start[1] + n * step]
      else if (n < 0) return [end[0], end[1] + n * step]
      else return [start[0], (start[1] + end[1]) / 2]
    })
  } else {
    var a = (start[1] - end[1]) / (start[0] - end[0])
    var b = start[1] - start[0] * a
    var lx = 1 / Math.sqrt(1 + a * a)
    var ly = lx * a
    step = start[0] < end[0] ? 1 : -1
    return offset.map(n => {
      if (n > 0) return [start[0] + n * lx * step, start[1] + n * ly * step]
      else if (n < 0) return [end[0] + n * lx * step, end[1] + n * ly * step]
      else return [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2]
    })
  }
}

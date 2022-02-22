// 计算数组中每个元素出现的次数
let name = ['peter', 'tom', 'mary', 'bob', 'tom']

let nameUnm = name.reduce((pre, current) => {
  if (current in pre) {
    pre[current]++
  } else {
    pre[current] = 1
  }
  return pre
}, {})

// 数组去重
let arr = [1, 2, 3, 4, 5, 6, 7, 7, 7]

let newArr = arr.reduce((pre, current) => {
  if (!pre.includes(current)) {
    return pre.concat(current)
  } else {
    return pre
  }
}, [])

// 数组降维
var arr = [[1,0], [2,3],[4,[5,7]]]
var newArray = function (arr) {
  return arr.reduce((pre,current) => {
    pre.concat(Array.isArray(current) ? newArr(current): current)
  }, [])
}
console.log(newArray);
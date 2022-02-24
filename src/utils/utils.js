import { def } from "@vue/shared"
import { set } from "core-js/core/dict"

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


// 假定
const obj = {
  a: {
    b: 33, 
    c: {
      d: 44
    }
  },
  e: 1
}

// 数据劫持
objectDefineProperty(obj, 'a' , {
  get() {
    console.log('获取');
  },

  set() {
    console.log('设置');
  }
})

// 定义一个响应式函数, 解决objectDefineProperty 赋值和获取值不关联的问题

defineReactive(obj , 'a' , 10)

// 设置新值
obj.a ++

// 3闭包环境
function defineReactive (obj, key , value){
  // 如果只是传递两个参数，让value 等于对象的本身值
  if(arguments.length === 2) {
    value = obj[key]
  }

  // 再次形成递归
  let childOB = observe(value)

  objectDefineProperty(obj, key , {
    get() {
      console.log(value);
    },

    set(newValue) {
      if(value === newValue){
        return 
      }
      value = newValue
      childOB = observe(newValue)
    }
  })
}

// 2递归侦测对象全部属性

// 创建观察类 observer  作用是将任意object 转换为每个属性都是响应式的

class observer {
  constructor(value){
    // 定义属性值 def = objectDefineProperty(obj,key,value)
    // this 指向为observer 实例
    def(value,'__ob__',this)
  }

  // 遍历 value, 让每一个key 都是响应式的
  walk(value){
    for(let k in value ) {
      defineReactive(value, k)
    }
  }
}

// 1创建递归观察函数
function observe(value){
  // 判断是否为对象
  if(typeof value != 'object') return 

  // 定义ob
  if(typeof value.__ob__ !== 'undefined') {
    ob = value.__ob__
  }else{
    ob = new observer(value)
  }
  return ob 
}

observe(obj)
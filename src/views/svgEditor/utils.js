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

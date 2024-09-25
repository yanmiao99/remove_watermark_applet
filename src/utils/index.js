
/**
 * 判断对象是否为空
 * @param {*} obj
 * @returns {boolean}
 * */
export function isEmptyObject(obj) {
  return obj && Object.keys(obj).length === 0 && obj.constructor === Object
}
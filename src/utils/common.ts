/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 *
 * @param min 最小数
 * @param max 最大数
 * @returns 范围内随机数
 */
export const randNum = (min: number, max: number) => Math.floor(Math.random()) * (max - min + 1) + min

/**
 *
 * @returns uuid
 */
export const generateUUID = () => {
  return URL.createObjectURL(new Blob()).substr(-36)
}

/**
 * 睡眠函数
 * @param ms 毫秒数
 */
export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * 过滤对象里的key
 * @param obj 对象
 * @param condition 条件，为true则保留，默认过滤undefined和null的key
 */
export const removeObjKey = <T extends Record<string, any>>(obj: T, condition?: (v: unknown) => boolean) => {
  const _condition = condition ?? ((v: unknown) => v !== undefined && v !== null)
  return Object.keys(obj).reduce((_obj: Record<string, unknown>, k: string) => {
    return _condition(obj[k]) ? {..._obj, [k]: obj[k]} : _obj
  }, {}) as T
}

/**
 * 前端数据字典转汉字
 * @param list 字段数据源
 * @param target 目标value值，1、string为单个， 2、T[]为多个（不要传target = '1,2,3'这种，因为不确定拼接符号）
 * @param key 字典key
 * @param value 字典value
 * @returns 根据target返回string或者T[]
 */
export const dictValue2Text = <T extends Record<string, any>>(
  list: T[],
  target: string | number | string[] | number[],
  key = 'text',
  value = 'value'
) => {
  if (Array.isArray(target)) {
    const arr = target.map(item => {
      const obj = list.find((v: T) => v[value] == item)
      if (obj) return obj[key]
    })
    return arr.filter(v => v) as T[]
  } else {
    let label = ''
    const obj = list.find((v: T) => v[value] == target)
    if (obj) label = obj[key]
    return label
  }
}

/**
 * 异步加载script
 * @param url xx.js路径
 */
export const loadScript = (url: string) => {
  const script = document.createElement('script')
  script.type = 'text/javascript'
  script.src = url
  document.body.appendChild(script)
  return new Promise<void>((resolve, reject) => {
    script.onload = function () {
      resolve()
    }
    script.onerror = function (err) {
      reject(err)
    }
  })
}

/**
 * 是否为空值
 * @param value
 * @returns boolean
 */
export function isEmpty(value: unknown) {
  return typeof value === 'undefined' || value === null || value === ''
}

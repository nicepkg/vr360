// @ts-check
/**
 * @typedef { import("vite/dist/node").ProxyOptions } ProxyOptions
 * @typedef { Record<string, ProxyOptions> } Proxy
 */

const {switchVersion: switchVueVersion} = require('vue-demi/scripts/utils.js')

/**
 * 是否是生产环境
 */
const isProd = () => process.env.NODE_ENV === 'production'

/**
 * 是否是开发环境
 */
const isDev = () => process.env.NODE_ENV === 'development'

/**
 * 是否开启打包分析报告
 */
const isReport = () => process.env.VITE_REPORT === 'true'

module.exports = {
  switchVueVersion,
  isDev,
  isProd,
  isReport
}

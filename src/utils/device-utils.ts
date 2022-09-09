/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * 校正windows页面在系统进行缩放后导致页面被放大的问题，通常放大比例是125%、150%
 **/
class DevicePixelRatio {
  // 获取系统类型
  _getSystem() {
    const agent = navigator.userAgent.toLowerCase()
    if (agent.indexOf('windows') >= 0) {
      return true
    }
  }

  // 获取页面缩放比例
  _addHandler(element: any, type: string, handler: Function) {
    if (element.addEventListener) {
      element.addEventListener(type, handler, false)
    } else if (element.attachEvent) {
      element.attachEvent('on' + type, handler)
    } else {
      element['on' + type] = handler
    }
  }

  // 校正浏览器缩放比例
  _correct() {
    const elm: any = document.getElementsByTagName('body')[0]
    // 页面devicePixelRatio（设备像素比例）变化后，计算页面body标签zoom修改其大小，来抵消devicePixelRatio带来的变化。
    elm.style.zoom = 1 / window.devicePixelRatio
  }

  // 监听页面缩放
  _watch() {
    const self = this
    self._addHandler(window, 'resize', function () {
      // 注意这个方法是解决全局有两个window.resize
      // 重新校正
      self._correct()
    })
  }

  // 初始化页面比例
  init() {
    const self = this
    if (self._getSystem()) {
      // 判断设备，目前只在windows系统下校正浏览器缩放比例
      // 初始化页面校正浏览器缩放比例
      self._correct()
      // 开启监听页面缩放
      self._watch()
    }
  }
}
export default new DevicePixelRatio()

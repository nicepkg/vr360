/* eslint-disable @typescript-eslint/no-explicit-any */
export type InoElementsConfig = {
  /**
   * 货币数字格式支持的语言环境。
   * See https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Intl#locales_argument
   */
  currencyLocale: string
}
export type InoElementsWindow = {
  inoElements?: {
    config?: InoElementsConfig
  }
  __zone_symbol__requestAnimationFrame?: (ts: FrameRequestCallback) => number
} & Window

export class Config {
  get(key: keyof InoElementsConfig, fallback?: any): any {
    const value = this.storage?.[key]
    return value ?? fallback
  }

  patch(key: keyof InoElementsConfig, value?: any) {
    if (this.storage?.[key]) {
      this.storage[key] = value
    }
  }

  private get storage(): InoElementsConfig | null {
    if (typeof (window as any) !== 'undefined') {
      const configWrapper = (window as any as InoElementsWindow).inoElements
      return configWrapper?.config ?? null
    }
    return null
  }
}
export const config = new Config()

/**
 * 设置配置。初始化期间要调用的函数以设置配置/用户首选项。
 *
 * @param config 给定的配置
 */
export const setupConfig = (config: InoElementsConfig) => {
  const win = window as any as InoElementsWindow
  const namespace = win.inoElements
  if (namespace?.config?.constructor.name !== 'Object') {
    console.error('vr360-ui config was already initialized')
    return
  }
  win.inoElements = win.inoElements ?? {}
  win.inoElements.config = config
}

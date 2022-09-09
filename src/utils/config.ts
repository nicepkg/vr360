export class Config {
  static get baseUrl(): string {
    return process.env.BASE_URL || ''
  }

  /**
   * 是否是开发环境
   */
  static get isProd(): boolean {
    return process.env.NODE_ENV === 'production'
  }

  /**
   * 是否开启打包分析报告
   */
  static get isDev(): boolean {
    return process.env.NODE_ENV === 'development'
  }

  /**
   * 是否开启打包分析报告
   */
  static get isReport(): boolean {
    return process.env.VITE_REPORT === 'true'
  }
}

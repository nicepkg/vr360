import {Plugin} from 'vite'
import {loadEnv, loadDynamicInjectedEnv} from './load-env'
import path from 'path'

/**
 * Env Plugin options.
 */

export interface EnvOptions {
  /**
   * prefix for client-side injection
   * @default 'VUE_APP'
   */
  prefix: string | RegExp

  /**
   * client-side env path
   * @default 'process.env'
   */
  mountedPath: 'process.env' | 'import.meta.env'

  /**
   * write to process.env
   * vite default not，whilte vue-cli yes
   * @default false
   */
  ignoreProcessEnv: boolean
}

export type UserOptions = Partial<EnvOptions>
export const validateKey = (key: string, prefix: string | RegExp) => {
  if (typeof prefix === 'string') {
    return key.startsWith(prefix)
  }
  return prefix.test(key)
}

export default function envCompatible(userOptions: UserOptions = {}): Plugin {
  const options: UserOptions = {
    mountedPath: 'process.env',
    ...userOptions
  }
  return {
    name: 'vite-plugin-env',
    enforce: 'pre',
    config(config, {mode}) {
      const root = config.root || process.cwd()
      let envDir = config.envDir || './'
      if (!path.isAbsolute(envDir || '')) {
        envDir = path.join(root, envDir)
      }
      const prefix = typeof options.prefix === 'undefined' ? 'VUE_APP_' : options.prefix
      const env = loadEnv({
        mode,
        envDir,
        prefix,
        ignoreProcessEnv: options.ignoreProcessEnv ?? false
      })
      const dynamicInjectedEnv = loadDynamicInjectedEnv(prefix)
      const myDefine: Record<string, string> = {}
      if (options.mountedPath?.startsWith('process.env')) {
        myDefine['process.env.VITE'] = JSON.stringify(true)
      }
      Object.keys({...env, ...dynamicInjectedEnv}).map(key => {
        const value = env[key]

        /**
         * const a = "'development'"
         * const b = '"development"'
         * const c = 'development'
         * const ret1 = JSON.stringify(a)
         * const ret2 = JSON.stringify(b)
         * const ret3 = JSON.stringify(c)
         * console.log(JSON.stringify(ret1).startsWith(`"`)) // true
         * console.log(JSON.stringify(ret2).startsWith(`"`)) // true
         * console.log(JSON.stringify(ret3).startsWith(`"`)) // true
         */
        myDefine[`${options.mountedPath}.${key}`] = JSON.stringify(value)
      })
      config.define = {
        ...(config.define || {}),
        ...myDefine
      }
      // console.log(config.define)
    }
  }
}

export type {UserOptions as EnvCompatibleOptions}

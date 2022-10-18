/// <reference types="vitest" />
import type {PluginOption, UserConfig} from 'vite'
import {defineConfig} from 'vite'
import {buildUtils, viteReact, viteTsconfigPaths} from '@nicepkg/vr360-shared'

export const packagePath = __dirname

type CreateViteConfigOptions = {
  minify?: boolean
}

const createViteConfig = (options: CreateViteConfigOptions = {}): UserConfig => {
  const {minify = false} = options
  const plugins: PluginOption[] = [viteReact.default(), viteTsconfigPaths.default()]

  return buildUtils.createViteConfig({
    packagePath,
    minify,
    plugins,
    externalMap: {
      react: 'React',
      'react-dom': 'ReactDOM'
    },
    dedupe: ['three', 'react', 'react-dom'] // use the same version
  })
}

// default config and build prod config
export const unMinifyConfig = createViteConfig({minify: false})

// build prod and build prod config
export const minifyConfig = createViteConfig({minify: true})

// for vitest
export default defineConfig(unMinifyConfig)

/// <reference types="vitest" />
import type {UserConfig} from 'vite'
import {defineConfig} from 'vite'
import {buildUtils} from '@nicepkg/vr360-shared'

export const packagePath = __dirname

type CreateViteConfigOptions = {
  minify?: boolean
}

const createViteConfig = (options: CreateViteConfigOptions = {}): UserConfig => {
  const {minify = false} = options
  return buildUtils.createViteConfig({
    packagePath,
    minify,
    externalMap: {
      vue: 'Vue'
    },
    dedupe: ['three', 'vue'] // use the same version
  })
}

// default config and build prod config
export const unMinifyConfig = createViteConfig({minify: false})

// build prod and build prod config
export const minifyConfig = createViteConfig({minify: true})

// for vitest
export default defineConfig(unMinifyConfig)

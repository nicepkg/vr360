import type {InlineConfig, UserConfig, BuildOptions as ViteBuildOptions} from 'vite'
import {build as viteBuild} from 'vite'
import rimraf from 'rimraf'
import path from 'node:path'
import dts from 'vite-plugin-dts'
import type {PluginVisualizerOptions} from 'rollup-plugin-visualizer'
import bundleVisualizer from 'rollup-plugin-visualizer'

export const WATCH = Boolean(process.env.WATCH)
export const REPORT = Boolean(process.env.REPORT)

export type DtsOptions = Parameters<typeof dts>[0]

type GetItemType<T> = T extends (infer U)[] ? U : T
type RollupOutput = NonNullable<NonNullable<ViteBuildOptions['rollupOptions']>['output']>
export type OutputOptions = GetItemType<RollupOutput>

export type ChangeConfigOptions = {
  genDts?: boolean
  dtsOptions?: DtsOptions
  report?: boolean
  reportOptions?: (outputOptions: OutputOptions) => PluginVisualizerOptions
  watch?: boolean
  packagePath: string
}

export function changeViteConfig(config: UserConfig, options: ChangeConfigOptions): InlineConfig {
  const {genDts = false, watch = false, dtsOptions, packagePath, report = false, reportOptions} = options

  const pathResolve = (..._path: string[]) => path.resolve(packagePath, ..._path)

  if (!config.build) config.build = {}
  if (!config.build.rollupOptions) config.build.rollupOptions = {}
  if (!config.build.rollupOptions.plugins) config.build.rollupOptions.plugins = []
  if (!config.plugins) config.plugins = []

  // don not clear dist folder
  config.build.emptyOutDir = false

  if (genDts) {
    config.plugins.push(
      dts({
        insertTypesEntry: true,
        tsConfigFilePath: pathResolve('./tsconfig.json'),
        ...dtsOptions
      })
    )
  }

  if (report) {
    config.build.rollupOptions.plugins.push(
      bundleVisualizer(outputOptions => {
        return {
          open: true,
          filename: path.join(outputOptions.dir ?? '', 'stats.html'),
          ...reportOptions?.(outputOptions as OutputOptions)
        }
      }) as Plugin
    )
  }

  if (watch) {
    config.build.watch = {
      include: pathResolve('./src/**/*')
    }
  }

  return {
    ...config,
    configFile: false // don't use vite.config.ts
  }
}

export type ChangeConfigFn = (config: UserConfig, options: ChangeConfigOptions) => Promise<InlineConfig> | InlineConfig
export type BuildOptions = {
  minifyConfig: UserConfig
  unMinifyConfig: UserConfig
  packagePath: string
  dtsOptions?: DtsOptions
  reportOptions?: (outputOptions: OutputOptions) => PluginVisualizerOptions
  changeConfigFn?: ChangeConfigFn
}

export async function build(config: BuildOptions) {
  const {
    minifyConfig,
    unMinifyConfig,
    packagePath,
    changeConfigFn = changeViteConfig,
    dtsOptions,
    reportOptions
  } = config

  const pathResolve = (..._path: string[]) => path.resolve(packagePath, ..._path)

  // clear dist folder
  rimraf.sync(pathResolve('./dist/**/*'))

  if (!WATCH) {
    // build minify, don't build in watch mode
    await viteBuild(await changeConfigFn(minifyConfig, {packagePath, dtsOptions, report: REPORT, reportOptions}))
  }

  // build un minify
  await viteBuild(
    await changeConfigFn(unMinifyConfig, {
      genDts: true,
      watch: WATCH,
      packagePath,
      dtsOptions
    })
  )
}

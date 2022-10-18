// inlined stencil-webpack dependency from https://github.com/wstrinz/stencil-webpack/tree/output-base-option
// to include non-released PR

var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (error) {
          reject(error)
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value))
        } catch (error) {
          reject(error)
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : new P(function (resolve) {
              resolve(result.value)
            }).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
Object.defineProperty(exports, '__esModule', {value: true})
const path = require('node:path')
class StencilPlugin {
  constructor(options = {}) {
    this.outputBase = options.outputBase || ''
  }
  apply(compiler) {
    compiler.plugin('emit', (compilation, callback) => {
      this.fs = compiler.inputFileSystem
      this.inspectModules(compilation.assets, compilation.modules)
        .then(() => {
          callback()
        })
        .catch(error => {
          console.log('Webpack StencilPlugin Error:', error)
          callback()
        })
    })
  }
  inspectModules(assets, modules) {
    if (!assets || !Array.isArray(modules)) {
      return Promise.resolve()
    }
    return Promise.all(
      modules.map(m => {
        return this.addAppAssets(assets, m.resource)
      })
    )
  }
  addAppAssets(assets, filePath) {
    return __awaiter(this, void 0, void 0, function* () {
      if (typeof filePath !== 'string') {
        return Promise.resolve()
      }
      const appNamespace = path.basename(filePath, '.js')
      const appAssetsDir = path.join(path.dirname(filePath), appNamespace)
      // try to get a list of files in a sibling directory to this module file
      // an app will have a sibling directory with the same name as the filename
      // the readdir will not error at always return string[]
      const dirItems = yield this.readdir(appAssetsDir)
      // app directory will have a core file that starts with the app namespace
      const hasAppCore = dirItems.some(f => f.startsWith(appNamespace))
      if (!hasAppCore) {
        return Promise.resolve()
      }
      return this.addAppDirectory(assets, appNamespace, appAssetsDir, appAssetsDir)
    })
  }
  addAppDirectory(assets, appNamespace, appAssetsDir, dir) {
    return __awaiter(this, void 0, void 0, function* () {
      const dirItems = yield this.readdir(dir)
      return Promise.all(
        dirItems.map(dirItem => {
          const filePath = path.join(dir, dirItem)
          return this.addAppAsset(assets, appNamespace, appAssetsDir, filePath)
        })
      )
    })
  }
  addAppAsset(assets, appNamespace, appAssetsDir, filePath) {
    return __awaiter(this, void 0, void 0, function* () {
      const stats = yield this.readStat(filePath)
      if (stats.isDirectory()) {
        return this.addAppDirectory(assets, appNamespace, appAssetsDir, filePath)
      }
      const data = yield this.readFile(filePath)
      const assetPath = normalizePath(path.join(this.outputBase, appNamespace, path.relative(appAssetsDir, filePath)))
      assets[assetPath] = {
        source: () => data,
        size: () => stats.size
      }
      return Promise.resolve()
    })
  }
  readdir(dir) {
    return new Promise(resolve => {
      this.fs.readdir(dir, (err, files) => {
        if (err) {
          resolve([])
        } else {
          resolve(files)
        }
      })
    })
  }
  readFile(filePath) {
    return new Promise(resolve => {
      this.fs.readFile(filePath, (err, data) => {
        if (err) {
          resolve([])
        } else {
          resolve(data)
        }
      })
    })
  }
  readStat(filePath) {
    return new Promise((resolve, reject) => {
      this.fs.stat(filePath, (err, stats) => {
        if (err) {
          console.log(err)
          reject()
        } else {
          resolve(stats)
        }
      })
    })
  }
}
function normalizePath(str) {
  // Convert Windows backslash paths to slash paths: foo\\bar ➔ foo/bar
  // https://github.com/sindresorhus/slash MIT
  // By Sindre Sorhus
  const EXTENDED_PATH_REGEX = /^\\\\\?\\/
  // eslint-disable-next-line no-control-regex
  const NON_ASCII_REGEX = /[^\u0000-\u0080]+/
  const SLASH_REGEX = /\\/g
  if (EXTENDED_PATH_REGEX.test(str) || NON_ASCII_REGEX.test(str)) {
    return str
  }
  return str.replace(SLASH_REGEX, '/')
}

module.exports = (path = '.') => {
  return new StencilPlugin({
    collections: ['node-modules/@inovex.de/elements/dist'],
    outputBase: path
  })
}

/* eslint-disable unicorn/prefer-export-from */

import chalk from 'chalk'
import * as msw from 'msw'
import * as globby from 'globby'
import * as ora from 'ora'
import * as nodeFetch from 'node-fetch'
import * as fsExtra from 'fs-extra'
import * as rimraf from 'rimraf'
import * as mock from 'mockjs'
import * as buildUtils from './build-utils'

// vite
import * as viteReact from '@vitejs/plugin-react'
import * as viteInspect from 'vite-plugin-inspect'
import * as viteMock from 'vite-plugin-mock'
import * as viteTsconfigPaths from 'vite-tsconfig-paths'
import * as viteSvgr from 'vite-plugin-svgr'

export {
  chalk,
  msw,
  globby,
  ora,
  nodeFetch,
  fsExtra,
  rimraf,
  mock,
  buildUtils,

  // vite
  viteReact,
  viteInspect,
  viteMock,
  viteTsconfigPaths,
  viteSvgr
}

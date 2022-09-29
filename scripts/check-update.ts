import * as ncu from 'npm-check-updates'
import fs from 'node:fs'
import {packagesPaths, pathResolve} from './utils'

async function checkNpmPkgUpdate() {
  const rookPath = pathResolve('../')
  for (const packagePath of [rookPath, ...packagesPaths]) {
    const pkgJson = pathResolve(packagePath, 'package.json')
    if (!fs.existsSync(pkgJson)) continue
    await ncu.run({
      // Pass any cli option
      packageFile: pkgJson,
      upgrade: false,
      jsonUpgraded: false,
      silent: false
    })
  }
}

checkNpmPkgUpdate()

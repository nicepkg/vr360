import {copyFileSync, readFileSync, existsSync} from 'node:fs'
import {execSync} from 'node:child_process'
import path from 'node:path'
import globby from 'globby'

export const pathResolve = (..._path: string[]) => path.resolve(__dirname, ..._path)
export const pathResolveUnix = (..._path: string[]) => pathResolve(..._path).replace(/\\/g, '/')

export const packagesGlobPaths = pathResolveUnix('../packages/*/')
export const packagesPaths = globby.sync(packagesGlobPaths, {onlyFiles: false, onlyDirectories: true})
export const rootLicense = pathResolve('../', 'LICENSE')

export function copyFiles() {
  packagesPaths.map(packagePath => {
    const pkgJson = pathResolve(packagePath, 'package.json')
    const license = pathResolve(packagePath, 'LICENSE')

    if (!existsSync(pkgJson)) return

    const pkg: Record<string, string> = JSON.parse(readFileSync(pkgJson, 'utf8')) || {}
    if (pkg.private) return
    if (!existsSync(license)) copyFileSync(rootLicense, license)
  })
}

export type PackageInfo = {path: string; name: string}
export function getPackagesInfo(type: 'public' | 'all'): PackageInfo[] {
  return packagesPaths.reduce<PackageInfo[]>((pkgInfos: PackageInfo[], packagePath) => {
    const pkgJson = pathResolve(packagePath, 'package.json')

    if (!existsSync(pkgJson)) return pkgInfos

    const pkg: Record<string, string> = JSON.parse(readFileSync(pkgJson, 'utf8')) || {}

    if (type === 'public') {
      if (pkg.private) return pkgInfos
      return [
        ...pkgInfos,
        {
          path: packagePath,
          name: pkg.name
        }
      ]
    } else {
      return [
        ...pkgInfos,
        {
          path: packagePath,
          name: pkg.name
        }
      ]
    }
  }, [])
}

export function build() {
  const cmd = `pnpm run build:all`
  console.log('start run command:', cmd)
  execSync(cmd, {stdio: 'inherit'})
}

export function generateChangelog() {
  const pkgInfos = getPackagesInfo('all')

  for (const pkgInfo of pkgInfos) {
    const cmd = `pnpm exec conventional-changelog -p angular -i '${path.resolve(
      pkgInfo.path,
      './CHANGELOG.md'
    )}' -s --commit-path . -l ${pkgInfo.name} -r 0`
    console.log('start run command:', cmd)
    execSync(cmd, {stdio: 'inherit'})
  }
}

export function release() {
  generateChangelog()
  execSync('git add .', {stdio: 'inherit'})
  execSync(
    'pnpm exec bumpp package.json packages/*/package.json --push --tag --all --commit "build: the v%s release"',
    {
      stdio: 'inherit'
    }
  )
}

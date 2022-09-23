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

    const pkg: Record<string, string> = JSON.parse(readFileSync(pkgJson, 'utf8')) || {}
    if (pkg.private) return
    if (!existsSync(license)) copyFileSync(rootLicense, license)
  })
}

export function getPackagesName(type: 'public' | 'all') {
  return packagesPaths.reduce<string[]>((pkgNames, packagePath) => {
    const pkgJson = pathResolve(packagePath, 'package.json')

    const pkg: Record<string, string> = JSON.parse(readFileSync(pkgJson, 'utf8')) || {}

    if (type === 'public') {
      if (pkg.private) return pkgNames
      return [...pkgNames, pkg.name]
    } else {
      return [...pkgNames, pkg.name]
    }
  }, [])
}

export function build() {
  const cmd = `pnpm run build:all`
  console.log('start run command:', cmd)
  execSync(cmd, {stdio: 'inherit'})
}

export function generateChangelog() {
  const pkgNames = getPackagesName('all')

  for (const pkgName of pkgNames) {
    const cmd = `pnpm exec conventional-changelog -p angular -i CHANGELOG.md -s --commit-path . -l ${pkgName} -r 0`
    console.log('start run command:', cmd)
    execSync(cmd, {stdio: 'inherit', cwd: pathResolve('../packages', pkgName)})
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

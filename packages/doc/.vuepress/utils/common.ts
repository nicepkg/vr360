import rootPkg from '../../../../package.json'

export const version = rootPkg.version as string
export const isProd = process.env.NODE_ENV === 'production'

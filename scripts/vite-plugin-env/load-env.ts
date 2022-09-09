/* eslint-disable @typescript-eslint/no-explicit-any */
import path from 'path'
import fs from 'fs'
import dotenv from 'dotenv'
import {expand as dotenvExpand} from 'dotenv-expand'
import {validateKey} from './'

function lookupFile(dir: string, formats: string[], pathOnly = false): string | undefined {
  for (const format of formats) {
    const fullPath = path.join(dir, format)
    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
      return pathOnly ? fullPath : fs.readFileSync(fullPath, 'utf-8')
    }
  }
  const parentDir = path.dirname(dir)
  if (parentDir !== dir) {
    return lookupFile(parentDir, formats, pathOnly)
  }
}

interface LoadOptions {
  mode: string
  envDir: string
  prefix: string | RegExp
  ignoreProcessEnv: boolean
}

/**
 * use dotenv & dotenv-expand
 */
export function loadEnv(loadOptions: LoadOptions) {
  const {mode, envDir, prefix, ignoreProcessEnv} = loadOptions
  if (mode === 'local') {
    throw new Error(
      `"local" cannot be used as a mode name because it conflicts with ` + `the .local postfix for .env files.`
    )
  }

  const env: Record<string, string> = {}
  const envFiles = [
    /** mode local file */ `.env.${mode}.local`,
    /** mode file */ `.env.${mode}`,
    /** local file */ `.env.local`,
    /** default file */ `.env`
  ]

  // check if there are actual env variables starting with prefix
  // these are typically provided inline and should be prioritized
  for (const key in process.env) {
    if (validateKey(key, prefix) && env[key] === undefined) {
      env[key] = process.env[key] as string
    }
  }

  for (const file of envFiles) {
    const path = lookupFile(envDir, [file], true)
    if (path) {
      const parsed = dotenv.parse(fs.readFileSync(path))

      dotenv.config({
        debug: !!process.env.DEBUG || undefined
      })

      // let environment variables use each other
      dotenvExpand({
        parsed,
        // prevent process.env mutation
        ignoreProcessEnv
      } as any)

      // only keys that start with prefix are exposed to client
      for (const [key, value] of Object.entries(parsed)) {
        if (validateKey(key, prefix) && env[key] === undefined) {
          env[key] = value
        } else if (key === 'NODE_ENV') {
          // NODE_ENV override in .env file
          process.env.VITE_USER_NODE_ENV = value
        }
      }
    }
  }

  return env
}

/**
 * loadDynamicInjectedEnv.
 *
 * @param prefix - prefix of userland env var
 */
export function loadDynamicInjectedEnv(prefix: string | RegExp) {
  const env: Record<string, string> = {}
  Object.keys(process.env).map((envKey: keyof typeof process.env) => {
    if (validateKey(String(envKey), prefix)) {
      env[envKey] = process.env[envKey] || ''
    }
  })

  return env
}

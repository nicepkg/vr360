import {DEFAULT_EDITOR_DESCRIPTION, DEFAULT_EDITOR_TITLE} from './constant'
/* eslint-disable @typescript-eslint/no-explicit-any */
import path from 'node:path'
import type {Plugin} from '@vuepress/core'
import markdownItContainer from 'markdown-it-container'
import type {MarkdownEnv} from '@vuepress/markdown'
import type * as Token from 'markdown-it/lib/token'
import type * as Renderer from 'markdown-it/lib/renderer'
import type {CodeDemoProps} from './CodeDemo.props'
import type {ProjectFiles} from '@stackblitz/sdk'
import * as base64 from 'js-base64'

const pathResolve = (..._path: string[]) => path.resolve(__dirname, ..._path)

export type MarkdownItRenderFn = (
  tokens: Token[],
  index: number,
  options: any,
  env: MarkdownEnv,
  self: Renderer
) => string

export type CodeDemoOptions = {
  codeDemoMark?: string
  clickToLoad?: boolean
}

export type RenderPlaceFunction = (description: string, codeBlockTokens?: Token[]) => string

export const codeDemoPlugin = (options: CodeDemoOptions = {}): Plugin => {
  const {codeDemoMark = 'demo', clickToLoad = false} = options

  // const START_TYPE = `container_${codeDemoMark}_open`
  const END_TYPE = `container_${codeDemoMark}_close`
  const CODE_BLOCK_TYPE = 'fence'
  const START_NESTING = 1
  // const END_NESTING = -1

  const renderBefore: RenderPlaceFunction = (des, codeBlockTokens) => {
    const files: ProjectFiles = {}
    let openFile: string | undefined
    const [mode, title, description] = des.split('--').map(s => s.trim())

    if (codeBlockTokens && codeBlockTokens.length > 0) {
      codeBlockTokens.map(token => {
        const [lang, filename] = token.info.split(/\s+/)

        // 代码内容
        const codeContent = token.content

        // 最终文件名
        const _filename = filename.endsWith(`.${lang}`) ? filename : `${filename}.${lang}`

        if (!openFile) openFile = _filename

        files[_filename] = codeContent
      })
    }

    const options: CodeDemoProps = {
      mode,
      openFile,
      clickToLoad,
      project: {
        template: 'node',
        title: title || DEFAULT_EDITOR_TITLE,
        description: description || DEFAULT_EDITOR_DESCRIPTION,
        files
      }
    }
    const optionsBase64 = base64.encode(JSON.stringify(options))

    return `<div class="code-demo-wrapper ${codeDemoMark}"><code-demo-client v-bind="JSON.parse(base64.decode('${optionsBase64}'))">\n`
  }

  const renderAfter: RenderPlaceFunction = () => '</code-demo-client></div>\n'

  const descriptionsStack: string[] = []
  const render: MarkdownItRenderFn = (tokens, index, opts, env) => {
    const token = tokens[index]
    if (token.nesting === START_NESTING) {
      // `before` tag

      // resolve description (title)
      const description = token.info.trim().slice(codeDemoMark.length).trim() || DEFAULT_EDITOR_TITLE
      descriptionsStack.push(description)

      let i = index + 1
      const codeBlockTokens: Token[] = []
      while (tokens[i].type !== END_TYPE) {
        const nextToken = tokens[i]
        if (nextToken.type === CODE_BLOCK_TYPE) {
          codeBlockTokens.push(nextToken)
        }
        i++
      }

      return renderBefore(description, codeBlockTokens)
    } else {
      // `after` tag

      // pop the description from stack
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      const description = descriptionsStack.pop() || ''

      // render
      return renderAfter(description)
    }
  }

  const plugin: Plugin = {
    name: 'vuepress-plugin-code-demo',
    clientConfigFile: pathResolve('./clientConfigFile.ts').replace(/\\/g, '/'),
    extendsMarkdown: md => {
      md.use(markdownItContainer, codeDemoMark, {render})
    }
  }

  return plugin
}

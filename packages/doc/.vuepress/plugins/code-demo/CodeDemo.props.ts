import type {Project} from '@stackblitz/sdk'
import type {ExtractPropTypes, PropType} from 'vue'

export const getProps = () => ({
  mode: {
    type: String,
    default: 'node'
  },
  project: {
    type: Object as PropType<Project>
  },
  previewOnly: {
    type: Boolean,
    default: false
  },
  clickToLoad: {
    type: Boolean,
    default: false
  },
  openFile: {
    type: String,
    default: 'src/main.ts'
  }
})

export type CodeDemoProps = Partial<ExtractPropTypes<ReturnType<typeof getProps>>>

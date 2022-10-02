import type {ProjectFiles} from '@stackblitz/sdk'
import type {CodeDemoProps} from './CodeDemo.props'

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Window {
    loadCodeDemoOptions?: (preOptions: CodeDemoProps) => CodeDemoProps
    loadCodeDemoModeDefaultFiles?: (mode: string) => ProjectFiles | Promise<ProjectFiles>
  }
}

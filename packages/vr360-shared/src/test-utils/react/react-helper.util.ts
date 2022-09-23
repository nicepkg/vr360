import {mockGlobalApi} from '../common/mock-global-api'
import createFetchMock from 'vitest-fetch-mock'

export function commonSetup(options?: {title?: string}) {
  document.title = options?.title ?? 'React Starter'

  // Mock fetch
  createFetchMock(vi).enableMocks()

  mockGlobalApi()
}

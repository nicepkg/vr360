import {polyfillFetch, polyfillPointerEvents} from '@nicepkg/vr360-shared/test-utils'
import {setupVueSwitch} from '@nicepkg/vr360-shared/test-vue-utils'
import {beforeAll, beforeEach} from 'vitest'

polyfillFetch()
polyfillPointerEvents()

setupVueSwitch()

beforeAll(() => {
  setupVueSwitch()
})

beforeEach(() => {
  document.body.innerHTML = ''
  document.head.innerHTML = ''
})

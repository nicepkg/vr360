import nodeFetch from 'node-fetch'

export const polyfillFetch = () => {
  // @ts-expect-error override
  window.fetch = nodeFetch
}

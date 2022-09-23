/* eslint-disable @typescript-eslint/no-explicit-any */

declare global {
  type Writable<T> = {
    -readonly [P in keyof T]: T[P]
  }

  type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>
  }

  type TimeoutHandle = ReturnType<typeof setTimeout>
  type IntervalHandle = ReturnType<typeof setInterval>

  function parseInt(s: string | number, radix?: number): number

  function parseFloat(string: string | number): number
}

export {}

// Like `until` but works off of any assertion, not application code.
export const retry = (assertion: () => void, {interval = 1, timeout = 100} = {}) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now()

    const tryAgain = () => {
      setTimeout(() => {
        try {
          resolve(assertion())
        } catch (error) {
          Date.now() - startTime > timeout ? reject(error) : tryAgain()
        }
      }, interval)
      try {
        // If useFakeTimers hasn't been called, this will throw
        vitest.advanceTimersByTime(interval)
      } catch {
        /* Expected to throw */
      }
    }

    tryAgain()
  })
}

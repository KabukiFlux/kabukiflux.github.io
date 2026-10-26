const pending = new Map<string, Promise<void>>()

/** Injects a third-party script once and resolves when it has loaded. */
export function loadScript(src: string): Promise<void> {
  let promise = pending.get(src)
  if (!promise) {
    promise = new Promise<void>((resolve, reject) => {
      const script = document.createElement('script')
      script.src = src
      script.async = true
      script.onload = () => resolve()
      script.onerror = () => {
        pending.delete(src)
        script.remove()
        reject(new Error(`Failed to load ${src}`))
      }
      document.body.appendChild(script)
    })
    pending.set(src, promise)
  }
  return promise
}

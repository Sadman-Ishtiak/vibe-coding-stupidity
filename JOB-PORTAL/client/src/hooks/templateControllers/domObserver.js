function observePageWrapper(pageKey, onChange, timeoutMs = 1500) {
  const selector = pageKey ? `.page-wrapper[data-page="${pageKey}"]` : '.page-wrapper'

  let scheduled = false
  const schedule = () => {
    if (scheduled) return
    scheduled = true
    window.requestAnimationFrame(() => {
      scheduled = false
      onChange()
    })
  }

  // During SPA navigation, the previous `.page-wrapper` can stay mounted while the next
  // page loads. Observe a stable root until the correct wrapper exists, then switch.
  const stableRoot = document.body || document.documentElement || document

  let activeObserver = null
  const disconnect = () => {
    try {
      activeObserver?.disconnect()
    } catch {
      // ignore
    }
    activeObserver = null
  }

  const observe = (target) => {
    disconnect()
    const next = new MutationObserver(() => {
      const desired = document.querySelector(selector)
      if (desired && desired !== target) {
        observe(desired)
      }
      schedule()
    })
    next.observe(target, { childList: true, subtree: true })
    activeObserver = next
  }

  const initialTarget = document.querySelector(selector)
  observe(initialTarget || stableRoot)

  const timeout = window.setTimeout(() => disconnect(), timeoutMs)

  return () => {
    window.clearTimeout(timeout)
    disconnect()
  }
}

function getPageRoot(pageKey) {
  return document.querySelector(`.page-wrapper[data-page="${pageKey}"]`) || document
}

export { observePageWrapper, getPageRoot }

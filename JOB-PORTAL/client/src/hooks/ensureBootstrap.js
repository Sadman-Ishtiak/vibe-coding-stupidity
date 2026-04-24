let bootstrapPromise = null

export function ensureBootstrapLoaded() {
  if (!bootstrapPromise) {
    bootstrapPromise = import('bootstrap/dist/js/bootstrap.bundle.min.js')
  }
  return bootstrapPromise
}

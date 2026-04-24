export function ensureAssetPath(value) {
  if (!value) return value
  return value.startsWith('assets/') ? `/${value}` : value
}

export function mapHrefToRoute(href) {
  if (!href) return href
  if (href.startsWith('#')) return href
  if (href.startsWith('mailto:') || href.startsWith('tel:')) return href
  if (href.startsWith('javascript')) return '#'
  if (href === '/sign-out' || href === 'sign-out') return '/'
  if (href.endsWith('.html')) {
    const slug = href.replace('.html', '')
    if (slug === 'sign-out') return '/'
    return slug === 'index' ? '/' : `/${slug}`
  }
  if (href === 'index') return '/'
  if (href.startsWith('assets/')) return `/${href}`
  return href
}

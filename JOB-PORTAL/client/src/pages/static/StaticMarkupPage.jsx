import { useEffect, useMemo, useState } from 'react'
import parse, { domToReact } from 'html-react-parser'
import { Link, useNavigate } from 'react-router-dom'
import { useTemplateControllers } from '@/hooks/useTemplateControllers'
import JobListCard from '@/components/cards/JobListCard'
import JobGridCard from '@/components/cards/JobGridCard'
import CandidateListCard from '@/components/cards/CandidateListCard'
import CandidateGridCard from '@/components/cards/CandidateGridCard'
import CompanyCard from '@/components/cards/CompanyCard'
import RelatedJobCard from '@/components/cards/RelatedJobCard'
import CurrentOpeningJobCard from '@/components/cards/CurrentOpeningJobCard'
import { loadStaticPageMarkup } from '@/pages/static/registry'
import { navbarMarkup } from '@/components/common/navbarMarkup'
import { footerMarkup } from '@/components/common/footerMarkup'
import { DISTRICTS_64 } from '@/utils/staticTemplate/districts64'
import { BRAND_FROM_RE, BRAND_TO, replaceBrandText } from '@/utils/staticTemplate/brand'
import { ensureAssetPath, mapHrefToRoute } from '@/utils/staticTemplate/paths'
import { hydrateCandidateProfile } from '@/pages/static/hydrators/candidateProfile.hydrator'
import { hydrateJobApplyLock } from '@/pages/static/hydrators/jobDetails.hydrator'

const markupCache = new Map()

function StaticMarkupRenderer({ slug, markup }) {
  const navigate = useNavigate()
  useTemplateControllers(slug, { navigate })

  useEffect(() => {
    // Run after markup is mounted.
    const t = setTimeout(() => {
      if (slug === 'candidate-profile') hydrateCandidateProfile(document)
      if (slug === 'job-details') hydrateJobApplyLock(document)
    }, 0)

    return () => clearTimeout(t)
  }, [slug])

  const options = useMemo(() => {
    const opts = {}
    opts.replace = (node) => {
      // Replace visible brand text without changing layout/styles.
      if (node.type === 'text') {
        const parentName = node.parent && node.parent.name ? String(node.parent.name).toLowerCase() : ''
        if (parentName === 'script' || parentName === 'style') return undefined
        if (typeof node.data === 'string' && BRAND_FROM_RE.test(node.data)) {
          node.data = node.data.replace(BRAND_FROM_RE, BRAND_TO)
        }
        return undefined
      }

      if (node.type !== 'tag') return undefined

      if (node.name === 'job-list-card') {
        return <JobListCard />
      }
      if (node.name === 'job-grid-card') {
        return <JobGridCard />
      }
      if (node.name === 'candidate-list-card') {
        return <CandidateListCard />
      }
      if (node.name === 'candidate-grid-card') {
        return <CandidateGridCard />
      }
      if (node.name === 'company-card') {
        return <CompanyCard />
      }
      if (node.name === 'related-job-card') {
        return <RelatedJobCard />
      }
      if (node.name === 'current-opening-job-card') {
        return <CurrentOpeningJobCard />
      }

      const classList = String((node.attribs && node.attribs.class) || '')

      const hasJobGridBoxChild = Array.isArray(node.children)
        ? node.children.some(
            (child) => child?.type === 'tag' && String(child.attribs?.class || '').includes('job-box bookmark-post card mt-4')
          )
        : false

      if (node.name === 'div' && classList.includes('col-lg-6') && hasJobGridBoxChild) {
        return <JobGridCard />
      }
      const attribs = { ...(node.attribs || {}) }

      Object.keys(attribs).forEach((key) => {
        if (key.toLowerCase().startsWith('on')) {
          delete attribs[key]
        }
      })

      // Update brand text in safe attributes (doesn't affect routing/assets).
      if (attribs.title) attribs.title = replaceBrandText(attribs.title)
      if (attribs.alt) attribs.alt = replaceBrandText(attribs.alt)
      if (attribs.placeholder) attribs.placeholder = replaceBrandText(attribs.placeholder)
      if (attribs['aria-label']) attribs['aria-label'] = replaceBrandText(attribs['aria-label'])

      if (attribs.src) attribs.src = ensureAssetPath(attribs.src)
      if (attribs.href && !attribs.href.endsWith('.html')) attribs.href = ensureAssetPath(attribs.href)
      if (attribs['data-src']) attribs['data-src'] = ensureAssetPath(attribs['data-src'])
      if (attribs['data-background']) attribs['data-background'] = ensureAssetPath(attribs['data-background'])

      if (node.name === 'a') {
        const originalHref = String(attribs.href || '')
        const mappedHref = mapHrefToRoute(originalHref)

        if (originalHref.toLowerCase().includes('sign-out')) {
          attribs['data-internnova-action'] = attribs['data-internnova-action'] || 'signout'
        }

        if (mappedHref && mappedHref.startsWith('/') && !mappedHref.startsWith('/assets/')) {
          const { href: _href, ...rest } = attribs
          return (
            <Link {...rest} to={mappedHref}>
              {domToReact(node.children, opts)}
            </Link>
          )
        }
        attribs.href = mappedHref || '#'
      }

      if (node.name === 'img') {
        attribs.loading = attribs.loading || 'lazy'
      }

      // Inject districts into template's Choices select, if present.
      if (node.name === 'select' && attribs.id === 'choices-single-location') {
        const hasAnyRealOption =
          Array.isArray(node.children) &&
          node.children.some(
            (child) =>
              child && child.type === 'tag' && child.name === 'option' && String(child.attribs?.value || '').trim() !== ''
          )

        if (!hasAnyRealOption) {
          const { class: className, ...selectProps } = attribs
          return (
            <select {...selectProps} className={className} defaultValue="">
              <option value="">Select District</option>
              {DISTRICTS_64.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          )
        }
      }

      node.attribs = attribs
      return undefined
    }
    return opts
  }, [])

  const content = useMemo(() => parse(markup || '', options), [markup, options])

  return (
    <div className="page-wrapper" data-page={slug}>
      {content}
    </div>
  )
}

export default function StaticMarkupPage({ slug }) {
  const [page, setPage] = useState({ slug: null, markup: null })

  useEffect(() => {
    let cancelled = false

    async function load() {
      const cached = markupCache.get(slug)
      if (cached) {
        const next = { slug, markup: cached }
        setPage(next)
        return
      }

      // Avoid UI/layout flashes: keep previous markup mounted while loading the next page.
      let resolved = ''
      try {
        const pageMarkup = await loadStaticPageMarkup(slug)
        const fallback = pageMarkup ? null : await loadStaticPageMarkup('404-error')
        resolved = pageMarkup || fallback || ''
      } catch {
        const fallback = await loadStaticPageMarkup('404-error')
        resolved = fallback || ''
      }

      // Strip any inlined navbar/footer/back-to-top and re-insert common chrome to keep UI identical but deduped.
      const injectCommonChrome = (raw) => {
        if (!raw) return raw
        let next = raw
        next = next.replace(/<!--Navbar Start-->[\s\S]*?<!--Navbar End-->/i, '')
        next = next.replace(/<!-- START FOOTER -->[\s\S]*?<!-- END FOOTER -->/i, '')
        next = next.replace(/<!-- START FOOTER-ALT -->[\s\S]*?<!-- END FOOTER -->/i, '')
        next = next.replace(/<!-- START BACK TO TOP -->[\s\S]*?<!-- END BACK TO TOP -->/i, '')
        return `${navbarMarkup}${next}${footerMarkup}`
      }

      resolved = injectCommonChrome(resolved)

      if (cancelled) return
      markupCache.set(slug, resolved)

      const next = { slug, markup: resolved }
      setPage(next)
    }

    load()

    return () => {
      cancelled = true
    }
  }, [slug])

  if (!page.markup || page.slug !== slug) return null

  return <StaticMarkupRenderer slug={page.slug} markup={page.markup} />
}

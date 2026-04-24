import { Route, Routes } from 'react-router-dom'
import StaticMarkupPage from '@/pages/static/StaticMarkupPage'
import ProtectedRoute from '@/routes/ProtectedRoute'
import { STATIC_PAGE_SLUGS } from '@/pages/static/registry'

function pathFromSlug(slug) {
  return slug === 'index' ? '/' : `/${slug}`
}

const ADMIN_SLUGS = STATIC_PAGE_SLUGS.filter((slug) => slug.startsWith('admin-'))

function elementForSlug(slug) {
  const page = <StaticMarkupPage slug={slug} />
  if (ADMIN_SLUGS.includes(slug)) {
    return <ProtectedRoute requireAdmin>{page}</ProtectedRoute>
  }
  return page
}

export default function AppRoutes() {
  return (
    <Routes>
      {STATIC_PAGE_SLUGS.map((slug) => (
        <Route key={slug} path={pathFromSlug(slug)} element={elementForSlug(slug)} />
      ))}
      <Route path="*" element={<StaticMarkupPage slug="404-error" />} />
    </Routes>
  )
}

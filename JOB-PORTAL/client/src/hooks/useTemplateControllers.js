import { useEffect } from 'react'
import { ensureBootstrapLoaded } from '@/hooks/ensureBootstrap'
import { clearAuth, isAuthenticated, setAccountType, setAuthenticated, setAccessToken, getAccountType } from '@/services/auth.session'
import { forgotPassword, getMe, resetPassword, signIn, signOut, signUp } from '@/services/auth.service'
import { getJob, applyToJob } from '@/services/jobs.service'
import { listJobs } from '@/services/jobs.service'
import { listCompanies, getCompany } from '@/services/companies.service'
import { listCandidates, getCandidate } from '@/services/candidates.service'
import { observePageWrapper, getPageRoot } from '@/hooks/templateControllers/domObserver'

const POST_LOGIN_KEY = 'internnova.postLogin'
const CURRENT_USER_KEY = 'internnova.currentUser'
const RECRUITER_COMPANY_CACHE_KEY = 'internnova.recruiterCompany'

function readCurrentUser() {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function writeCurrentUser(user) {
  try {
    if (!user) {
      localStorage.removeItem(CURRENT_USER_KEY)
      return
    }
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
  } catch {
    // ignore
  }
}

function getUserId(user) {
  if (!user) return ''
  return String(user.id || user._id || '')
}

function getUserDisplayName(user) {
  if (!user) return ''
  return String(user.username || user.name || user.email || '')
}

function getNormalizedAccountType(user) {
  const raw = String(user?.accountType || user?.role || getAccountType() || '').toLowerCase()
  if (raw === 'company') return 'recruiter'
  return raw || 'candidate'
}

function readRecruiterCompanyCache() {
  try {
    const raw = localStorage.getItem(RECRUITER_COMPANY_CACHE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function writeRecruiterCompanyCache(payload) {
  try {
    if (!payload) {
      localStorage.removeItem(RECRUITER_COMPANY_CACHE_KEY)
      return
    }
    localStorage.setItem(RECRUITER_COMPANY_CACHE_KEY, JSON.stringify(payload))
  } catch {
    // ignore
  }
}

function normalizeAnyId(value) {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'object') return String(value.id || value._id || '')
  return String(value)
}

async function tryLinkRecruiterProfile(myProfileLink, userId) {
  if (!(myProfileLink instanceof HTMLAnchorElement)) return
  if (!userId) return

  // Default to an existing page even if we can't resolve a company.
  myProfileLink.setAttribute('href', '/company-list')

  const cached = readRecruiterCompanyCache()
  if (cached && String(cached.userId || '') === String(userId) && cached.companyId) {
    myProfileLink.setAttribute('href', `/company-details?id=${encodeURIComponent(String(cached.companyId))}`)
    return
  }

  try {
    const res = await listCompanies()
    const companies = Array.isArray(res?.data) ? res.data : []
    const match = companies.find((c) => {
      const recruiterId = normalizeAnyId(c?.recruiter)
      return recruiterId && recruiterId === String(userId)
    })
    const companyId = normalizeAnyId(match)
    if (companyId) {
      writeRecruiterCompanyCache({ userId: String(userId), companyId: String(companyId) })
      myProfileLink.setAttribute('href', `/company-details?id=${encodeURIComponent(String(companyId))}`)
    }
  } catch {
    // Keep fallback href
  }
}

function applyRoleBasedProfileMenu(profileMenu, user) {
  if (!(profileMenu instanceof Element)) return

  const accountType = getNormalizedAccountType(user)
  const isRecruiter = accountType === 'recruiter'

  const bookmarkItem = profileMenu.querySelector('[data-internnova-item="bookmark-jobs"]')
  const postJobItem = profileMenu.querySelector('[data-internnova-item="post-job"]')
  if (bookmarkItem instanceof HTMLElement) bookmarkItem.style.display = isRecruiter ? 'none' : ''
  if (postJobItem instanceof HTMLElement) postJobItem.style.display = isRecruiter ? '' : 'none'

  const myProfileLink = profileMenu.querySelector('a[data-internnova-item="my-profile"]')
  const id = getUserId(user)
  if (myProfileLink instanceof HTMLAnchorElement) {
    if (isRecruiter) {
      // Best-effort: link to this recruiter's company details when resolvable.
      void tryLinkRecruiterProfile(myProfileLink, id)
    } else {
      if (id) {
        myProfileLink.setAttribute('href', `/candidate-details?id=${encodeURIComponent(id)}`)
      } else {
        myProfileLink.setAttribute('href', '/candidate-profile')
      }
    }
  }
}

function updateHeaderAuthUi({ authed, user }) {
  // Token-Based Authentication: Menu visibility controlled by JWT/access token presence
  // Function to update UI - can be retried if elements not found
  const performUpdate = () => {
    const authMenu = document.getElementById('authMenu')
    const profileMenu = document.getElementById('profileMenu')

    if (!authMenu || !profileMenu) {
      // Elements not in DOM yet, retry after a short delay
      setTimeout(performUpdate, 50)
      return
    }

    // Check token-based authentication state
    const hasValidToken = authed && user
    
    if (hasValidToken) {
      // User has valid token - Hide auth menu, show profile menu (override Bootstrap d-flex !important)
      authMenu.style.setProperty('display', 'none', 'important')
      profileMenu.style.setProperty('display', 'flex', 'important')
      
      // Update user profile info
      const userDropdown = profileMenu.querySelector('a#userdropdown')
      if (userDropdown) {
        const nameSpan = userDropdown.querySelector('span.fw-medium')
        if (nameSpan) nameSpan.textContent = `Hi, ${getUserDisplayName(user) || 'User'}`

        const avatarImg = userDropdown.querySelector('img')
        const avatarSrc = user?.profileImageDataUrl || user?.profileImageUrl
        if (avatarImg instanceof HTMLImageElement && avatarSrc) {
          avatarImg.src = avatarSrc
        }

        applyRoleBasedProfileMenu(profileMenu, user)
      }
    } else {
      // No valid token - Show auth menu, hide profile menu (override Bootstrap d-flex !important)
      authMenu.style.setProperty('display', 'flex', 'important')
      profileMenu.style.setProperty('display', 'none', 'important')
    }
  }

  // Run immediately without waiting
  performUpdate()
}

// Initialize menu visibility immediately on page load (before React hydration)
if (typeof window !== 'undefined') {
  const initMenus = () => {
    const authMenu = document.getElementById('authMenu')
    const profileMenu = document.getElementById('profileMenu')
    
    if (authMenu && profileMenu) {
      const hasToken = Boolean(localStorage.getItem('internnova.accessToken'))
      if (hasToken) {
        authMenu.style.setProperty('display', 'none', 'important')
        profileMenu.style.setProperty('display', 'flex', 'important')
        // Immediately reflect cached username in greeting without waiting for hydration
        const cachedUser = readCurrentUser()
        const userDropdown = profileMenu.querySelector('a#userdropdown')
        const nameSpan = userDropdown && userDropdown.querySelector('span.fw-medium')
        if (nameSpan) {
          nameSpan.textContent = `Hi, ${getUserDisplayName(cachedUser) || 'User'}`
        }
        const avatarImg = userDropdown && userDropdown.querySelector('img')
        const avatarSrc = cachedUser?.profileImageDataUrl || cachedUser?.profileImageUrl
        if (avatarImg instanceof HTMLImageElement && avatarSrc) {
          avatarImg.src = avatarSrc
        }

        applyRoleBasedProfileMenu(profileMenu, cachedUser)
      } else {
        authMenu.style.setProperty('display', 'flex', 'important')
        profileMenu.style.setProperty('display', 'none', 'important')
      }
    }
  }
  
  // Run as soon as DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMenus)
  } else {
    initMenus()
  }
}

function rememberPostLoginApplyNow() {
  try {
    const payload = {
      pathname: window.location.pathname,
      search: window.location.search,
      hash: '#applyNow',
    }
    sessionStorage.setItem(POST_LOGIN_KEY, JSON.stringify(payload))
  } catch {
    // ignore
  }
}

function consumePostLogin() {
  try {
    const raw = sessionStorage.getItem(POST_LOGIN_KEY)
    if (!raw) return null
    sessionStorage.removeItem(POST_LOGIN_KEY)
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function getUrlParam(key) {
  try {
    const params = new URLSearchParams(window.location.search || '')
    return params.get(key) || ''
  } catch {
    return ''
  }
}

function setText(el, value) {
  if (!el) return
  el.textContent = value == null ? '' : String(value)
}

function setImageSrc(el, src) {
  if (!(el instanceof HTMLImageElement)) return
  if (src) el.src = src
}

function normalizeId(value) {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'object') {
    return value.id || value._id || ''
  }
  return String(value)
}

function getJobId(job) {
  return normalizeId(job?.id || job?._id)
}

function getCompanyIdFromJob(job) {
  const company = job?.companyId
  if (company && typeof company === 'object') return normalizeId(company)
  return normalizeId(company)
}

function getCompanyNameFromJob(job) {
  const company = job?.companyId
  return (company && typeof company === 'object' && company.name) || job?.companyName || ''
}

function getCompanyLogoFromJob(job) {
  const company = job?.companyId
  return (company && typeof company === 'object' && company.logoUrl) || job?.companyLogoUrl || ''
}

function safeSetLinkHref(a, href) {
  if (!(a instanceof HTMLAnchorElement)) return
  if (href) a.setAttribute('href', href)
}

function setOrKeepImage(img, src) {
  if (!(img instanceof HTMLImageElement)) return
  if (src) img.src = src
}

function fillBadges(container, badges) {
  if (!(container instanceof Element)) return
  const list = Array.isArray(badges) ? badges.filter(Boolean) : []
  const existing = Array.from(container.querySelectorAll('.badge'))
  if (existing.length === 0) return

  // Ensure at least one badge is present
  existing.forEach((b, idx) => {
    if (idx === 0) {
      b.textContent = list[0] || b.textContent || ''
      b.style.display = ''
    } else {
      b.style.display = 'none'
    }
  })

  // If we have more badges than 1, clone from the first badge to preserve styling.
  const base = existing[0]
  for (let i = 1; i < list.length; i += 1) {
    const clone = base.cloneNode(true)
    clone.textContent = list[i]
    clone.style.display = ''
    container.appendChild(clone)
  }
}

function hydrateJobBoxListItem(box, job) {
  if (!(box instanceof Element) || !job) return

  const jobId = getJobId(job)
  const companyId = getCompanyIdFromJob(job)
  const companyName = getCompanyNameFromJob(job)
  const companyLogo = getCompanyLogoFromJob(job)

  // Update logo + company link (first column)
  const logoLink = box.querySelector('a[href*="company-details"], a[href*="company-details.html"]')
  safeSetLinkHref(logoLink, companyId ? `/company-details?id=${encodeURIComponent(companyId)}` : '/company-details')
  const logoImg = logoLink?.querySelector('img') || box.querySelector('img')
  setOrKeepImage(logoImg, companyLogo)

  // Update title link
  const titleLink = box.querySelector('h5 a, h5.fs-18 a, h5.fs-17 a, h5.fs-16 a')
  safeSetLinkHref(titleLink, jobId ? `/job-details?id=${encodeURIComponent(jobId)}` : '/job-details')
  if (titleLink) setText(titleLink, job.title)

  // Company name
  const companyNameEl = box.querySelector('.col-md-3 p.text-muted, .col-lg-10 p.text-muted')
  if (companyNameEl) setText(companyNameEl, companyName)

  // Location
  const locationEl = Array.from(box.querySelectorAll('p.text-muted')).find((p) =>
    (p.textContent || '').toLowerCase().includes('california') ||
    (p.textContent || '').toLowerCase().includes('phoenix') ||
    (p.textContent || '').toLowerCase().includes('new york') ||
    (p.textContent || '').includes(','),
  )
  if (locationEl && job.location) {
    // Preserve the icon if present
    const icon = locationEl.querySelector('i')
    if (icon) {
      locationEl.innerHTML = `${icon.outerHTML} ${job.location}`
    } else {
      setText(locationEl, job.location)
    }
  }

  // Salary (grid/list share similar "wallet" line)
  const salaryEl = Array.from(box.querySelectorAll('p.text-muted')).find((p) => (p.textContent || '').includes('$'))
  if (salaryEl && job.salaryText) {
    const icon = salaryEl.querySelector('i')
    if (icon) {
      salaryEl.innerHTML = `${icon.outerHTML} ${job.salaryText}`
    } else {
      setText(salaryEl, job.salaryText)
    }
  }

  // Experience (list page footer)
  const experienceP = Array.from(box.querySelectorAll('p')).find((p) => (p.textContent || '').toLowerCase().includes('experience'))
  if (experienceP && job.experienceText) {
    experienceP.innerHTML = `<span class="text-dark">Experience :</span> ${job.experienceText}`
  }

  // Apply Now links should go to job details
  const applyLink = Array.from(box.querySelectorAll('a')).find((a) => (a.textContent || '').trim().toLowerCase().startsWith('apply now'))
  if (applyLink) {
    safeSetLinkHref(applyLink, jobId ? `/job-details?id=${encodeURIComponent(jobId)}` : '/job-details')
    // If this is a modal-trigger link, attach selected job id for company-details modal submit.
    if ((applyLink.getAttribute('href') || '') === '#applyNow') {
      applyLink.setAttribute('data-internnova-job-id', jobId)
    }
  }

  // Badges
  const badgeContainer = box.querySelector('.mt-2') || box.querySelector('.col-md-2')
  if (badgeContainer) fillBadges(badgeContainer, job.badges)
}

async function hydrateJobListPage(pageKey) {
  const root = getPageRoot(pageKey)
  const boxes = Array.from(root.querySelectorAll('.job-box'))
  if (boxes.length === 0) return false

  const template = boxes[0]
  const container = template.parentElement
  if (!container) return false

  // Fetch first page by default
  const response = await listJobs({ page: 1 })
  const jobs = Array.isArray(response?.data)
    ? response.data
    : Array.isArray(response?.data?.data)
    ? response.data.data
    : Array.isArray(response?.data?.data?.data)
    ? response.data.data.data
    : []
  const meta = response?.data?.meta || response?.data?.meta || response?.data?.data?.meta || null

  // Preserve template UI when there is no data yet.
  if (jobs.length === 0) return true

  // Clear existing boxes
  for (const b of Array.from(container.querySelectorAll('.job-box'))) b.remove()

  for (const job of jobs) {
    const clone = template.cloneNode(true)
    hydrateJobBoxListItem(clone, job)
    container.appendChild(clone)
  }

  attachJobFilters(root)
  attachPagination(root, meta, async (page) => {
    const resp = await listJobs({ page })
    const pageJobs = Array.isArray(resp?.data)
      ? resp.data
      : Array.isArray(resp?.data?.data)
      ? resp.data.data
      : Array.isArray(resp?.data?.data?.data)
      ? resp.data.data.data
      : []
    // clear and render
    for (const b of Array.from(container.querySelectorAll('.job-box'))) b.remove()
    for (const job of pageJobs) {
      const clone = template.cloneNode(true)
      hydrateJobBoxListItem(clone, job)
      container.appendChild(clone)
    }
  })

  return true
}

async function hydrateJobGridPage(pageKey) {
  const root = getPageRoot(pageKey)
  const firstBox = root.querySelector('.job-box')
  if (!firstBox) return false

  const firstCol = firstBox.closest('.col-lg-6')
  const row = firstCol?.parentElement
  if (!(row instanceof Element)) return false

  const columns = Array.from(row.querySelectorAll('.col-lg-6'))
  if (columns.length === 0) return false

  const response = await listJobs({ page: 1 })
  const jobs = Array.isArray(response?.data)
    ? response.data
    : Array.isArray(response?.data?.data)
    ? response.data.data
    : Array.isArray(response?.data?.data?.data)
    ? response.data.data.data
    : []
  const meta = response?.data?.meta || response?.data?.meta || response?.data?.data?.meta || null

  // Preserve template UI when there is no data yet.
  if (jobs.length === 0) return true

  const template = firstBox
  // Clear all job boxes from columns
  for (const col of columns) {
    for (const b of Array.from(col.querySelectorAll('.job-box'))) b.remove()
  }

  jobs.forEach((job, idx) => {
    const clone = template.cloneNode(true)
    hydrateJobBoxListItem(clone, job)
    const col = columns[idx % columns.length]
    col.appendChild(clone)
  })

  attachJobFilters(root)
  attachPagination(root, meta, async (page) => {
    const resp = await listJobs({ page })
    const pageJobs = Array.isArray(resp?.data)
      ? resp.data
      : Array.isArray(resp?.data?.data)
      ? resp.data.data
      : Array.isArray(resp?.data?.data?.data)
      ? resp.data.data.data
      : []
    // clear and re-render grid boxes
    for (const col of columns) {
      for (const b of Array.from(col.querySelectorAll('.job-box'))) b.remove()
    }
    pageJobs.forEach((job, idx) => {
      const clone = firstBox.cloneNode(true)
      hydrateJobBoxListItem(clone, job)
      const col = columns[idx % columns.length]
      col.appendChild(clone)
    })
  })

  return true
}

// Attach filter handlers for job-list and job-grid pages
function attachJobFilters(root) {
  try {
    const filterBtn = root.querySelector('a.btn.w-100')
    if (!filterBtn) return

    filterBtn.addEventListener('click', async (e) => {
      e.preventDefault()
      const searchInput = root.querySelector('.filter-job-input-box')
      const locationSelect = root.querySelector('#choices-single-location')
      const categorySelect = root.querySelector('#choices-single-categories')

      const filters = {}
      if (searchInput && searchInput.value) filters.location = searchInput.value
      if (locationSelect && locationSelect.value) filters.location = locationSelect.value
      if (categorySelect && categorySelect.options && categorySelect.value) filters.category = categorySelect.options[categorySelect.selectedIndex]?.text || categorySelect.value

      // Fetch filtered jobs and render
      const resp = await listJobs(filters)
      const jobs = Array.isArray(resp?.data) ? resp.data : Array.isArray(resp?.data?.data) ? resp.data.data : []

      const boxes = Array.from(root.querySelectorAll('.job-box'))
      if (boxes.length === 0) return
      const template = boxes[0]
      const container = template.parentElement
      if (!container) return

      // Clear existing boxes
      for (const b of Array.from(container.querySelectorAll('.job-box'))) b.remove()

      for (const job of jobs) {
        const clone = template.cloneNode(true)
        hydrateJobBoxListItem(clone, job)
        container.appendChild(clone)
      }
    })
  } catch (err) {
    // ignore
  }
}

function attachPagination(root, meta, onPage) {
  try {
    if (!meta || !meta.total) return
    const paginationEl = root.querySelector('.job-pagination')
    if (!paginationEl) return

    // Clear existing
    paginationEl.innerHTML = ''

    const total = Number(meta.total || 0)
    const page = Number(meta.page || 1)
    const pages = Number(meta.pages || Math.ceil(total / (meta.limit || 20)))

    const makeLi = (label, cls = '', dataPage = null) => {
      const li = document.createElement('li')
      li.className = `page-item ${cls}`.trim()
      const a = document.createElement('a')
      a.className = 'page-link'
      a.href = 'javascript:void(0)'
      a.textContent = label
      if (dataPage !== null) a.dataset.page = String(dataPage)
      li.appendChild(a)
      return li
    }

    // Prev
    const prevLi = makeLi('‹', page <= 1 ? 'disabled' : '', page - 1)
    paginationEl.appendChild(prevLi)

    const visible = Math.min(7, pages)
    const start = Math.max(1, page - Math.floor(visible / 2))
    const end = Math.min(pages, start + visible - 1)

    for (let p = start; p <= end; p++) {
      const li = makeLi(String(p), p === page ? 'active' : '', p)
      paginationEl.appendChild(li)
    }

    // Next
    const nextLi = makeLi('›', page >= pages ? 'disabled' : '', page + 1)
    paginationEl.appendChild(nextLi)

    // Attach click handler
    paginationEl.addEventListener('click', (e) => {
      const a = e.target.closest('a.page-link')
      if (!a) return
      const p = Number(a.dataset.page)
      if (!p || p < 1 || p > pages) return
      if (typeof onPage === 'function') onPage(p)
    })
  } catch (err) {
    // ignore
  }
}

async function hydrateCompanyListPage(pageKey) {
  const root = getPageRoot(pageKey)
  const firstCard = root.querySelector('.card.text-center.mb-4')
  const firstCol = firstCard?.closest('.col-lg-4')
  const row = firstCol?.parentElement
  if (!row || !firstCol || !firstCard) return false

  // Keep only one template sample in the DOM.
  const existingCols = Array.from(row.querySelectorAll('.col-lg-4.col-md-6'))
  for (const col of existingCols.slice(1)) col.remove()

  const [companiesRes, jobsRes] = await Promise.all([listCompanies(), listJobs()])
  const companies = Array.isArray(companiesRes?.data) ? companiesRes.data : []
  const jobs = Array.isArray(jobsRes?.data) ? jobsRes.data : []

  // Preserve template UI when there is no data yet.
  if (companies.length === 0) return true

  const templateCol = firstCol

  const countByCompanyId = new Map()
  for (const job of jobs) {
    const cid = getCompanyIdFromJob(job)
    if (!cid) continue
    countByCompanyId.set(cid, (countByCompanyId.get(cid) || 0) + 1)
  }

  const hydrateCompanyCard = (col, company) => {
    if (!(col instanceof Element) || !company) return
    const companyId = normalizeId(company)
    const card = col.querySelector('.card.text-center.mb-4')

    const img = card?.querySelector('img.img-fluid.rounded-3')
    setOrKeepImage(img, company.logoUrl)

    const nameLink = card?.querySelector('a.primary-link')
    safeSetLinkHref(nameLink, companyId ? `/company-details?id=${encodeURIComponent(companyId)}` : '/company-details')
    const nameH6 = nameLink?.querySelector('h6')
    if (nameH6) setText(nameH6, company.name)

    const locP = card?.querySelector('p.text-muted.mb-4')
    if (locP) setText(locP, company.location || '')

    const btn = card?.querySelector('a.btn.btn-primary')
    if (btn) {
      safeSetLinkHref(btn, companyId ? `/company-details?id=${encodeURIComponent(companyId)}` : '/company-details')
      const count = countByCompanyId.get(companyId) || 0
      setText(btn, `${count} Opening Jobs`)
    }
  }

  // Reuse the existing template column for the first company, then clone for the rest.
  hydrateCompanyCard(templateCol, companies[0])

  for (const company of companies.slice(1)) {
    const cloneCol = templateCol.cloneNode(true)
    hydrateCompanyCard(cloneCol, company)
    row.appendChild(cloneCol)
  }

  return true
}

async function hydrateCompanyDetailsPage(pageKey) {
  const companyId = getUrlParam('id')
  if (!companyId) return true

  const root = getPageRoot(pageKey)

  const [companyRes, jobsRes] = await Promise.all([getCompany(companyId), listJobs()])
  const company = companyRes?.data
  const jobs = Array.isArray(jobsRes?.data) ? jobsRes.data : []

  if (!company) return true

  // Sidebar header
  const sidebar = root.querySelector('.card.side-bar')
  const profile = sidebar?.querySelector('.candidate-profile')
  const avatar = profile?.querySelector('img.avatar-lg')
  setOrKeepImage(avatar, company.logoUrl)
  const nameH6 = profile?.querySelector('h6')
  if (nameH6) setText(nameH6, company.name)

  // Profile Overview
  const overview = sidebar?.querySelector('.candidate-profile-overview')
  if (overview) {
    const items = Array.from(overview.querySelectorAll('li'))
    for (const li of items) {
      const label = (li.querySelector('label')?.textContent || '').trim().toLowerCase()
      const valueP = li.querySelector('p')
      if (!valueP) continue

      if (label.includes('owner')) {
        setText(valueP, company.recruiter?.username || '')
      } else if (label.includes('location')) {
        setText(valueP, company.location || '')
      } else if (label.includes('website')) {
        setText(valueP, company.website || '')
      } else if (label.includes('established')) {
        const d = company.createdAt ? new Date(company.createdAt) : null
        setText(valueP, d ? d.toLocaleDateString() : '')
      }
    }
  }

  // About company
  const aboutHeader = Array.from(document.querySelectorAll('h6')).find((h) => (h.textContent || '').trim() === 'About Company')
  const aboutWrap = aboutHeader?.parentElement
  const aboutP = aboutWrap?.querySelector('p.text-muted')
  if (aboutP && company.description) setText(aboutP, company.description)

  // Current openings: reuse the existing job-box markup and swap content
  const openingsHeader = Array.from(document.querySelectorAll('h6')).find((h) => (h.textContent || '').includes('Current Opening'))
  const openingsWrap = openingsHeader?.parentElement
  const firstBox = openingsWrap?.querySelector('.job-box')
  if (firstBox) {
    const container = firstBox.parentElement
    const template = firstBox
    if (container) {
      const filtered = jobs.filter((j) => getCompanyIdFromJob(j) === companyId)

      // Preserve template UI when there are no openings.
      if (filtered.length === 0) return

      for (const b of Array.from(container.querySelectorAll('.job-box'))) b.remove()
      for (const job of filtered) {
        const clone = template.cloneNode(true)
        hydrateJobBoxListItem(clone, job)
        // Keep apply modal trigger link on company-details
        const applyLink = Array.from(clone.querySelectorAll('a')).find((a) => (a.getAttribute('href') || '') === '#applyNow')
        if (applyLink) {
          applyLink.setAttribute('data-bs-toggle', 'modal')
          applyLink.setAttribute('data-internnova-job-id', getJobId(job))
        }
        container.appendChild(clone)
      }
    }
  }

  return true
}

function wireCompanyDetailsApplyModal() {
  const modalEl = document.getElementById('applyNow')
  if (!modalEl) return

  let selectedJobId = ''

  const onSelectJob = (e) => {
    const target = e.target
    if (!(target instanceof Element)) return
    const link = target.closest('a[data-internnova-job-id]')
    if (link instanceof HTMLAnchorElement) {
      selectedJobId = link.getAttribute('data-internnova-job-id') || ''
    }
  }

  document.addEventListener('click', onSelectJob, true)

  const submitBtn = modalEl.querySelector('button[type="submit"]')
  if (!(submitBtn instanceof HTMLButtonElement)) {
    return () => document.removeEventListener('click', onSelectJob, true)
  }

  const onClick = async (e) => {
    e.preventDefault()

    if (!selectedJobId) {
      window.alert('Select a job to apply')
      return
    }

    if (!isAuthenticated()) {
      showErrorAlert(new Error('AUTH_REQUIRED'), 'Please sign in to apply')
      return
    }

    const nameEl = modalEl.querySelector('#nameControlInput')
    const emailEl = modalEl.querySelector('#emailControlInput2')
    const messageEl = modalEl.querySelector('#messageControlTextarea')

    const name = nameEl instanceof HTMLInputElement ? nameEl.value : ''
    const email = emailEl instanceof HTMLInputElement ? emailEl.value : ''
    const message = messageEl instanceof HTMLTextAreaElement ? messageEl.value : ''

    const resumeUrl = ''

    submitBtn.disabled = true
    try {
      const res = await applyToJob(selectedJobId, { name, email, message, resumeUrl })
      if (!res?.success) {
        window.alert(res?.message || 'Application failed')
        return
      }
      window.alert(res?.message || 'Application submitted')
    } catch (err) {
      showErrorAlert(err, 'Application failed')
    } finally {
      submitBtn.disabled = false
    }
  }

  submitBtn.addEventListener('click', onClick)
  return () => {
    document.removeEventListener('click', onSelectJob, true)
    submitBtn.removeEventListener('click', onClick)
  }
}

async function hydrateCandidateListPage(pageKey) {
  const root = getPageRoot(pageKey)
  const firstBox = root.querySelector('.candidate-list-box')
  const container = firstBox?.closest('.candidate-list')
  if (!firstBox || !container) return false

  // Keep only one template sample in the DOM.
  const existingBoxes = Array.from(container.querySelectorAll('.candidate-list-box'))
  for (const b of existingBoxes.slice(1)) b.remove()

  const response = await listCandidates()
  const candidates = Array.isArray(response?.data) ? response.data : []

  // Preserve template UI when there is no data yet.
  if (candidates.length === 0) return true

  const template = firstBox
  for (const b of Array.from(container.querySelectorAll('.candidate-list-box'))) b.remove()

  for (const c of candidates.slice(0, 1)) {
    const id = normalizeId(c)
    const clone = template.cloneNode(true)
    const nameLink = clone.querySelector('h5 a')
    if (nameLink) {
      safeSetLinkHref(nameLink, id ? `/candidate-details?id=${encodeURIComponent(id)}` : '/candidate-details')
      setText(nameLink, c.name || '')
    }
    const roleP = clone.querySelector('.candidate-list-content p.text-muted')
    if (roleP) setText(roleP, 'Candidate')
    container.appendChild(clone)
  }

  return true
}

async function hydrateCandidateGridPage(pageKey) {
  const root = getPageRoot(pageKey)
  const firstBox = root.querySelector('.candidate-grid-box')
  const firstCol = firstBox?.closest('.col-lg-4')
  const row = firstCol?.parentElement
  if (!firstBox || !row || !firstCol) return false

  // Keep only one template sample in the DOM.
  const existingCols = Array.from(row.querySelectorAll('.col-lg-4.col-md-6'))
  for (const col of existingCols.slice(1)) col.remove()

  const response = await listCandidates()
  const candidates = Array.isArray(response?.data) ? response.data : []

  // Preserve template UI when there is no data yet.
  if (candidates.length === 0) return true

  const templateCol = firstCol
  for (const col of Array.from(row.querySelectorAll('.col-lg-4.col-md-6'))) col.remove()

  for (const c of candidates.slice(0, 1)) {
    const id = normalizeId(c)
    const cloneCol = templateCol.cloneNode(true)
    const box = cloneCol.querySelector('.candidate-grid-box')
    const nameLink = box?.querySelector('a.primary-link')
    if (nameLink) {
      safeSetLinkHref(nameLink, id ? `/candidate-details?id=${encodeURIComponent(id)}` : '/candidate-details')
      const h5 = nameLink.querySelector('h5')
      if (h5) setText(h5, c.name || '')
    }
    row.appendChild(cloneCol)
  }

  return true
}

async function hydrateCandidateDetailsPage(pageKey) {
  const candidateId = getUrlParam('id')
  if (!candidateId) return true

  const root = getPageRoot(pageKey)

  const response = await getCandidate(candidateId)
  const c = response?.data
  if (!c) return true

  const sidebar = root.querySelector('.card.side-bar')
  const profile = sidebar?.querySelector('.candidate-profile')
  const nameH6 = profile?.querySelector('h6')
  if (nameH6) setText(nameH6, c.name || '')
  const roleP = profile?.querySelector('p.text-muted')
  if (roleP) setText(roleP, 'Candidate')

  const contact = sidebar?.querySelector('.candidate-contact-details')
  if (contact) {
    const emailBlock = Array.from(contact.querySelectorAll('h6')).find((h) => (h.textContent || '').trim().toLowerCase() === 'email')
    const emailP = emailBlock?.closest('div')?.querySelector('p.text-muted')
    if (emailP) setText(emailP, c.email || '')
  }

  return true
}

function showErrorAlert(err, fallback) {
  const message = err?.message || fallback || 'Request failed'
  window.alert(message)
}

async function hydrateJobDetailsPage(pageKey) {
  const jobId = getUrlParam('id')
  if (!jobId) return true

  const root = getPageRoot(pageKey)
  const card = root.querySelector('.card.job-detail')
  if (!card) return false

  const response = await getJob(jobId)
  if (!response?.success) return true
  const job = response.data
  if (!job) return true

  const titleEl = card.querySelector('h5.mb-1')
  setText(titleEl, job.title)

  // Logo in the header image overlay
  const logoImg = card.querySelector('.job-details-compnay-profile img')
  setImageSrc(logoImg, job.companyLogoUrl)

  // Experience
  const expBlock = Array.from(card.querySelectorAll('.border p.text-muted.fs-13')).find((p) =>
    (p.textContent || '').toLowerCase().includes('experience'),
  )
  const expValue = expBlock?.parentElement?.querySelector('p.fw-medium')
  if (expValue) setText(expValue, job.experienceText)

  // Salary
  const salaryBlock = Array.from(card.querySelectorAll('.border p.text-muted.fs-13')).find((p) =>
    (p.textContent || '').toLowerCase().includes('offer salary'),
  )
  const salaryValue = salaryBlock?.parentElement?.querySelector('p.fw-medium')
  if (salaryValue) setText(salaryValue, job.salaryText)

  // Description
  const descContainer = card.querySelector('.job-detail-desc')
  if (descContainer) {
    if (job.descriptionHtml) {
      descContainer.innerHTML = job.descriptionHtml
    } else if (job.notes) {
      descContainer.innerHTML = ''
      const p = document.createElement('p')
      p.className = 'text-muted mb-0'
      p.textContent = job.notes
      descContainer.appendChild(p)
    }
  }

  // Update any "View Profile" link to include company id when available.
  const viewProfileLink = root.querySelector('a.btn.btn-primary.btn-hover.w-100.rounded')
  if (viewProfileLink instanceof HTMLAnchorElement) {
    const base = '/company-details'
    const companyId = job.companyId || ''
    if (companyId) viewProfileLink.setAttribute('href', `${base}?id=${encodeURIComponent(companyId)}`)
  }

  return true
}

function wireApplyModalForJobDetails() {
  const jobId = getUrlParam('id')
  if (!jobId) return

  const modalEl = document.getElementById('applyNow')
  if (!modalEl) return

  const submitBtn = modalEl.querySelector('button[type="submit"]')
  if (!(submitBtn instanceof HTMLButtonElement)) return

  const onClick = async (e) => {
    e.preventDefault()
    if (!isAuthenticated()) {
      const err = new Error('AUTH_REQUIRED')
      err.code = 'AUTH_REQUIRED'
      throw err
    }

    const nameEl = modalEl.querySelector('#nameControlInput')
    const emailEl = modalEl.querySelector('#emailControlInput2')
    const messageEl = modalEl.querySelector('#messageControlTextarea')

    const name = nameEl instanceof HTMLInputElement ? nameEl.value : ''
    const email = emailEl instanceof HTMLInputElement ? emailEl.value : ''
    const message = messageEl instanceof HTMLTextAreaElement ? messageEl.value : ''

    const payload = { name, email, message, resumeUrl: '' }

    submitBtn.disabled = true
    try {
      const res = await applyToJob(jobId, payload)
      if (!res?.success) {
        window.alert(res?.message || 'Application failed')
        return
      }
      window.alert(res?.message || 'Application submitted')

      // Close modal (best-effort)
      try {
        const bootstrapModule = await ensureBootstrapLoaded()
        const Modal = bootstrapModule?.Modal || window.bootstrap?.Modal
        const instance = Modal?.getOrCreateInstance?.(modalEl)
        instance?.hide?.()
      } catch {
        // ignore
      }
    } catch (err) {
      showErrorAlert(err, 'Application failed')
    } finally {
      submitBtn.disabled = false
    }
  }

  submitBtn.addEventListener('click', onClick)
  return () => submitBtn.removeEventListener('click', onClick)
}

function normalizeJobsNavToSingleLink() {
  const jobsLink = document.getElementById('jobsdropdown')
  if (!(jobsLink instanceof HTMLAnchorElement)) return

  const navItem = jobsLink.closest('li.nav-item')
  if (navItem) {
    navItem.classList.remove('dropdown', 'dropdown-hover')
  }

  jobsLink.removeAttribute('data-bs-toggle')
  jobsLink.removeAttribute('aria-expanded')
  jobsLink.removeAttribute('role')
  jobsLink.setAttribute('href', '/job-list')
  jobsLink.innerHTML = 'Job'

  const dropdownMenu = (navItem || jobsLink.parentElement)?.querySelector('ul.dropdown-menu')
  if (dropdownMenu) dropdownMenu.remove()
}

function normalizeCandidatesNavToSingleLink() {
  const candidatesLink = document.getElementById('candidatedropdown')
  if (!(candidatesLink instanceof HTMLAnchorElement)) return

  const navItem = candidatesLink.closest('li.nav-item')
  if (navItem) {
    navItem.classList.remove('dropdown', 'dropdown-hover')
  }

  candidatesLink.removeAttribute('data-bs-toggle')
  candidatesLink.removeAttribute('aria-expanded')
  candidatesLink.removeAttribute('role')
  candidatesLink.setAttribute('href', '/candidate-list')
  candidatesLink.innerHTML = 'Candidates'

  const dropdownMenu = (navItem || candidatesLink.parentElement)?.querySelector('ul.dropdown-menu')
  if (dropdownMenu) dropdownMenu.remove()
}

function normalizeCompanyNavToSingleLink() {
  const companyLink = document.getElementById('companydropdown')
  if (!(companyLink instanceof HTMLAnchorElement)) return

  const navItem = companyLink.closest('li.nav-item')
  if (navItem) {
    navItem.classList.remove('dropdown', 'dropdown-hover')
  }

  companyLink.removeAttribute('data-bs-toggle')
  companyLink.removeAttribute('aria-expanded')
  companyLink.removeAttribute('role')
  companyLink.setAttribute('href', '/company-list')
  companyLink.innerHTML = 'Company'

  const dropdownMenu = (navItem || companyLink.parentElement)?.querySelector('ul.dropdown-menu')
  if (dropdownMenu) dropdownMenu.remove()
}

function removeExtraPagesNavItem() {
  const extraLink = document.getElementById('extrapagesdropdown')
  if (!(extraLink instanceof HTMLAnchorElement)) return
  const navItem = extraLink.closest('li.nav-item')
  if (navItem) navItem.remove()
}

function wireNavbarSingleLinks({ navigate } = {}) {
  const routeTo = (path) => {
    if (typeof navigate === 'function') {
      navigate(path)
    } else {
      window.location.assign(path)
    }
  }

  const onClickCapture = (e) => {
    const target = e.target
    if (!(target instanceof Element)) return

    const jobs = target.closest('#jobsdropdown')
    if (jobs) {
      e.preventDefault()
      e.stopPropagation()
      routeTo('/job-list')
      return
    }

    const candidates = target.closest('#candidatedropdown')
    if (candidates) {
      e.preventDefault()
      e.stopPropagation()
      routeTo('/candidate-list')
      return
    }

    const company = target.closest('#companydropdown')
    if (company) {
      e.preventDefault()
      e.stopPropagation()
      routeTo('/company-list')
    }
  }

  document.addEventListener('click', onClickCapture, true)
  return () => document.removeEventListener('click', onClickCapture, true)
}

function ensureFooterHasJobCategoriesLink() {
  const headings = Array.from(document.querySelectorAll('section.bg-footer p'))
  const forJobsHeading = headings.find((p) => (p.textContent || '').trim().toLowerCase() === 'for jobs')
  if (!forJobsHeading) return

  const footerItem = forJobsHeading.closest('.footer-item')
  if (!footerItem) return

  const list = footerItem.querySelector('ul.footer-list')
  if (!list) return

  const hasJobCategories = Array.from(list.querySelectorAll('a')).some((a) => {
    const href = a.getAttribute('href') || ''
    return href.includes('job-categories')
  })

  if (hasJobCategories) return

  const li = document.createElement('li')
  li.innerHTML = '<a href="job-categories.html"><i class="mdi mdi-chevron-right"></i> Browser Categories</a>'
  list.prepend(li)
}

const navStickyHandler = () => {
  const navbar = document.getElementById('navbar')
  if (!navbar) return
  if (document.body.scrollTop >= 50 || document.documentElement.scrollTop >= 50) {
    navbar.classList.add('nav-sticky')
  } else {
    navbar.classList.remove('nav-sticky')
  }
}

export function useTemplateControllers(pageKey, { navigate } = {}) {
  useEffect(() => {
    ensureBootstrapLoaded()
  }, [])

  useEffect(() => {
    const routeHome = () => {
      if (typeof navigate === 'function') {
        navigate('/', { replace: true })
      } else {
        window.location.assign('/')
      }
    }

    const performSignOut = async () => {
      try {
        await signOut()
      } catch {
        // ignore
      }
      clearAuth()
      writeCurrentUser(null)
      updateHeaderAuthUi({ authed: false, user: null })
      routeHome()
    }

    const onClickCapture = (e) => {
      const target = e.target
      if (!(target instanceof Element)) return

      const link = target.closest('a[data-internnova-action="signout"], a[href*="sign-out"], a[href*="sign-out.html"]')
      if (!(link instanceof HTMLAnchorElement)) return

      e.preventDefault()
      e.stopPropagation()
      if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation()
      performSignOut()
    }

    document.addEventListener('click', onClickCapture, true)
    return () => document.removeEventListener('click', onClickCapture, true)
  }, [navigate])

  useEffect(() => {
    if (pageKey === 'sign-out') {
      signOut().catch(() => {})
      clearAuth()
      writeCurrentUser(null)
      if (typeof navigate === 'function') {
        navigate('/', { replace: true })
      } else {
        window.location.assign('/')
      }
    }
  }, [pageKey, navigate])

  useEffect(() => {
    // Token-Based Authentication: Check for JWT/access token in localStorage
    const authed = isAuthenticated()

    let cancelled = false

    async function hydrate() {
      if (!authed) {
        // No token found - show login/register menu
        updateHeaderAuthUi({ authed: false, user: null })
        return
      }

      // Prefer cached user
      let user = readCurrentUser()
      if (!user) {
        try {
          const res = await getMe()
          user = res?.data || null
          if (user) {
            writeCurrentUser({
              id: getUserId(user),
              username: user.username,
              email: user.email,
              accountType: user.accountType || user.role || 'candidate',
              profileImageUrl: user.profileImageUrl || user.profilePicture || null,
            })
          }
        } catch {
          // Backend may not expose /auth/me; keep authed UI based on token
          user = { username: 'User', accountType: 'candidate' }
        }
      }

      if (!cancelled) updateHeaderAuthUi({ authed: true, user: user || readCurrentUser() })
    }

    hydrate()
    return () => {
      cancelled = true
    }
  }, [pageKey])

  useEffect(() => {
    if (pageKey !== 'sign-in' && pageKey !== 'sign-up' && pageKey !== 'reset-password') return undefined

    const form = document.querySelector('form.auth-form')
    if (!form) return undefined

    const onSubmit = async (e) => {
      e.preventDefault()

      const submitButton = form.querySelector('button[type="submit"]')
      if (submitButton instanceof HTMLButtonElement) submitButton.disabled = true

      const usernameEl = form.querySelector('#usernameInput')
      const passwordEl = form.querySelector('#passwordInput')
      const emailEl = form.querySelector('#emailInput')

      const username = usernameEl instanceof HTMLInputElement ? usernameEl.value : ''
      const password = passwordEl instanceof HTMLInputElement ? passwordEl.value : ''
      const email = emailEl instanceof HTMLInputElement ? emailEl.value : ''

      if (pageKey === 'sign-up') {
        const selected = form.querySelector('input[name="accountType"]:checked')
        const accountType = selected instanceof HTMLInputElement ? selected.value : 'candidate'
        setAccountType(accountType)

        try {
          const response = await signUp({ username, email, password, accountType })
          const token = response?.data?.accessToken || response?.data?.token || ''
          if (token) setAccessToken(token)
          const userFromApi = response?.data?.user || null
          const acct = userFromApi?.accountType || userFromApi?.role || accountType || 'candidate'
          setAccountType(acct)
          if (userFromApi) {
            const u = userFromApi
            const stored = {
              id: getUserId(u),
              username: u.username,
              email: u.email,
              accountType: u.accountType || u.role || acct,
              profileImageUrl: u.profileImageUrl || u.profilePicture || null,
            }
            writeCurrentUser(stored)
            // Immediately reflect logged-in UI
            updateHeaderAuthUi({ authed: true, user: stored })
          } else {
            updateHeaderAuthUi({ authed: true, user: { username: username || email, accountType: acct } })
          }
          setAuthenticated(true)
        } catch (err) {
          setAuthenticated(false)
          console.error(err)
          showErrorAlert(err, 'Sign up failed')
          if (submitButton instanceof HTMLButtonElement) submitButton.disabled = false
          return
        }
      } else if (pageKey === 'sign-in') {
        try {
          const response = await signIn({ email: username || email, password })
          const token = response?.data?.accessToken || response?.data?.token || ''
          if (token) setAccessToken(token)
          const userFromApi = response?.data?.user || null
          const acct = userFromApi?.accountType || userFromApi?.role || 'candidate'
          setAccountType(acct)
          if (userFromApi) {
            const u = userFromApi
            const stored = {
              id: getUserId(u),
              username: u.username,
              email: u.email,
              accountType: u.accountType || u.role || acct,
              profileImageUrl: u.profileImageUrl || u.profilePicture || null,
            }
            writeCurrentUser(stored)
            // Immediately reflect logged-in UI
            updateHeaderAuthUi({ authed: true, user: stored })
          } else {
            updateHeaderAuthUi({ authed: true, user: { username: username || email, accountType: acct } })
          }
          setAuthenticated(true)
        } catch (err) {
          setAuthenticated(false)
          console.error(err)
          showErrorAlert(err, 'Sign in failed')
          if (submitButton instanceof HTMLButtonElement) submitButton.disabled = false
          return
        }
      } else {
        // reset-password: keep UI unchanged; prompt for OTP + new password after sending OTP
        try {
          await forgotPassword({ email })
          const otp = window.prompt('Enter the 6-digit OTP sent to your email:') || ''
          const newPassword = window.prompt('Enter your new password:') || ''

          if (!otp.trim() || !newPassword) {
            window.alert('OTP and new password are required to reset.')
            if (submitButton instanceof HTMLButtonElement) submitButton.disabled = false
            return
          }

          await resetPassword({ email, otp: otp.trim(), password: newPassword })
          window.alert('Password reset successful')
          const link = form.closest('.auth-content')?.querySelector('a[href="sign-in.html"]')
          if (link instanceof HTMLAnchorElement) {
            window.location.assign('/sign-in')
          }
        } catch (err) {
          console.error(err)
          showErrorAlert(err, 'Reset password failed')
          if (submitButton instanceof HTMLButtonElement) submitButton.disabled = false
          return
        }
      }

      const postLogin = consumePostLogin()
      if (postLogin?.pathname) {
        const nextUrl = `${postLogin.pathname || '/'}${postLogin.search || ''}${postLogin.hash || ''}`
        if (typeof navigate === 'function') {
          navigate(nextUrl, { replace: true })
        } else {
          window.location.assign(nextUrl)
        }
        return
      }

      if (typeof navigate === 'function') {
        navigate('/', { replace: true })
      }

      if (submitButton instanceof HTMLButtonElement) submitButton.disabled = false
    }

    form.addEventListener('submit', onSubmit)
    return () => form.removeEventListener('submit', onSubmit)
  }, [pageKey, navigate])

  useEffect(() => {
    if (pageKey !== 'job-details') return undefined

    let cancelled = false

    let done = false
    let running = false

    const run = async () => {
      if (running) return
      running = true
      try {
        done = await hydrateJobDetailsPage(pageKey)
        if (cancelled) return
      } catch (err) {
        console.error(err)
      } finally {
        running = false
      }
    }

    run()

    const stop = observePageWrapper(
      pageKey,
      () => {
        if (!done) run()
      },
      2000
    )

    const cleanup = wireApplyModalForJobDetails()

    return () => {
      cancelled = true
      stop()
      if (typeof cleanup === 'function') cleanup()
    }
  }, [pageKey])

  useEffect(() => {
    let cancelled = false

    let done = false
    let running = false

    const run = async () => {
      if (running) return
      running = true
      try {
        if (pageKey === 'job-list') done = await hydrateJobListPage(pageKey)
        if (pageKey === 'job-grid') done = await hydrateJobGridPage(pageKey)
        if (pageKey === 'company-list') done = await hydrateCompanyListPage(pageKey)
        if (pageKey === 'company-details') done = await hydrateCompanyDetailsPage(pageKey)
        if (pageKey === 'candidate-list') done = await hydrateCandidateListPage(pageKey)
        if (pageKey === 'candidate-grid') done = await hydrateCandidateGridPage(pageKey)
        if (pageKey === 'candidate-details') done = await hydrateCandidateDetailsPage(pageKey)
      } catch (err) {
        console.error(err)
      } finally {
        running = false
      }
    }

    run()

    const shouldObserve =
      pageKey === 'job-list' ||
      pageKey === 'job-grid' ||
      pageKey === 'company-list' ||
      pageKey === 'company-details' ||
      pageKey === 'candidate-list' ||
      pageKey === 'candidate-grid' ||
      pageKey === 'candidate-details'

    const stop = shouldObserve
      ? observePageWrapper(
          pageKey,
          () => {
            if (!done) run()
          },
          2000
        )
      : () => {}

    const cleanup = pageKey === 'company-details' ? wireCompanyDetailsApplyModal() : undefined

    return () => {
      cancelled = true
      if (cancelled) {
        // noop; keeps lint happy
      }
      stop()
      if (typeof cleanup === 'function') cleanup()
    }
  }, [pageKey])

  useEffect(() => {
    if (isAuthenticated()) return undefined

    const routeToSignIn = () => {
      rememberPostLoginApplyNow()
      if (typeof navigate === 'function') {
        navigate('/sign-in', { replace: false })
      } else {
        window.location.assign('/sign-in')
      }
    }

    const onClickCapture = (e) => {
      const target = e.target
      if (!(target instanceof Element)) return

      const applyTrigger = target.closest(
        'a[href="#applyNow"], [data-bs-toggle="modal"][data-bs-target="#applyNow"], [data-bs-toggle="modal"][href="#applyNow"]',
      )
      if (applyTrigger) {
        e.preventDefault()
        // Bootstrap also listens on document; stop it from opening the modal.
        e.stopPropagation()
        if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation()
        routeToSignIn()
        return
      }

      const applyModal = target.closest('#applyNow')
      if (applyModal) {
        const sendButton = target.closest('button[type="submit"]')
        if (sendButton) {
          e.preventDefault()
          e.stopPropagation()
          if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation()
          routeToSignIn()
        }
      }
    }

    document.addEventListener('click', onClickCapture, true)
    return () => document.removeEventListener('click', onClickCapture, true)
  }, [pageKey, navigate])

  useEffect(() => {
    if (!isAuthenticated()) return undefined
    if (window.location.hash !== '#applyNow') return undefined

    let cancelled = false

    const openApplyModal = async () => {
      const modalEl = document.getElementById('applyNow')
      if (!modalEl) return

      const bootstrapModule = await ensureBootstrapLoaded()
      if (cancelled) return

      const Modal = bootstrapModule?.Modal || window.bootstrap?.Modal
      if (!Modal) return

      try {
        const instance = Modal.getOrCreateInstance(modalEl)
        instance.show()
      } catch {
        // ignore
      }
    }

    openApplyModal()
    return () => {
      cancelled = true
    }
  }, [pageKey])

  useEffect(() => {
    const authed = isAuthenticated()

    const setVisible = (el, visible) => {
      if (!el) return
      // Preserve template UI: just toggle display.
      el.style.display = visible ? '' : 'none'
    }

    const run = () => {
      const anchors = Array.from(document.querySelectorAll('a.dropdown-item'))

      for (const a of anchors) {
        const href = a.getAttribute('href') || ''
        const text = (a.textContent || '').trim().toLowerCase()

        const isSignIn = href.includes('sign-in') || text === 'sign in'
        const isSignUp = href.includes('sign-up') || text === 'sign up'
        // Keep Sign Out/Logout always visible (restored), but still show Sign In/Up when logged out.

        if (isSignIn || isSignUp) {
          setVisible(a, !authed)
        }
      }
    }

    run()
    return observePageWrapper(pageKey, run, 2000)
  }, [pageKey])

  useEffect(() => {
    const run = () => {
      normalizeJobsNavToSingleLink()
      normalizeCandidatesNavToSingleLink()
      normalizeCompanyNavToSingleLink()
      removeExtraPagesNavItem()
      ensureFooterHasJobCategoriesLink()
    }

    // `StaticPageRoute` intentionally keeps the previous page markup mounted while
    // loading the next one. That means DOM-based cleanup can run before the new
    // navbar exists, causing deleted dropdown items to "sometimes" reappear.
    // Re-run cleanup when the page wrapper mutates (short-lived observer).
    run()

    return observePageWrapper(pageKey, run, 2000)
  }, [pageKey])

  useEffect(() => wireNavbarSingleLinks({ navigate }), [pageKey, navigate])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pageKey])

  useEffect(() => {
    navStickyHandler()
    const onScroll = () => navStickyHandler()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [pageKey])

  useEffect(() => {
    const hideAllPreloaders = () => {
      const allPreloaders = Array.from(document.querySelectorAll('#preloader'))
      for (const el of allPreloaders) {
        if (!(el instanceof HTMLElement)) continue

        // Defensive: if malformed markup causes page content to be nested inside
        // `#preloader`, hiding it will also hide the navbar/content. In that case,
        // move any non-loader nodes out before hiding.
        const hasNavbar = !!el.querySelector('#navbar')
        const hasMainContent = !!el.querySelector('.main-content')
        if (hasNavbar || hasMainContent) {
          const parent = el.parentElement
          if (parent) {
            const keep = new Set(['status'])
            const toMove = Array.from(el.childNodes).filter((node) => {
              if (!(node instanceof Element)) return false
              const id = (node.getAttribute('id') || '').trim()
              return !keep.has(id)
            })

            for (const node of toMove) parent.insertBefore(node, el.nextSibling)
          }
        }

        // In SPA navigation, showing the template preloader can cause a "white page"
        // overlay and adds perceived latency. Keep it hidden.
        el.style.display = 'none'
        el.style.pointerEvents = 'none'
      }
    }

    hideAllPreloaders()
    const stop = observePageWrapper(pageKey, hideAllPreloaders, 2000)

    return () => {
      stop()
      hideAllPreloaders()
    }
  }, [pageKey])

  useEffect(() => {
    let cancelled = false
    let instances = []

    const destroyAll = () => {
      instances.forEach((instance) => instance?.destroy?.())
      instances = []
    }

    async function init() {
      const selects = Array.from(document.querySelectorAll('[data-trigger]'))
      if (!selects.length) return
      const { default: Choices } = await import('choices.js')
      if (cancelled) return

      destroyAll()
      instances = selects.map((el) => new Choices(el, { searchEnabled: true, shouldSort: false }))
    }

    init()
    const stop = observePageWrapper(pageKey, init, 2000)

    return () => {
      cancelled = true
      stop()
      destroyAll()
    }
  }, [pageKey])

  useEffect(() => {
    let cancelled = false
    let swipers = []

    const destroyAll = () => {
      swipers.forEach((instance) => instance?.destroy?.(true, true))
      swipers = []
    }

    async function init() {
      const hasTestimonial = Boolean(document.querySelector('.testimonialSlider'))
      const hasHomeSlider = Boolean(document.querySelector('.homeslider'))
      if (!hasTestimonial && !hasHomeSlider) return

      const { default: Swiper } = await import('swiper/bundle')
      if (cancelled) return

      destroyAll()

      if (hasTestimonial) {
        swipers.push(
          new Swiper('.testimonialSlider', {
            loop: true,
            pagination: {
              el: '.swiper-pagination',
              clickable: true,
            },
            autoplay: {
              delay: 2500,
              disableOnInteraction: false,
            },
            breakpoints: {
              200: {
                slidesPerView: 1,
                spaceBetween: 10,
              },
              992: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
            },
          }),
        )
      }

      if (hasHomeSlider) {
        swipers.push(
          new Swiper('.homeslider', {
            slidesPerView: 'auto',
            loop: true,
            spaceBetween: 20,
            autoplay: {
              delay: 2500,
              disableOnInteraction: false,
            },
          }),
        )
      }
    }

    init()
    const stop = observePageWrapper(pageKey, init, 2000)

    return () => {
      cancelled = true
      stop()
      destroyAll()
    }
  }, [pageKey])

  useEffect(() => {
    let cancelled = false
    let lightbox = null

    const destroy = () => {
      lightbox?.destroy?.()
      lightbox = null
    }

    async function init() {
      const targets = document.querySelectorAll('[data-glightbox]')
      if (!targets.length) return

      const { default: GLightbox } = await import('glightbox')
      if (cancelled) return

      destroy()
      lightbox = GLightbox({ selector: '[data-glightbox]' })
    }

    init()
    const stop = observePageWrapper(pageKey, init, 2000)

    return () => {
      cancelled = true
      stop()
      destroy()
    }
  }, [pageKey])
}

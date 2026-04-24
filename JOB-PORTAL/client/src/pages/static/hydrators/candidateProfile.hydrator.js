import { requestJson } from '@/services/api/httpClient'
import { getAccessToken } from '@/services/auth.session'
import { collectDynamicBlocks, initDynamicBlocks } from './profileFormManager'

const getApiBaseUrl = () => {
  const raw = import.meta.env.VITE_API_BASE_URL
  if (raw) return String(raw).replace(/\/$/, '')

  if (typeof window !== 'undefined' && window.location) {
    const protocol = window.location.protocol || 'http:'
    const hostname = window.location.hostname || 'localhost'
    return `${protocol}//${hostname}:5000/api`
  }

  return ''
}

const buildApiUrl = (path) => {
  const base = getApiBaseUrl()
  if (!base) return path
  return `${base}${path.startsWith('/') ? '' : '/'}${path}`
}

const safeText = (el, value) => {
  if (!el) return
  el.textContent = value == null || value === '' ? '' : String(value)
}

const findHeadingSection = (root, headingText) => {
  const headings = Array.from(root.querySelectorAll('h5'))
  const h = headings.find((x) => String(x.textContent || '').trim().toLowerCase() === headingText.toLowerCase())
  if (!h) return null
  return h.closest('div') || null
}

const findSettingsSectionByTitle = (root, titleText) => {
  const headings = Array.from(root.querySelectorAll('#settings h5'))
  const h = headings.find((x) => String(x.textContent || '').trim() === titleText)
  return h?.parentElement || null
}

function renderSettingsBlocks(root, type, fields, items = []) {
  const btnText = type === 'education' ? '+ Add Education' : '+ Add Experience'
  const addBtn = Array.from(root.querySelectorAll('#settings button')).find(
    (b) => String(b.textContent || '').trim() === btnText
  )
  if (!addBtn) return

  // Remove any existing blocks above the add button.
  const parent = addBtn.parentElement
  if (!parent) return

  const existingBlocks = Array.from(parent.querySelectorAll('div.mb-3'))
  existingBlocks.forEach((b) => b.remove())

  const safeItems = Array.isArray(items) && items.length ? items : [{}]
  safeItems.forEach((item) => {
    const block = document.createElement('div')
    block.className = 'mb-3'

    fields.forEach((field) => {
      if (field === 'description') {
        const textarea = document.createElement('textarea')
        textarea.className = 'form-control mb-2'
        textarea.rows = 3
        textarea.setAttribute(`data-${type}`, field)
        textarea.value = String(item?.[field] || '')
        block.appendChild(textarea)
        return
      }

      const input = document.createElement('input')
      input.className = 'form-control mb-2'
      input.setAttribute(`data-${type}`, field)
      input.value = String(item?.[field] || '')
      block.appendChild(input)
    })

    parent.insertBefore(block, addBtn)
  })
}

function setContact(root, label, value) {
  const labels = Array.from(root.querySelectorAll('.profile-sidebar label'))
  const l = labels.find((x) => String(x.textContent || '').trim() === label)
  const p = l?.parentElement?.querySelector('p')
  if (p) safeText(p, value || '-')
}

function setSocial(root, iconClass, link) {
  const icon = root.querySelector(`.profile-sidebar .uil-${iconClass}`)
  const a = icon?.closest('a')
  if (!a) return
  a.href = link || '#'
}

function renderEducation(root, list = []) {
  const containers = Array.from(root.querySelectorAll('.candidate-education-details'))
  const educationContainer =
    containers.find((c) => String(c.querySelector('h6')?.textContent || '').trim().toLowerCase() === 'education') ||
    containers[0]
  if (!educationContainer) return

  const title = educationContainer.querySelector('h6')
  educationContainer.innerHTML = ''
  if (title) educationContainer.appendChild(title)

  for (const e of Array.isArray(list) ? list : []) {
    const degree = String(e?.degree || '').trim()
    const letter = degree ? degree.charAt(0).toUpperCase() : '•'

    const institute = String(e?.institute || e?.institution || '').trim()
    const duration = String(e?.duration || '').trim()
    const yearRange =
      e?.startYear || e?.endYear
        ? `${String(e?.startYear || '').trim()}${e?.endYear ? ` - ${String(e.endYear).trim()}` : ''}`.trim()
        : ''
    const meta = [institute, duration || yearRange].filter(Boolean).join(' - ')

    const block = document.createElement('div')
    block.className = 'candidate-education-content mt-4 d-flex'
    block.innerHTML = `
      <div class="circle flex-shrink-0 bg-soft-primary">${letter}</div>
      <div class="ms-4">
        <h6 class="fs-16 mb-1">${escapeHtml(degree)}</h6>
        ${meta ? `<p class="mb-2 text-muted">${escapeHtml(meta)}</p>` : ''}
        ${e?.description ? `<p class="text-muted">${escapeHtml(String(e.description))}</p>` : ''}
      </div>
    `.trim()

    educationContainer.appendChild(block)
  }
}

function renderExperience(root, list = []) {
  const containers = Array.from(root.querySelectorAll('.candidate-education-details'))
  const experienceContainer =
    containers.find((c) => {
      const t = String(c.querySelector('h6')?.textContent || '').trim().toLowerCase()
      return t === 'experiences' || t === 'experience'
    }) || containers[1]
  if (!experienceContainer) return

  const title = experienceContainer.querySelector('h6')
  experienceContainer.innerHTML = ''
  if (title) experienceContainer.appendChild(title)

  for (const e of Array.isArray(list) ? list : []) {
    const jobTitle = String(e?.title || '').trim()
    const letter = jobTitle ? jobTitle.charAt(0).toUpperCase() : '•'

    const company = String(e?.company || '').trim()
    const duration = String(e?.duration || '').trim()
    const dateRange =
      e?.startDate || e?.endDate
        ? `${String(e?.startDate || '').trim()}${e?.endDate ? ` - ${String(e.endDate).trim()}` : ''}`.trim()
        : ''
    const meta = [company, duration || dateRange].filter(Boolean).join(' - ')

    const block = document.createElement('div')
    block.className = 'candidate-education-content mt-4 d-flex'
    block.innerHTML = `
      <div class="circle flex-shrink-0 bg-soft-primary">${letter}</div>
      <div class="ms-4">
        <h6 class="fs-16 mb-1">${escapeHtml(jobTitle)}</h6>
        ${meta ? `<p class="mb-2 text-muted">${escapeHtml(meta)}</p>` : ''}
        ${e?.description ? `<p class="text-muted">${escapeHtml(String(e.description))}</p>` : ''}
      </div>
    `.trim()

    experienceContainer.appendChild(block)
  }
}

function renderBadgesUnderHeading(root, headingText, badgeClassName, items = []) {
  const section = findHeadingSection(root, headingText)
  if (!section) return

  const existing = Array.from(section.querySelectorAll('span.badge'))
  existing.forEach((x) => x.remove())

  for (const item of Array.isArray(items) ? items : []) {
    const text = String(item || '').trim()
    if (!text) continue

    const span = document.createElement('span')
    span.className = badgeClassName
    span.textContent = text
    section.appendChild(span)
  }
}

function setSettingsValueByLabel(root, labelText, value) {
  const labels = Array.from(root.querySelectorAll('#settings label.form-label'))
  const l = labels.find((x) => String(x.textContent || '').trim() === labelText)
  const input = l?.nextElementSibling
  if (input && 'value' in input) input.value = value || ''
}

function getSettingsValueByLabel(root, labelText) {
  const labels = Array.from(root.querySelectorAll('#settings label.form-label'))
  const l = labels.find((x) => String(x.textContent || '').trim() === labelText)
  const input = l?.nextElementSibling
  return input && 'value' in input ? String(input.value || '') : ''
}

function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function renderProfileCompletion(root, percent) {
  const sidebarBody = root.querySelector('.profile-sidebar .card-body')
  if (!sidebarBody) return

  const clamped = Math.max(0, Math.min(100, Number(percent || 0)))

  let wrapper = root.getElementById ? root.getElementById('profileCompletion') : null
  if (!wrapper) wrapper = root.querySelector('#profileCompletion')

  if (!wrapper) {
    wrapper = document.createElement('div')
    wrapper.id = 'profileCompletion'
    wrapper.className = 'mt-4'
    wrapper.innerHTML = `
      <h6 class="fs-14 fw-bold mb-2">Profile Completion</h6>
      <div class="progress mb-1" style="height: 8px;">
        <div class="progress-bar bg-success" role="progressbar"></div>
      </div>
      <small class="text-muted"></small>
    `.trim()
    sidebarBody.appendChild(wrapper)
  }

  const bar = wrapper.querySelector('.progress-bar')
  if (bar) bar.style.width = `${clamped}%`
  const label = wrapper.querySelector('small.text-muted')
  if (label) label.textContent = `${clamped}% completed`
}

function renderApplyWarning(root, percent) {
  const overview = root.querySelector('#overview')
  if (!overview) return

  const existing = root.querySelector('#applyWarning')
  const clamped = Math.max(0, Math.min(100, Number(percent || 0)))

  if (clamped >= 100) {
    existing?.remove?.()
    return
  }

  if (existing) return

  const warning = document.createElement('div')
  warning.id = 'applyWarning'
  warning.className = 'alert alert-warning mt-3'
  warning.innerHTML = `
    <strong>Profile incomplete!</strong><br/>
    Complete your profile to 100% to apply for jobs.
  `.trim()

  overview.prepend(warning)
}

async function uploadFile(path, fieldName, file) {
  const token = getAccessToken()
  const url = buildApiUrl(path)

  const form = new FormData()
  form.append(fieldName, file)

  const headers = {}
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: form,
    credentials: 'include',
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `Upload failed (${res.status})`)
  }

  try {
    return await res.json()
  } catch {
    return null
  }
}

async function downloadAuthed(path, filename = 'resume') {
  const token = getAccessToken()
  const url = buildApiUrl(path)

  const headers = {}
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(url, { method: 'GET', headers, credentials: 'include' })
  if (!res.ok) throw new Error(`Download failed (${res.status})`)

  const blob = await res.blob()
  const objectUrl = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = objectUrl
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()

  setTimeout(() => URL.revokeObjectURL(objectUrl), 1500)
}

export async function hydrateCandidateProfile(root = document) {
  try {
    const payload = await requestJson('/users/me')
    const data = payload?.data || payload
    if (!data) return

    const overviewRoot = root.querySelector('#overview') || root

    renderProfileCompletion(root, data.profileCompletion)
    renderApplyWarning(root, data.profileCompletion)

    /* ================= SIDEBAR ================= */
    const sidebar = root.querySelector('.profile-sidebar')
    if (sidebar) {
      const nameEl = sidebar.querySelector('h5')
      safeText(nameEl, `${data.firstName || ''} ${data.lastName || ''}`.trim() || data.username || '')

      const designationEl = sidebar.querySelector('p.text-muted')
      safeText(designationEl, data.designation || '')

      const avatar = sidebar.querySelector('img.avatar-lg')
      if (avatar) avatar.src = data.profilePicture || '/assets/images/profile.jpg'

      setContact(root, 'Email', data.email)
      setContact(root, 'Phone Number', data.phone)
      setContact(root, 'Location', data.location)

      setSocial(root, 'facebook-f', data.socials?.facebook)
      setSocial(root, 'twitter-alt', data.socials?.twitter)
      setSocial(root, 'whatsapp', data.socials?.whatsapp)
      setSocial(root, 'phone-alt', data.socials?.phoneCall)

      const resumeLink = sidebar.querySelector('#downloadResume')
      if (resumeLink) {
        resumeLink.onclick = async (e) => {
          e.preventDefault()
          try {
            await downloadAuthed('/users/me/resume', 'resume')
          } catch (err) {
            console.error('Resume download failed', err)
          }
        }
      }
    }

    /* ================= OVERVIEW ================= */
    // Replace template About paragraphs with the saved profile About.
    const aboutH = Array.from(overviewRoot.querySelectorAll('h5')).find(
      (h) => String(h.textContent || '').trim() === 'About'
    )
    if (aboutH) {
      // Remove any consecutive <p> siblings after the About heading (template text).
      let node = aboutH.nextElementSibling
      while (node && String(node.tagName || '').toLowerCase() === 'p') {
        const next = node.nextElementSibling
        node.remove()
        node = next
      }

      const p = document.createElement('p')
      p.className = 'text-muted mt-4'
      p.textContent = String(data.about || '')
      aboutH.insertAdjacentElement('afterend', p)
    }

    renderEducation(overviewRoot, data.education || [])
    renderExperience(overviewRoot, data.experience || [])

    renderBadgesUnderHeading(overviewRoot, 'Skills', 'badge fs-13 bg-soft-blue mt-2', data.skills || [])
    renderBadgesUnderHeading(overviewRoot, 'Spoken languages', 'badge fs-13 bg-soft-success mt-2', data.languages || [])

    /* ================= SETTINGS FORM ================= */
    setSettingsValueByLabel(root, 'First Name', data.firstName || '')
    setSettingsValueByLabel(root, 'Last Name', data.lastName || '')
    setSettingsValueByLabel(root, 'Designation', data.designation || '')
    setSettingsValueByLabel(root, 'Email', data.email || '')
    setSettingsValueByLabel(root, 'Phone Number', data.phone || '')
    setSettingsValueByLabel(root, 'Location', data.location || '')

    const aboutSection = findSettingsSectionByTitle(root, 'About')
    const aboutTextarea = aboutSection?.querySelector('textarea') || null
    if (aboutTextarea) aboutTextarea.value = data.about || ''

    const skillsSection = findSettingsSectionByTitle(root, 'Skills')
    const skillsInput = skillsSection?.querySelector('input.form-control') || null
    if (skillsInput) skillsInput.value = Array.isArray(data.skills) ? data.skills.join(', ') : ''

    const languagesSection = findSettingsSectionByTitle(root, 'Languages')
    const languagesInput = languagesSection?.querySelector('input.form-control') || null
    if (languagesInput) languagesInput.value = Array.isArray(data.languages) ? data.languages.join(', ') : ''

    const socialInputs = Array.from(root.querySelectorAll('#settings input.form-control.mb-2'))
    const getByPlaceholder = (needle) => socialInputs.find((i) => String(i.getAttribute('placeholder') || '').trim() === needle) || null

    const facebook = getByPlaceholder('Facebook URL')
    if (facebook) facebook.value = data.socials?.facebook || ''

    const twitter = getByPlaceholder('Twitter URL')
    if (twitter) twitter.value = data.socials?.twitter || ''

    const whatsapp = getByPlaceholder('WhatsApp URL')
    if (whatsapp) whatsapp.value = data.socials?.whatsapp || ''

    const phoneCall = getByPlaceholder('Phone Call Link')
    if (phoneCall) phoneCall.value = data.socials?.phoneCall || ''

    // Render Education/Experience form blocks from DB data and then enable +Add / Remove.
    renderSettingsBlocks(root, 'education', ['degree', 'institute', 'duration', 'description'], data.education || [])
    renderSettingsBlocks(root, 'experience', ['title', 'company', 'duration', 'description'], data.experience || [])
    initDynamicBlocks(root)

    const settingsForm = root.querySelector('#settings form')
    if (settingsForm && !settingsForm.dataset.internnovaHydrated) {
      settingsForm.dataset.internnovaHydrated = 'true'

      const activateOverviewTab = () => {
        const overviewTabBtn = root.querySelector('#overview-tab')
        if (overviewTabBtn instanceof HTMLElement) {
          overviewTabBtn.click()
          return
        }

        // Fallback: toggle classes manually.
        const overviewPane = root.querySelector('#overview')
        const settingsPane = root.querySelector('#settings')
        if (overviewPane) {
          overviewPane.classList.add('active', 'show')
        }
        if (settingsPane) {
          settingsPane.classList.remove('active', 'show')
        }
      }

      settingsForm.addEventListener('submit', async (e) => {
        e.preventDefault()

        try {
          // uploads (optional)
          const fileInputs = Array.from(settingsForm.querySelectorAll('input[type="file"]'))
          const profilePictureInput = fileInputs[0] || null
          const resumeInput = fileInputs[1] || null

          if (profilePictureInput?.files?.[0]) {
            await uploadFile('/users/me/profile-picture', 'profilePicture', profilePictureInput.files[0])
          }
          if (resumeInput?.files?.[0]) {
            await uploadFile('/users/me/resume', 'resume', resumeInput.files[0])
          }

          const { education, experience } = collectDynamicBlocks(settingsForm)

          const skills = String(skillsInput?.value || '')
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)

          const languages = String(languagesInput?.value || '')
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)

          const payload = {
            firstName: getSettingsValueByLabel(root, 'First Name'),
            lastName: getSettingsValueByLabel(root, 'Last Name'),
            designation: getSettingsValueByLabel(root, 'Designation'),
            phone: getSettingsValueByLabel(root, 'Phone Number'),
            location: getSettingsValueByLabel(root, 'Location'),
            about: aboutTextarea?.value || '',
            education,
            experience,
            skills,
            languages,
            socials: {
              facebook: facebook?.value || '',
              twitter: twitter?.value || '',
              whatsapp: whatsapp?.value || '',
              phoneCall: phoneCall?.value || '',
            },
          }

          await requestJson('/users/me', { method: 'PUT', body: payload })
          await hydrateCandidateProfile(root)

          // Redirect UX back to Overview after save.
          activateOverviewTab()
        } catch (err) {
          console.error('Profile update failed', err)
        }
      })

      // password change
      const pwdInputs = Array.from(settingsForm.querySelectorAll('input[type="password"]'))
      const currentPwd = pwdInputs[0] || null
      const newPwd = pwdInputs[1] || null
      const confirmPwd = pwdInputs[2] || null

      const saveBtn = Array.from(settingsForm.querySelectorAll('button.btn.btn-primary')).find(
        (b) => String(b.textContent || '').trim().toLowerCase().includes('update profile')
      )

      // keep Update Profile button as-is; add password change on blur+enter not required
      if (currentPwd && newPwd && confirmPwd) {
        confirmPwd.addEventListener('keydown', async (ev) => {
          if (ev.key !== 'Enter') return
          ev.preventDefault()

          if (newPwd.value !== confirmPwd.value) {
            console.error('Password confirmation does not match')
            return
          }

          try {
            await requestJson('/users/me/change-password', {
              method: 'PUT',
              body: { currentPassword: currentPwd.value, newPassword: newPwd.value },
            })

            currentPwd.value = ''
            newPwd.value = ''
            confirmPwd.value = ''
          } catch (err) {
            console.error('Password change failed', err)
          }
        })
      }

      // silence unused warning in some bundlers
      void saveBtn
    }
  } catch (err) {
    console.error('Profile hydration failed', err)
  }
}

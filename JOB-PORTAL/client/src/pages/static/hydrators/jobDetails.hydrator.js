import { requestJson } from '@/services/api/httpClient'

const findApplyTrigger = (root) => {
  // Template uses an anchor that opens the apply modal.
  return (
    root.querySelector('.apply-job-btn') ||
    root.querySelector('a[href="#applyNow"][data-bs-toggle="modal"]') ||
    root.querySelector('[data-bs-toggle="modal"][data-bs-target="#applyNow"]') ||
    root.querySelector('[data-bs-toggle="modal"][href="#applyNow"]')
  )
}

export async function hydrateJobApplyLock(root = document) {
  try {
    const payload = await requestJson('/users/me')
    const data = payload?.data || payload

    const completion = Number(data?.profileCompletion ?? 0)
    if (!Number.isFinite(completion)) return
    if (completion >= 100) return

    const applyBtn = findApplyTrigger(root)
    if (applyBtn) {
      applyBtn.classList.add('disabled')
      applyBtn.setAttribute('aria-disabled', 'true')
      applyBtn.removeAttribute('data-bs-toggle')
      applyBtn.removeAttribute('data-bs-target')

      // Keep styling consistent; just replace text.
      applyBtn.textContent = `Complete Profile (${completion}%) to Apply`

      applyBtn.onclick = (e) => {
        e.preventDefault()
        window.alert('Please complete your profile to 100% before applying.')
      }
    }

    const modal = root.getElementById ? root.getElementById('applyNow') : root.querySelector('#applyNow')
    const submit = modal?.querySelector('button[type="submit"]')
    if (submit instanceof HTMLButtonElement) {
      submit.disabled = true
      submit.classList.add('disabled')
    }
  } catch {
    // Not signed in / not a candidate / API unavailable → no UX lock.
  }
}

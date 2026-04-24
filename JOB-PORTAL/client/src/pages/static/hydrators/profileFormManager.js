const findButtonByText = (root, needle) => {
  const buttons = Array.from(root.querySelectorAll('button'))
  return buttons.find((b) => String(b.textContent || '').trim() === needle) || null
}

const capitalize = (s) => String(s || '').charAt(0).toUpperCase() + String(s || '').slice(1)

export function initDynamicBlocks(root = document) {
  initBlock(root, 'education', ['degree', 'institute', 'duration', 'description'])
  initBlock(root, 'experience', ['title', 'company', 'duration', 'description'])
}

function initBlock(root, type, fields) {
  const addBtn = findButtonByText(root, `+ Add ${capitalize(type)}`)
  if (!addBtn) return

  const container = addBtn.previousElementSibling
  if (!container) return

  addBtn.onclick = () => {
    const block = document.createElement('div')
    block.className = 'mb-3'

    block.innerHTML = fields
      .map((field) => {
        const attr = `data-${type}="${field}"`
        if (field === 'description') {
          return `<textarea class="form-control mb-2" rows="3" ${attr}></textarea>`
        }
        return `<input class="form-control mb-2" ${attr}>`
      })
      .join('')

    const remove = document.createElement('button')
    remove.type = 'button'
    remove.className = 'btn btn-sm btn-danger'
    remove.textContent = 'Remove'
    remove.onclick = () => block.remove()

    block.appendChild(remove)
    container.parentElement?.insertBefore(block, addBtn)
  }
}

export function collectDynamicBlocks(root = document) {
  const education = collectGroup(root, 'education')
  const experience = collectGroup(root, 'experience')
  return { education, experience }
}

function collectGroup(root, type) {
  const nodes = Array.from(root.querySelectorAll(`[data-${type}]`))
  const items = []
  let current = null

  for (const el of nodes) {
    const field = el.dataset?.[type]
    if (!field) continue

    if (!current) current = {}
    current[field] = el.value

    if (field === 'description') {
      items.push(current)
      current = null
    }
  }

  return items
}

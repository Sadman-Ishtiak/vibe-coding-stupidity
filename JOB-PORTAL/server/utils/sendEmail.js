import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'

export const sendEmail = async ({ to, subject, html }) => {
  const host = process.env.SMTP_HOST
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  // Dev fallback: if SMTP not configured, log and skip sending to avoid crashing the request
  if (!host || !user || !pass) {
    console.warn('SMTP not configured. Writing email to disk for dev.', { to, subject })
    try {
      const outDir = path.join(process.cwd(), 'server', 'emails')
      fs.mkdirSync(outDir, { recursive: true })
      const filename = `${Date.now()}-${to.replace(/[@.]/g, '_')}-${subject.replace(/[^a-z0-9]/gi, '_')}.html`
      const filePath = path.join(outDir, filename)
      const content = `<!-- to: ${to} -->\n${html}`
      fs.writeFileSync(filePath, content, 'utf8')
      return
    } catch (err) {
      console.warn('Failed to write email to disk', err)
      return
    }
  }

  const transporter = nodemailer.createTransport({
    host,
    port: 587,
    secure: false,
    auth: {
      user,
      pass,
    },
  })

  await transporter.sendMail({
    from: `"InternNova" <${user}>`,
    to,
    subject,
    html,
  })
}

export const BRAND_FROM_RE = /InternNova/gi
export const BRAND_TO = 'InternNova'

export function replaceBrandText(value) {
  if (value == null) return value
  const str = String(value)
  return BRAND_FROM_RE.test(str) ? str.replace(BRAND_FROM_RE, BRAND_TO) : str
}

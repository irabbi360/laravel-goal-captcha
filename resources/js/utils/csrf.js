/**
 * Read the Laravel CSRF token from the most common sources:
 * 1. Meta tag:  <meta name="csrf-token" content="...">
 * 2. Cookie:    XSRF-TOKEN (URL-decoded, set by Laravel automatically)
 *
 * Returns null when running outside a browser (SSR / tests).
 *
 * @returns {string|null}
 */
export function getCsrfToken() {
  if (typeof document === 'undefined') return null

  // 1. Meta tag (set by @csrf / csrf_token() in Blade layouts)
  const meta = document.querySelector('meta[name="csrf-token"]')
  if (meta?.content) return meta.content

  // 2. XSRF-TOKEN cookie (Axios-style; Laravel sets this automatically for SPAs)
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith('XSRF-TOKEN='))

  if (match) {
    return decodeURIComponent(match.split('=')[1])
  }

  return null
}

/**
 * Build fetch headers that include the CSRF token when available.
 * @returns {Record<string, string>}
 */
export function jsonHeaders() {
  const headers = {
    'Content-Type':     'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'Accept':           'application/json',
  }

  const csrf = getCsrfToken()
  if (csrf) {
    headers['X-CSRF-TOKEN']  = csrf
    headers['X-XSRF-TOKEN']  = csrf
  }

  return headers
}

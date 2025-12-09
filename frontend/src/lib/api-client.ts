import { getSession, signIn } from 'next-auth/react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

/**
 * A robust API client that handles authentication and base path resolution.
 * @param endpoint The API endpoint to call, e.g., '/api/test' or '/api/admin/dashboard'.
 *                 The endpoint should include the '/api' prefix.
 * @param options Standard fetch options (method, body, etc.).
 */
async function apiClient(endpoint: string, options: RequestInit = {}) {
  const session = await getSession()

  const headers = new Headers(options.headers || {})

  if (session?.accessToken) {
    headers.set('Authorization', `Bearer ${session.accessToken}`)
  }

  // Handle session errors that occurred during a token refresh attempt.
  if (session?.error === 'RefreshAccessTokenError') {
    // Force sign-in to get a new, valid session.
    await signIn('keycloak')
    // Throw an error to stop the current, failing API call.
    throw new Error('Session expired. Please sign in again.')
  }

  // Construct the full URL: http://localhost:8001/app1/api/test
  const fullUrl = `${API_URL}${BASE_PATH}${endpoint}`

  const response = await fetch(fullUrl, { ...options, headers })

  // If the backend returns a 401, it means the token is invalid or expired.
  // This can happen if the backend is restarted or the user's session is revoked.
  // We trigger a re-login to fix the session.
  if (response.status === 401) {
    await signIn('keycloak')
    throw new Error('Your session has expired. Please sign in again.')
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      detail: response.statusText,
    }))
    throw new Error(errorData.detail || 'An API error occurred.')
  }

  // Handle responses with no content
  if (response.status === 204) {
    return null
  }

  return response.json()
}

export default apiClient

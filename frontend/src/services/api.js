const BASE_URL = 'http://localhost:8080/api'

function getToken() {
  return localStorage.getItem('coyote_token')
}

async function request(path, options = {}) {
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })

  if (res.status === 204) return null

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(data?.message || `Error ${res.status}`)
  }

  return data
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: 'DELETE' }),
  multipart: (path, formData, method = 'POST') => {
    const token = getToken()
    const headers = token ? { Authorization: `Bearer ${token}` } : {}
    return fetch(`${BASE_URL}${path}`, { method, body: formData, headers }).then(
      async (res) => {
        if (res.status === 204) return null
        const data = await res.json().catch(() => null)
        if (!res.ok) throw new Error(data?.message || `Error ${res.status}`)
        return data
      }
    )
  },
}

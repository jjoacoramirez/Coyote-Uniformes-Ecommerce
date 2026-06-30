const BASE_URL = 'http://localhost:8080/api'
const REQUEST_TIMEOUT = 15000

function getToken() {
  return localStorage.getItem('coyote_token')
}

// Envuelve fetch con un timeout que aborta la peticion para evitar
// spinners infinitos si el backend no responde, y traduce errores de red.
async function fetchWithTimeout(url, options) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)
  try {
    return await fetch(url, { ...options, signal: controller.signal })
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('La conexion tardo demasiado. Intenta nuevamente.', { cause: err })
    }
    throw new Error('No se pudo conectar con el servidor. Verifica tu conexion.', { cause: err })
  } finally {
    clearTimeout(timer)
  }
}

async function request(path, options = {}) {
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const res = await fetchWithTimeout(`${BASE_URL}${path}`, { ...options, headers })

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
    return fetchWithTimeout(`${BASE_URL}${path}`, { method, body: formData, headers }).then(
      async (res) => {
        if (res.status === 204) return null
        const data = await res.json().catch(() => null)
        if (!res.ok) throw new Error(data?.message || `Error ${res.status}`)
        return data
      }
    )
  },
}

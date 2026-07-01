import { store } from '../store/store.js'

const BASE_URL = 'http://localhost:8080/api'
const REQUEST_TIMEOUT = 15000

// El token sale del store de Redux (no se persiste en el navegador). Acceso en
// runtime, asi la dependencia circular store <-> api se resuelve sola.
function authHeader() {
  const token = store.getState().auth.token
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// Timeout sin AbortController/try-catch: el que pierda la carrera, gana.
function withTimeout(promise) {
  const timeout = new Promise((_, reject) =>
    setTimeout(
      () => reject(new Error('La conexion tardo demasiado. Intenta nuevamente.')),
      REQUEST_TIMEOUT
    )
  )
  return Promise.race([promise, timeout])
}

// Sin try/catch: los errores se propagan como rechazo de promesa y los
// captura el ciclo `rejected` del thunk que hizo la llamada.
function handleResponse(res) {
  if (res.status === 204) return null
  return res
    .json()
    .catch(() => null)
    .then((data) => {
      if (!res.ok) {
        return Promise.reject(new Error(data?.message || `Error ${res.status}`))
      }
      return data
    })
}

function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...authHeader(),
    ...options.headers,
  }
  return withTimeout(fetch(`${BASE_URL}${path}`, { ...options, headers })).then(handleResponse)
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: 'DELETE' }),
  multipart: (path, formData, method = 'POST') =>
    withTimeout(
      fetch(`${BASE_URL}${path}`, { method, body: formData, headers: authHeader() })
    ).then(handleResponse),
}

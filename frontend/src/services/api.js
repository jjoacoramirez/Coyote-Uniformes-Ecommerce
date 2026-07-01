import axios from 'axios'

const client = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 15000,
  withCredentials: true,
})

client.interceptors.response.use(
  (response) => (response.status === 204 ? null : response.data),
  (error) => {
    const message =
      error.response?.data?.message ||
      (error.code === 'ECONNABORTED'
        ? 'La conexion tardo demasiado. Intenta nuevamente.'
        : error.message)
    return Promise.reject(new Error(message))
  }
)

export const api = {
  get: (path, config) => client.get(path, config),
  post: (path, body, config) => client.post(path, body, config),
  put: (path, body, config) => client.put(path, body, config),
  delete: (path, config) => client.delete(path, config),
  multipart: (path, formData, method = 'POST') =>
    client.request({ url: path, method, data: formData }),
}

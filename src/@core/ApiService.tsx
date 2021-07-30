const BASE_PATH = "/api/v1"
let authToken = ""

function getHeaders(): Headers {
  const headers = new Headers()
  if (authToken.length) {
    headers.append("Authorization", "Bearer " + authToken)
  }
  headers.append("Content-Type", "application/json")
  return headers
}

function get<T>(path: string): Promise<T> {
  const headers = getHeaders()
  return fetch(BASE_PATH + path, {method: "GET", headers: headers}).then(r => r.json())
}

function post<T>(path: string, body: any): Promise<T> {
  const headers = getHeaders()
  return fetch(BASE_PATH + path, {method: "POST", headers: headers, body: JSON.stringify(body)}).then(r => r.json())
}

function del<T>(path: string): Promise<T> {
  const headers = getHeaders()
  return fetch(BASE_PATH + path, {method: "DELETE", headers: headers}).then(r => r.json())
}

export default {
  get,
  post,
  del,
  setAuthToken: (token: string) => {
    authToken = token
  }
}

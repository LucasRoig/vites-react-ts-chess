const BASE_PATH = "/api/v1"
let authToken = ""

const fetchWithError = async (input: RequestInfo, init?: RequestInit | undefined): Promise<Response>  => {
  return fetch(input, init).then(async response => {
    if (response.ok) {
      return response
    } else {
      throw new Error(await response.json())
    }
  })
}



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
  return fetchWithError(BASE_PATH + path, {method: "GET", headers: headers}).then(r => r.json())
}

function post<T>(path: string, body: any): Promise<T> {
  const headers = getHeaders()
  return fetchWithError(BASE_PATH + path, {method: "POST", headers: headers, body: JSON.stringify(body)}).then(r => r.json())
}

function del<T>(path: string): Promise<T> {
  const headers = getHeaders()
  return fetchWithError(BASE_PATH + path, {method: "DELETE", headers: headers}).then(r => r.json())
}

export default {
  get,
  post,
  del,
  setAuthToken: (token: string) => {
    authToken = token
  }
}

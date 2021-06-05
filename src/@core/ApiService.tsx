const BASE_PATH = "http://localhost:8000"
let authToken = ""
function get<T>(path: string): Promise<T> {
  const headers = new Headers()
  if (authToken.length) {
    headers.append("Authorization", "Bearer " + authToken)
  }
  return fetch(BASE_PATH + path, {method: "GET", headers: headers}).then(r => r.json())
}

export default {
  get,
  setAuthToken: (token: string) => {
    authToken = token
  }
}

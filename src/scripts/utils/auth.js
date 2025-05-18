export function checkToken() {
  const token = localStorage.getItem("authToken");
  return Boolean(token);
}

export function saveToken(token) {
  localStorage.setItem("authToken", token);
}

export function removeToken() {
  localStorage.removeItem("authToken");
}

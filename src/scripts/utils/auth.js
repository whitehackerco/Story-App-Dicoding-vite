export function checkToken() {
  const token = localStorage.getItem("token");
  return Boolean(token);
}

export function saveToken(token) {
  localStorage.setItem("token", token);
}

export function removeToken() {
  localStorage.removeItem("token");
}

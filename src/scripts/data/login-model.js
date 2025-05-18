export class LoginModel {
  async login(email, password) {
    const response = await fetch("https://story-api.dicoding.dev/v1/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login gagal!");
    }

    const result = await response.json();
    return result;
  }

  async register({ name, email, password }) {
    const response = await fetch("https://story-api.dicoding.dev/v1/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Registrasi gagal!");
    }
    return result;
  }
}

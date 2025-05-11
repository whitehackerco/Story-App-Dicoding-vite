export class LoginModel {
  async login(email, password) {
    const response = await fetch("https://example.com/login", {
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
}

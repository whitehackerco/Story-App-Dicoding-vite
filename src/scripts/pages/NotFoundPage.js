export default class NotFoundPage {
  async render() {
    return `
      <section class="not-found">
        <h2>404</h2>
        <p>Halaman tidak ditemukan.</p>
        <a href="#/" class="btn-cta">Kembali ke Beranda</a>
      </section>
    `;
  }
  async afterRender() {}
}

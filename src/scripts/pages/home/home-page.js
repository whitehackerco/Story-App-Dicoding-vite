export default class HomePage {
  async render() {
    return `
      <section class="container">
        <h1>Home Page</h1>
        <p>Selamat Datamh di Aplikasi!</p>
      </section>
    `;
  }

  async afterRender() {
    // Do your job here
  }
}

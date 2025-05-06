export default class AboutPage {
  async render() {
    return `
      <section class="container">
        <h1>About Page</h1>
        <p>Enaknya isi apa yah ini?</p>
      </section>
    `;
  }

  async afterRender() {
    // Do your job here
  }
}

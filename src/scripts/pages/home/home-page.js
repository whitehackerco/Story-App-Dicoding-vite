export default class HomePage {
  async render() {
    return `
      <section class="container">
        <h1>Home Page</h1>
        <p>Save Every Moment and SHARE! Your Happines.</p>
      </section>
    `;
  }

  async afterRender() {
    // Do your job here
  }
}

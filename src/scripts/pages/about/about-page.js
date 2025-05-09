export default class AboutPage {
  async render() {
    return `
       <section class="container about-page">
        <h1 class="about-title">About <span class="highlight">Share App</span></h1>
        <p class="about-description">
          <strong>Share</strong> is a web-based application that lets users post meaningful stories and photos. Users can also explore others’ stories across Indonesia. Built with love as part of <em>Dicoding's Front-End Web Development</em> class project.
        </p>

        <div class="about-card">
          <h2 class="about-subtitle">🚀 Main Features</h2>
          <ul class="about-list">
            <li><i class="fa-solid fa-user"></i> User Registration & Login</li>
            <li><i class="fa-solid fa-plus"></i> Add Story with Picture & Description</li>
            <li><i class="fa-solid fa-list"></i> Browse Stories</li>
            <li><i class="fa-solid fa-map"></i> Map Integration with Leaflet</li>
            <li><i class="fa-solid fa-arrows-spin"></i> View Transition API</li>
          </ul>
        </div>

        <div class="about-card">
          <h2 class="about-subtitle">🧰 Technology Used</h2>
          <ul class="about-list">
            <li><i class="fa-brands fa-vuejs"></i> Vite</li>
            <li><i class="fa-solid fa-code"></i> Vanilla JavaScript</li>
            <li><i class="fa-solid fa-file-code"></i> HTML & CSS</li>
            <li><i class="fa-solid fa-map-location-dot"></i> Leaflet.js</li>
            <li><i class="fa-solid fa-arrows-spin"></i> View Transition API</li>
            <li><i class="fa-solid fa-database"></i> REST API Dicoding</li>
          </ul>
        </div>

        <div class="about-card developer-card">
          <h2 class="about-subtitle">👩‍💻 About the Developer</h2>
          <p class="about-developer">
            <strong>Munabila Cintya</strong><br>
            Hello! I’m a student at <a href="https://www.dicoding.com" target="_blank">Dicoding</a> with a passion for learning and building impactful web apps.
          </p>
          <p class="about-developer">
            <i class="fa-brands fa-square-github"></i>
            <a href="https://github.com/whitehackerco" target="_blank">@whitehackerco</a>
          </p>
        </div>
      </section>
    `;
  }

  async afterRender() {
    // Do your job here
    window.scrollTo(0, 0);

    // 2. Animasi ketik untuk judul
    const title = document.querySelector(".about-title");
    const fullTitle = "About the App";
    title.textContent = "";
    let i = 0;
    const typeTitle = () => {
      if (i < fullTitle.length) {
        title.textContent += fullTitle.charAt(i);
        i++;
        setTimeout(typeTitle, 60);
      }
    };
    typeTitle();

    // 3. Tambah atribut data-aos ke elemen (kalau belum ada)
    document
      .querySelectorAll(
        ".about-subtitle, .about-description, .about-list li, .about-developer"
      )
      .forEach((el, index) => {
        el.setAttribute("data-aos", "fade-up");
        el.setAttribute("data-aos-delay", index * 100);
      });

    // 4. Inisialisasi atau refresh AOS
    if (typeof AOS !== "undefined") {
      AOS.init({ once: true });
    }
  }
}

export default class AboutPage {
  async render() {
    return `
      <section class="container about-page">
        <h1 class="about-title">About <span class="highlight">Share App</span></h1>
        <p class="about-description">
  <strong>Share</strong> is a web-based application that empowers users to post and share meaningful stories along with photos that capture special moments in their lives. More than just a platform for self-expression, Share also allows users to explore inspiring stories from others around the world — offering a window into different experiences, cultures, and perspectives. Each post includes essential details like the story’s description, photo, posting time, and even the location where it happened. With features like interactive maps, seamless transitions, and responsive design, <strong>Share</strong> is crafted with user experience in mind. This project is proudly built with love and dedication as part of the <em>Dicoding's Front-End Web Development</em> class.
</p>
        <div class="about-card" id="interactive-map-story">
          <h2 class="about-subtitle">🗺️ Interactive Map & Story Details</h2>
          <div class="about-feature-row">
            <div class="about-feature-text">
              <p class="about-description">
  The <strong>Share App</strong> features an <span class="highlight">interactive map</span> powered by Leaflet.js to showcase all stories with location data.<br>
  Each marker on the map represents a unique story, complete with a <strong>photo</strong>, <strong>description</strong>, <strong>timestamp</strong>, and <strong>user-provided location</strong>.<br>
  Simply click on any marker to view a brief preview of the story!
</p>
            </div>
            <div class="about-feature-image prominent-image">
              <img 
                src="./public/images/preview-map.png" 
                alt="Preview of map feature in Share App"
                class="preview-map prominent-img"
              />
            </div>
          </div>
          <div class="about-feature-row">
            <div class="about-feature-image prominent-image">
              <img 
                src="./public/images/story-preview.png" 
                alt="Preview of Story list in Share App"
                class="preview-story prominent-img"
              />
            </div>
            <div class="about-feature-text">
              <p class="about-description">
  In addition to the map, you can also <span class="highlight">browse a list of stories</span> shared by other users.<br>
  Each story displays a photo, the user's name, a description, the time it was posted, and the location (if available).
</p>
            </div>
          </div>
        </div>

        <div class="about-card">
          <h2 class="about-subtitle">🚀 Main Features</h2>
          <ul class="about-list">
            <li><i class="fa-solid fa-user" aria-hidden="true"></i> User Registration & Login</li>
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

    document
      .querySelectorAll(
        ".about-subtitle, .about-description, .about-list li, .about-developer"
      )
      .forEach((el, index) => {
        el.setAttribute("data-aos", "fade-up");
        el.setAttribute("data-aos-delay", index * 100);
      });

    const skipBtn = document.getElementById("skip-to-content");
    if (skipBtn) {
      skipBtn.style.display = "block";
      skipBtn.setAttribute("href", "#interactive-map-story");
      skipBtn.onclick = (e) => {
        e.preventDefault();
        const target = document.getElementById("interactive-map-story");
        if (target) {
          target.setAttribute("tabindex", "-1");
          target.focus();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      };
    }

    window.addEventListener("hashchange", () => {
      if (window.location.hash !== "#/about" && skipBtn) {
        skipBtn.style.display = "none";
      }
    });

    if (typeof AOS !== "undefined") {
      AOS.init({ once: true });
    }
  }
}

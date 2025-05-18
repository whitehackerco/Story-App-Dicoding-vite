import { HomePagePresenter } from "../../presenters/home-presenter";

export default class HomePage {
  async render() {
    return `
      <section class="container home-hero">
      <div class="hero-content">
      <h1>
      <span id="typewriter-main"></span><br>
      <span id="typewriter-sub"></span>
      </h1>
      <p class="hero-subtitle">Capture your best moments and share your stories with the world. It all starts with one click.</p>
        <div class="home-cta" id="cta-container"></div>
        </section>
    `;
  }

  async afterRender() {
    const presenter = new HomePagePresenter(this);
    presenter.setupCTA();

    const mainEl = document.getElementById("typewriter-main");
    const subEl = document.getElementById("typewriter-sub");

    if (!mainEl || !subEl) return;

    const mainText = "Capture Every Moment!";
    const subText = "Let's share your happiness.";

    let i = 0;
    const typeMain = () => {
      if (i < mainText.length) {
        mainEl.textContent += mainText.charAt(i);
        i++;
        setTimeout(typeMain, 60);
      } else {
        let j = 0;
        const typeSub = () => {
          if (j < subText.length) {
            subEl.textContent += subText.charAt(j);
            j++;
            setTimeout(typeSub, 50);
          }
        };
        typeSub();
      }
    };

    typeMain();
  }

  renderCTA(ctaLink) {
    const ctaHTML = `<a href="${ctaLink}" class="btn-cta">Let's Get Started</a>`;
    const ctaContainer = document.getElementById("cta-container");
    if (ctaContainer) {
      ctaContainer.innerHTML = ctaHTML;
    }
  }
}

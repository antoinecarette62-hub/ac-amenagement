/* ============================================================
   AC LIGNA — Layout partagé (header + footer)
   Injecté dans <div id="site-header"></div> et
   <div id="site-footer"></div> présents sur chaque page, pour
   éviter de dupliquer le HTML de la nav/footer partout.
   ============================================================ */

const LIENS_NAV = [
  { href: "collections.html", label: "Collections" },
  { href: "configurateur.html", label: "Configurateur" },
  { href: "a-propos.html", label: "À propos" },
  { href: "partenaires.html", label: "Partenaires" },
  { href: "contact.html", label: "Contact" },
];

function construireHeader() {
  const pageActuelle = location.pathname.split("/").pop() || "index.html";
  const liens = LIENS_NAV.map(
    (l) => `<a href="${l.href}" class="${pageActuelle === l.href ? "actif" : ""}">${l.label}</a>`
  ).join("");

  return `
    <nav class="nav" id="nav-principale">
      <div class="container">
        <a href="index.html" class="nav-logo">
          <img src="images/logo.png" alt="Ac Ligna" width="40" height="40" style="border-radius:999px;" />
        </a>
        <div class="nav-liens">${liens}</div>
        <div class="nav-droite">
          <a href="devis.html" class="btn btn-primaire btn-sm">Demander un devis</a>
        </div>
        <button class="nav-burger" id="btn-burger" aria-label="Ouvrir le menu" aria-expanded="false">
          <svg id="icone-burger" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          <svg id="icone-fermer" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:none;"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="nav-mobile" id="nav-mobile">${liens}<a href="devis.html" class="btn btn-primaire btn-sm mt-2">Demander un devis</a></div>
    </nav>`;
}

function construireFooter() {
  return `
    <footer>
      <div class="container footer-grille">
        <div class="footer-liens">
          <div>
            <h3>Collections</h3>
            <ul>
              <li><a href="collection.html?slug=nature">Nature</a></li>
              <li><a href="collection.html?slug=organique">Organique</a></li>
              <li><a href="collection.html?slug=geometrique">Géométrique</a></li>
            </ul>
          </div>
          <div>
            <h3>Services</h3>
            <ul>
              <li><a href="configurateur.html">Configurateur</a></li>
              <li><a href="devis.html">Demander un devis</a></li>
            </ul>
          </div>
          <div>
            <h3>Contact</h3>
            <ul>
              <li>06 45 38 13 00</li>
              <li>ac.ligna@hotmail.com</li>
              <li>Hauts-de-France</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="container footer-bas">
        <p>&copy; ${new Date().getFullYear()} Ac Ligna. Tous droits réservés.</p>
        <div class="flex gap-3"><a href="mentions-legales.html">Mentions légales</a><a href="confidentialite.html">Confidentialité</a></div>
      </div>
    </footer>`;
}

// Pages où le CTA sticky mobile n'a pas sa place : la page de devis elle-même
// (déjà l'action demandée), l'accueil (déjà deux CTA "devis" visibles,
// une barre sticky en plus fait trop insistant) et l'admin (usage interne).
const PAGES_SANS_CTA_STICKY = ["devis.html", "index.html"];

function construireCtaSticky() {
  return `
    <div class="cta-sticky-mobile" id="cta-sticky-mobile">
      <a href="devis.html" class="btn btn-primaire btn-full">Demander un devis →</a>
    </div>`;
}

function initLayout() {
  const header = document.getElementById("site-header");
  const footer = document.getElementById("site-footer");
  if (header) header.innerHTML = construireHeader();
  if (footer) footer.innerHTML = construireFooter();

  const pageActuelle = location.pathname.split("/").pop() || "index.html";
  const estAdmin = location.pathname.includes("/admin/");
  if (header && !estAdmin && !PAGES_SANS_CTA_STICKY.includes(pageActuelle)) {
    document.body.insertAdjacentHTML("beforeend", construireCtaSticky());
    document.body.classList.add("a-cta-sticky-mobile");
  }

  const nav = document.getElementById("nav-principale");
  const burger = document.getElementById("btn-burger");
  const navMobile = document.getElementById("nav-mobile");

  window.addEventListener("scroll", () => {
    if (!nav) return;
    nav.classList.toggle("scrolled", window.scrollY > 20);
  });

  if (burger && navMobile) {
    const iconeBurger = document.getElementById("icone-burger");
    const iconeFermer = document.getElementById("icone-fermer");

    function fermerMenu() {
      navMobile.classList.remove("ouvert");
      burger.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-ouvert");
      if (iconeBurger) iconeBurger.style.display = "block";
      if (iconeFermer) iconeFermer.style.display = "none";
    }

    burger.addEventListener("click", () => {
      const ouvert = navMobile.classList.toggle("ouvert");
      burger.setAttribute("aria-expanded", String(ouvert));
      document.body.classList.toggle("menu-ouvert", ouvert);
      if (iconeBurger) iconeBurger.style.display = ouvert ? "none" : "block";
      if (iconeFermer) iconeFermer.style.display = ouvert ? "block" : "none";
    });
    navMobile.querySelectorAll("a").forEach((lien) => {
      lien.addEventListener("click", fermerMenu);
    });
    // Cliquer n'importe où dans la zone du menu (pas juste sur un lien)
    // referme aussi le menu.
    navMobile.addEventListener("click", (e) => {
      if (e.target === navMobile) fermerMenu();
    });
  }
}

/* Animation d'apparition au scroll : ajoute .visible dès qu'un élément
   marqué .reveal entre dans le viewport. Exposée sur window pour que
   les pages puissent la relancer après avoir injecté du contenu
   dynamique (ex: cartes produits générées en JS). */
window.initReveal = function initReveal() {
  function marquerVisible(el) { el.classList.add("visible"); }

  const directs = document.querySelectorAll(".reveal:not(.visible)");
  const clipes = document.querySelectorAll(".reveal-net:not(.visible)");

  if (!("IntersectionObserver" in window)) {
    directs.forEach(marquerVisible);
    clipes.forEach(marquerVisible);
    return;
  }

  const observateur = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const enfants = entry.target.__revealNetEnfants;
        if (enfants) { enfants.forEach(marquerVisible); } else { marquerVisible(entry.target); }
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );

  directs.forEach((el) => observateur.observe(el));

  // Les éléments .reveal-net ont un clip-path à l'état initial : dans
  // certains moteurs, une aire visible nulle fausse le calcul
  // d'intersection de l'élément lui-même (il ne serait alors jamais
  // détecté comme visible). On observe donc leur parent, qui lui n'est
  // pas affecté par ce clip-path.
  const parents = new Map();
  clipes.forEach((el) => {
    const parent = el.parentElement || el;
    if (!parents.has(parent)) parents.set(parent, []);
    parents.get(parent).push(el);
  });
  parents.forEach((enfants, parent) => {
    parent.__revealNetEnfants = enfants;
    observateur.observe(parent);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initLayout();
  window.initReveal();
});

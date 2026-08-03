/* ============================================================
   AC AMÉNAGEMENT — Back-office
   ------------------------------------------------------------
   Le mot de passe n'est plus stocké dans ce fichier : il est
   vérifié côté serveur par le Cloudflare Worker (variable
   ADMIN_PASSWORD). Le Worker répond avec un jeton de session que
   l'on stocke ici (sessionStorage) et qu'on renvoie nous-mêmes via
   l'en-tête Authorization sur chaque appel — pas de cookie, car le
   site (github.io) et le Worker (workers.dev) sont deux domaines
   différents et les navigateurs bloquent de plus en plus les
   cookies cross-site, même en SameSite=None.
   ============================================================ */

const WORKER_URL = "https://ac-amenagement-admin.antoine-carette62.workers.dev";
const CLE_JETON = "ac_amenagement_admin_jeton";

async function estConnecte() {
  const jeton = sessionStorage.getItem(CLE_JETON);
  if (!jeton) return false;
  try {
    const reponse = await fetch(`${WORKER_URL}/session`, {
      headers: { Authorization: `Bearer ${jeton}` },
    });
    if (!reponse.ok) return false;
    const donnees = await reponse.json();
    return !!donnees.authentifie;
  } catch (err) {
    return false;
  }
}

/** Retourne "ok", "mot-de-passe" (refusé par le serveur) ou "connexion" (serveur injoignable). */
async function connecter(motDePasse) {
  try {
    const reponse = await fetch(`${WORKER_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: motDePasse }),
    });
    if (!reponse.ok) return "mot-de-passe";
    const donnees = await reponse.json();
    if (!donnees.token) return "connexion";
    sessionStorage.setItem(CLE_JETON, donnees.token);
    return "ok";
  } catch (err) {
    return "connexion";
  }
}

function deconnecter() {
  sessionStorage.removeItem(CLE_JETON);
  location.href = "login.html";
}

/** Doit être appelé en haut de chaque page admin (sauf login.html). */
async function exigerConnexion() {
  if (!(await estConnecte())) {
    location.href = "login.html";
  }
}

const LIENS_ADMIN = [
  { href: "index.html", label: "Tableau de bord" },
  { href: "collections.html", label: "Collections" },
  { href: "produits.html", label: "Produits" },
];

function construireSidebarAdmin() {
  const pageActuelle = location.pathname.split("/").pop() || "index.html";
  const liens = LIENS_ADMIN.map(
    (l) => `<a href="${l.href}" class="${pageActuelle === l.href ? "actif" : ""}">${l.label}</a>`
  ).join("");

  return `
    <div class="admin-topbar">
      <a href="index.html" class="nav-logo">AC <span class="gold-text">Admin</span></a>
      <button id="admin-burger" aria-label="Ouvrir le menu">☰</button>
    </div>
    <aside class="admin-sidebar" id="admin-sidebar">
      <a href="index.html" class="nav-logo admin-sidebar-logo">AC <span class="gold-text">Admin</span></a>
      <nav class="admin-nav">${liens}</nav>
      <button class="btn btn-secondaire btn-sm mt-6" id="btn-deconnexion">Se déconnecter</button>
    </aside>`;
}

function initAdminLayout() {
  const cible = document.getElementById("admin-layout");
  if (!cible) return;
  cible.insertAdjacentHTML("afterbegin", construireSidebarAdmin());

  document.getElementById("btn-deconnexion").addEventListener("click", deconnecter);
  const burger = document.getElementById("admin-burger");
  const sidebar = document.getElementById("admin-sidebar");
  burger.addEventListener("click", () => sidebar.classList.toggle("ouvert"));
}

document.addEventListener("DOMContentLoaded", initAdminLayout);

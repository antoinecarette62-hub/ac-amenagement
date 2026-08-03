/* ============================================================
   AC AMÉNAGEMENT — Back-office (démo)
   ------------------------------------------------------------
   ⚠️ AVERTISSEMENT DE SÉCURITÉ IMPORTANT
   Ce "login" est un gate purement côté client, pour la démo.
   Le mot de passe est visible en clair dans ce fichier JS, que
   n'importe qui peut lire depuis le navigateur (Ctrl+U). Il
   n'y a AUCUNE vraie sécurité ici — ne jamais utiliser cette
   page pour protéger de vraies données sensibles. Pour un vrai
   site en production, il faut un serveur avec une authentification
   côté serveur (comme dans la version Next.js/Prisma du projet).
   ============================================================ */

const MOT_DE_PASSE_ADMIN = "13Veatresh!";
const CLE_SESSION = "ac_amenagement_admin_connecte";

function estConnecte() {
  return sessionStorage.getItem(CLE_SESSION) === "oui";
}

function connecter(motDePasse) {
  if (motDePasse === MOT_DE_PASSE_ADMIN) {
    sessionStorage.setItem(CLE_SESSION, "oui");
    return true;
  }
  return false;
}

function deconnecter() {
  sessionStorage.removeItem(CLE_SESSION);
  location.href = "login.html";
}

/** Doit être appelé en haut de chaque page admin (sauf login.html). */
function exigerConnexion() {
  if (!estConnecte()) {
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

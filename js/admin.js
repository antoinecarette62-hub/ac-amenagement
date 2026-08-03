/* ============================================================
   AC AMÉNAGEMENT — Back-office
   ------------------------------------------------------------
   Le mot de passe n'est plus stocké dans ce fichier : il est
   vérifié côté serveur par le Cloudflare Worker (variable
   ADMIN_PASSWORD), qui renvoie un cookie de session signé si le
   mot de passe est correct. Ce fichier ne fait qu'appeler le
   Worker et suivre son verdict.
   ============================================================ */

const WORKER_URL = "https://ac-amenagement-admin.antoine-carette62.workers.dev";

async function estConnecte() {
  try {
    const reponse = await fetch(`${WORKER_URL}/session`, { credentials: "include" });
    if (!reponse.ok) return false;
    const donnees = await reponse.json();
    return !!donnees.authentifie;
  } catch (err) {
    return false;
  }
}

async function connecter(motDePasse) {
  try {
    const reponse = await fetch(`${WORKER_URL}/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: motDePasse }),
    });
    return reponse.ok;
  } catch (err) {
    return false;
  }
}

async function deconnecter() {
  try {
    await fetch(`${WORKER_URL}/logout`, { method: "POST", credentials: "include" });
  } catch (err) {
    // Même si l'appel échoue, on renvoie l'utilisateur vers le login.
  }
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

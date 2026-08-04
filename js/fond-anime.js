/* ============================================================
   AC LIGNA — Fond animé partagé
   ------------------------------------------------------------
   Dégradé fluide généré par déplacement de domaine (calculé pixel
   par pixel sur un canevas réduit puis remis à l'échelle), dans
   les tons or/noir de la charte. Utilisé en fond de section sur
   plusieurs pages (accueil, fiche produit, devis, configurateur).
   S'initialise automatiquement sur chaque <canvas class="canvas-fond-anime">
   trouvé dans la page.
   ============================================================ */
(function () {
  function initialiserCanvas(canvas) {
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext("2d");

    let largeur, hauteur, donneesImage, pixels;
    const ECHELLE = 2;

    function redimensionner() {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(rect.width));
      canvas.height = Math.max(1, Math.round(rect.height));
      largeur = Math.max(1, Math.floor(canvas.width / ECHELLE));
      hauteur = Math.max(1, Math.floor(canvas.height / ECHELLE));
      donneesImage = ctx.createImageData(largeur, hauteur);
      pixels = donneesImage.data;
    }
    window.addEventListener("resize", redimensionner);
    redimensionner();

    const depart = Date.now();

    const TABLE_SIN = new Float32Array(1024);
    const TABLE_COS = new Float32Array(1024);
    for (let i = 0; i < 1024; i++) {
      const angle = (i / 1024) * Math.PI * 2;
      TABLE_SIN[i] = Math.sin(angle);
      TABLE_COS[i] = Math.cos(angle);
    }
    function sinRapide(x) {
      return TABLE_SIN[Math.floor(((x % (Math.PI * 2)) / (Math.PI * 2)) * 1024) & 1023];
    }
    function cosRapide(x) {
      return TABLE_COS[Math.floor(((x % (Math.PI * 2)) / (Math.PI * 2)) * 1024) & 1023];
    }

    // Palette de la charte (0..1) : quasi-noir vers or, avec pointe or clair
    // sur les crêtes de vague.
    const NOIR = [0.055, 0.05, 0.045];
    const OR = [0.788, 0.651, 0.42];
    const OR_CLAIR = [0.894, 0.812, 0.627];

    function rendre() {
      const temps = (Date.now() - depart) * 0.001;

      for (let y = 0; y < hauteur; y++) {
        for (let x = 0; x < largeur; x++) {
          const ux = (2 * x - largeur) / hauteur;
          const uy = (2 * y - hauteur) / hauteur;

          let a = 0;
          let d = 0;
          for (let i = 0; i < 4; i++) {
            a += cosRapide(i - d + temps * 0.5 - a * ux);
            d += sinRapide(i * uy + a);
          }

          const vague = (sinRapide(a) + cosRapide(d)) * 0.5;
          const intensite = Math.max(0, Math.min(1, 0.16 + 0.22 * vague));
          const brillance = Math.max(0, (0.5 + 0.5 * vague) - 0.68) * 1.3;

          const r = (NOIR[0] + (OR[0] - NOIR[0]) * intensite + (OR_CLAIR[0] - OR[0]) * brillance * intensite);
          const g = (NOIR[1] + (OR[1] - NOIR[1]) * intensite + (OR_CLAIR[1] - OR[1]) * brillance * intensite);
          const b = (NOIR[2] + (OR[2] - NOIR[2]) * intensite + (OR_CLAIR[2] - OR[2]) * brillance * intensite);

          const i4 = (y * largeur + x) * 4;
          pixels[i4] = Math.min(255, r * 255);
          pixels[i4 + 1] = Math.min(255, g * 255);
          pixels[i4 + 2] = Math.min(255, b * 255);
          pixels[i4 + 3] = 255;
        }
      }

      ctx.putImageData(donneesImage, 0, 0);
      if (ECHELLE > 1) {
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(canvas, 0, 0, largeur, hauteur, 0, 0, canvas.width, canvas.height);
      }
      requestAnimationFrame(rendre);
    }

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      rendre();
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".canvas-fond-anime").forEach(initialiserCanvas);
  });
})();

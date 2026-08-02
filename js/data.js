/* ============================================================
   AC AMÉNAGEMENT — Données du site
   ------------------------------------------------------------
   ⚠️ Pas de base de données ici : ces tableaux JavaScript sont
   la "source de vérité" par défaut. L'admin (voir /admin) peut
   les modifier, mais SEULEMENT dans le navigateur utilisé
   (stockage localStorage) — rien n'est partagé entre visiteurs
   ni entre appareils. Pour changer les données par défaut pour
   TOUT LE MONDE, il faut éditer ce fichier directement.
   ============================================================ */

const DONNEES_PAR_DEFAUT = {
  collections: [
    { id: "nature", nom: "Nature", slug: "nature", image: "images/collections/Nature.png", ordre: 1, visible: true,
      description: "Bois massifs et matières brutes, pour un claustra chaleureux et authentique." },
    { id: "organique", nom: "Organique", slug: "organique", image: "images/collections/Organique.png", ordre: 2, visible: true,
      description: "Des courbes fluides et des formes arrondies qui rompent avec la rigidité habituelle des claustras." },
    { id: "geometrique", nom: "Géométrique", slug: "geometrique", image: "images/collections/Geometrique.png", ordre: 3, visible: true,
      description: "Motifs graphiques et trames structurées, pour une découpe CNC précise et architecturale." },
  ],

  // Générés : 5 modèles par collection (Nature 1..5, Organique 1..5, Géométrique 1..5).
  produits: (function () {
    const matieres = ["MDF", "CHENE"];
    const couleurs = { MDF: "Blanc laqué", CHENE: "Chêne naturel" };
    const collectionsProduits = [
      { slug: "nature", nom: "Nature" },
      { slug: "organique", nom: "Organique" },
      { slug: "geometrique", nom: "Géométrique" },
    ];
    const produits = [];
    collectionsProduits.forEach(({ slug: collectionSlug, nom: nomCollection }) => {
      for (let i = 1; i <= 5; i++) {
        const matiere = matieres[(i - 1) % matieres.length];
        produits.push({
          id: `${collectionSlug}-${i}`,
          nom: `${nomCollection} ${i}`,
          slug: `${collectionSlug}-${i}`,
          collectionSlug,
          description: `Claustra design ${nomCollection}, fabriqué sur mesure en France. Finition ${couleurs[matiere].toLowerCase()}.`,
          prix: 320 + i * 65,
          largeur: 60 + i * 15,
          hauteur: 200,
          epaisseur: 18,
          matiere,
          couleur: couleurs[matiere],
          tempsFabrication: 15 + i * 2,
          imagePrincipale: `images/produits/${collectionSlug}-${i}.png`,
          imageDetouree: `images/produits/detoure/${collectionSlug}-${i}.png`,
          decalageVertical: 0,
          images: [],
          visible: true,
        });
      }
    });

    // Ajustements manuels de cadrage vertical pour le visuel flottant (fiche
    // produit), pour les photos dont le détourage laisse le motif trop haut
    // ou trop bas dans son cadre.
    const decalagesPersonnalises = { "nature-2": 26 };
    produits.forEach((p) => {
      if (decalagesPersonnalises[p.slug] != null) p.decalageVertical = decalagesPersonnalises[p.slug];
    });
    return produits;
  })(),

  realisations: [
    { id: "r1", titre: "Cuisine ouverte à Lille", slug: "cuisine-lille", categorie: "CUISINE", ville: "Lille",
      imageAvant: "images/realisations/1-avant.jpg", imageApres: "images/realisations/1-apres.jpg",
      description: "Réalisation sur mesure : conception, fabrication et pose par AC Aménagement." },
    { id: "r2", titre: "Claustra salon à Lens", slug: "claustra-lens", categorie: "SALON", ville: "Lens",
      imageAvant: "images/realisations/2-avant.jpg", imageApres: "images/realisations/2-apres.jpg",
      description: "Réalisation sur mesure : conception, fabrication et pose par AC Aménagement." },
    { id: "r3", titre: "Entrée sur mesure à Arras", slug: "entree-arras", categorie: "ENTREE", ville: "Arras",
      imageAvant: "images/realisations/3-avant.jpg", imageApres: "images/realisations/3-apres.jpg",
      description: "Réalisation sur mesure : conception, fabrication et pose par AC Aménagement." },
    { id: "r4", titre: "Garde-corps escalier à Béthune", slug: "escalier-bethune", categorie: "ESCALIER", ville: "Béthune",
      imageAvant: "images/realisations/4-avant.jpg", imageApres: "images/realisations/4-apres.jpg",
      description: "Réalisation sur mesure : conception, fabrication et pose par AC Aménagement." },
    { id: "r5", titre: "Bureau cloisonné à Douai", slug: "bureau-douai", categorie: "BUREAU", ville: "Douai",
      imageAvant: "images/realisations/5-avant.jpg", imageApres: "images/realisations/5-apres.jpg",
      description: "Réalisation sur mesure : conception, fabrication et pose par AC Aménagement." },
    { id: "r6", titre: "Accueil showroom professionnel", slug: "showroom-lievin", categorie: "PROFESSIONNEL", ville: "Liévin",
      imageAvant: "images/realisations/6-avant.jpg", imageApres: "images/realisations/6-apres.jpg",
      description: "Réalisation sur mesure : conception, fabrication et pose par AC Aménagement." },
  ],

  avis: [
    { auteur: "Sophie M.", ville: "Lille", note: 5, message: "Un travail d'orfèvre, notre claustra sur mesure sublime le salon. Équipe très professionnelle." },
    { auteur: "Julien D.", ville: "Arras", note: 5, message: "Pose de cuisine impeccable, dans les délais annoncés. Je recommande sans hésiter." },
    { auteur: "Camille R.", ville: "Béthune", note: 4, message: "Très satisfaite du dressing sur mesure, finitions soignées et conseils pertinents." },
  ],
};

const LIBELLES_MATIERE = { MDF: "MDF laqué", CHENE: "Bois massif", NOIR_MAT: "Noir mat", METAL: "Métal", ALUMINIUM: "Aluminium" };
const LIBELLES_CATEGORIE = { CUISINE: "Cuisine", SALON: "Salon", ENTREE: "Entrée", ESCALIER: "Escalier", BUREAU: "Bureau", PROFESSIONNEL: "Professionnel" };

/* ------------------------------------------------------------
   Stockage : lit les données modifiées par l'admin dans
   localStorage si elles existent, sinon retombe sur les valeurs
   par défaut ci-dessus.
   ------------------------------------------------------------ */
const Donnees = {
  _cle: "ac_amenagement_donnees",

  charger() {
    try {
      const brut = localStorage.getItem(this._cle);
      if (brut) return JSON.parse(brut);
    } catch (e) {
      console.warn("Lecture localStorage impossible :", e);
    }
    return JSON.parse(JSON.stringify(DONNEES_PAR_DEFAUT));
  },

  sauvegarder(donnees) {
    localStorage.setItem(this._cle, JSON.stringify(donnees));
  },

  reinitialiser() {
    localStorage.removeItem(this._cle);
  },

  formatPrix(prix) {
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(prix);
  },

  slugify(texte) {
    return texte.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  },
};

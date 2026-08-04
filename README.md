# Ac Ligna — Version HTML / CSS / JavaScript pur

Version 100% statique du site, sans Node.js, sans base de données, sans
serveur. Ouvrez `index.html` dans un navigateur, ou hébergez le dossier
tel quel n'importe où (Netlify, GitHub Pages, OVH, etc.).

## Comment l'ouvrir

**Le plus simple** : double-cliquez sur `index.html`.

**Recommandé pour un rendu fidèle** (certains navigateurs bloquent des
fonctionnalités en `file://`) : lancez un petit serveur local, par ex.
avec Python déjà installé sur beaucoup de PC :
```bash
cd ac-amenagement-html
python -m http.server 8000
```
puis ouvrez `http://localhost:8000`.

## Structure

```
index.html            Accueil
collections.html       Liste des collections
collection.html        Détail d'une collection (?slug=nature)
produit.html            Fiche produit (?slug=nature-1)
galerie.html            Galerie masonry + lightbox
realisations.html       Avant/après
configurateur.html      Configurateur avec prix en temps réel
devis.html               Formulaire de devis
contact.html             Formulaire de contact
a-propos.html            Page à propos
admin/                   Back-office (voir avertissement ci-dessous)
css/style.css            Toute la feuille de style du site
js/data.js               Données (collections/produits/réalisations/avis)
js/layout.js             Header/footer partagés + animations
js/admin.js              Logique du back-office
```

## ⚠️ Ce qui change vraiment par rapport à la version Next.js

Ce n'est pas un simple changement de présentation — plusieurs
fonctionnalités reposaient sur un vrai serveur et une vraie base de
données, qu'une page HTML/CSS/JS ne peut pas avoir. Voici précisément ce
qui a changé :

### Pas de base de données → un fichier JavaScript
Les collections et produits sont dans `js/data.js`. Pour changer les
données **par défaut, pour tous les visiteurs**, il faut éditer ce
fichier directement (pas d'interface no-code possible sans serveur).

### Back-office : login vérifié côté serveur, mais données PAS partagées
- Le mot de passe n'est plus stocké dans le code JS : il est comparé
  côté serveur par un Cloudflare Worker (`ADMIN_PASSWORD`), qui renvoie
  un cookie de session signé si c'est correct. Voir `WORKER_URL` en
  haut de `js/admin.js` — à mettre à jour avec l'URL réelle du Worker
  une fois déployé, sinon le login ne fonctionne pas.
- Les modifications faites dans l'admin (ajouter/modifier un produit,
  masquer une collection…) sont enregistrées dans le **localStorage du
  navigateur utilisé**. Ouvrez le site sur un autre appareil ou un autre
  navigateur : vous ne les verrez pas. Videz le cache : elles disparaissent.
- **Ne jamais utiliser ce back-office pour gérer un vrai site public
  avec du contenu sensible.**

### Formulaires (devis, contact) : pas de vrai envoi
Sans serveur, un formulaire HTML ne peut pas envoyer d'email tout seul.
Ici, les demandes sont juste gardées dans le `localStorage` du visiteur
(visible seulement par lui, pas par vous). **Vous ne recevrez aucune
notification réelle.** Pour corriger ça sans repasser par un serveur
complet, la solution la plus simple est un service tiers gratuit comme
[Formspree](https://formspree.io) ou [Web3Forms](https://web3forms.com) :
il suffit de changer l'action du formulaire pour pointer vers eux.

### L'upload de photos vers Cloudinary, lui, fonctionne normalement
C'est un appel direct depuis le navigateur, pas besoin de serveur. Il
faut juste configurer vos identifiants dans **2 fichiers** :
`admin/collections.html` et `admin/produits.html`, en remplaçant :
```js
const CLOUDINARY_CLOUD_NAME = "votre-cloud-name";
const CLOUDINARY_UPLOAD_PRESET = "votre-upload-preset";
```
par vos vraies valeurs (même démarche que pour la version Next.js :
compte Cloudinary + upload preset en mode "Unsigned").

### SEO
Chaque page est un fichier `.html` statique et bien structuré (titres,
meta description) — c'est indexable. Mais il n'y a plus de sitemap
généré automatiquement, ni de données structurées Schema.org
dynamiques par produit, contrairement à la version Next.js.

## Images

Les chemins d'images (`images/collections/...`, `images/produits/...`,
`images/realisations/...`) sont des exemples : ce dossier `images/` est
vide dans cette livraison. Ajoutez-y vos vraies photos avec ces noms de
fichiers, ou modifiez les chemins dans `js/data.js`.

## Pas de configurateur "back-end validé"

Le prix du configurateur est calculé en JavaScript, dans le navigateur,
avec une grille tarifaire simple et illustrative (`configurateur.html`,
tout en haut du `<script>`) — à ajuster avec vos vrais tarifs.

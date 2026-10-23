# WebScope - Dashboard d'Analyse de Projets Web

WebScope est une application web de visualisation et d'analyse de projets étudiants. Elle permet d'afficher des statistiques détaillées sur le code HTML et CSS des projets analysés.

## 🎯 Fonctionnalités

### Analyse HTML

- **Scores de qualité** : Affichage des métriques de qualité du code HTML
- **Analyse des balises** : Statistiques sur l'utilisation des balises HTML (totales, uniques, fréquence)
- **Structure du document** : Analyse de la structure sémantique des pages
- **Images** : Analyse des images utilisées (formats, tailles, optimisation)
- **Liste des fichiers HTML** : Vue d'ensemble de toutes les pages du projet

### Analyse CSS

- **Statistiques CSS** : Métriques générales sur les fichiers CSS
- **Couleurs** : Visualisation des couleurs utilisées dans le projet
- **Typographie** : Analyse des polices et styles de texte (avec chargement dynamique des Google Fonts)
- **Règles CSS** : Statistiques sur les règles CSS (totales, uniques, redondance)
- **Sélecteurs** : Analyse des sélecteurs CSS utilisés
- **Unités** : Répartition des unités CSS (px, rem, %, etc.)
- **Propriétés** : Fréquence d'utilisation des propriétés CSS

## 🛠️ Technologies Utilisées

- **[Astro](https://astro.build)** - Framework web statique
- **[Vue 3](https://vuejs.org/)** - Framework JavaScript réactif
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utilitaire
- **[Observable Plot](https://observablehq.com/plot/)** - Bibliothèque de visualisation de données
- **[Chroma.js](https://gka.github.io/chroma.js/)** - Bibliothèque de manipulation des couleurs

## 📁 Structure du Projet

```text
/
├── public/              # Fichiers statiques
├── src/
│   ├── assets/         # Images et ressources
│   ├── components/     # Composants Vue réutilisables
│   │   ├── Blocks/     # Composants de blocs d'analyse
│   │   │   ├── BlockCssColor.vue       # Visualisation des couleurs CSS
│   │   │   ├── BlockCssProperties.vue  # Propriétés CSS utilisées
│   │   │   ├── BlockCssRules.vue       # Règles CSS
│   │   │   ├── BlockCssSelectors.vue   # Sélecteurs CSS
│   │   │   ├── BlockCssStats.vue       # Statistiques CSS générales
│   │   │   ├── BlockCssUnit.vue        # Unités CSS utilisées
│   │   │   ├── BlockFilesHtml.vue      # Liste des fichiers HTML
│   │   │   ├── BlockImages.vue         # Analyse des images
│   │   │   ├── BlockScores.vue         # Scores de qualité
│   │   │   ├── BlockStructure.vue      # Structure HTML
│   │   │   ├── BlockTags.vue           # Balises HTML utilisées
│   │   │   └── BlockTypography.vue     # Typographie
│   │   ├── Block.vue           # Composant de bloc générique
│   │   ├── Button.vue          # Composant bouton
│   │   ├── Check.vue           # Icône de validation
│   │   ├── Code.vue            # Affichage de code
│   │   ├── CustomSelect.vue    # Sélecteur personnalisé
│   │   ├── Fail.vue            # Icône d'échec
│   │   ├── Infos.vue           # Composant d'information
│   │   ├── Modal.vue           # Composant modal
│   │   ├── ProgressCircle.vue  # Cercle de progression
│   │   ├── Results.vue         # Composant principal des résultats
│   │   ├── Section.vue         # Composant de section
│   │   ├── TableMeter.vue      # Tableau avec indicateurs
│   │   ├── Tag.vue             # Étiquette
│   │   └── TagW3C.vue          # Étiquette W3C
│   ├── icons/          # Icônes SVG
│   │   ├── Css.vue
│   │   └── Html.vue
│   ├── js/             # Utilitaires JavaScript
│   │   └── helpers.js  # Fonctions d'aide (formatage, calculs)
│   ├── layouts/        # Layouts Astro
│   │   └── Layout.astro
│   └── pages/          # Pages de l'application
│       └── index.astro
├── astro.config.mjs    # Configuration Astro
├── package.json        # Dépendances du projet
├── tailwind.config.mjs # Configuration Tailwind
└── tsconfig.json       # Configuration TypeScript
```

## 🚀 Installation et Utilisation

### Prérequis

- Node.js (version 18 ou supérieure)
- npm ou yarn

### Installation

```bash
# Cloner le dépôt
git clone <url-du-repo>

# Naviguer dans le dossier
cd project-analysis-frontend

# Installer les dépendances
npm install
```

### Commandes Disponibles

| Commande          | Action                                                 |
| :---------------- | :----------------------------------------------------- |
| `npm run dev`     | Lance le serveur de développement sur `localhost:4321` |
| `npm run build`   | Génère le site de production dans `./dist/`            |
| `npm run preview` | Prévisualise le build en local avant déploiement       |
| `npm run astro`   | Exécute les commandes CLI Astro                        |

### Développement

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:4321`

## 🔌 API Backend

L'application se connecte à une API backend pour récupérer les données des projets analysés :

- **Production** : `https://project-analysis-backend.onrender.com`
- **Local** : `http://localhost:3000` (commenté dans le code)

### Endpoints utilisés :

- `GET /scan/projects` - Liste des projets de la promo (slug, nom, groupe)
- `GET /scan/project/:slug` - Données d'analyse d'un projet spécifique
- `GET /stats/class` - Statistiques de la promo

Chaque requête envoie `Authorization: Bearer <jeton>`. Le jeton est saisi dans l'interface et gardé dans le `sessionStorage` : il n'est jamais inscrit dans le code, où il serait public.

## 📊 Fonctions Utilitaires (helpers.js)

### `getFileName(urlString)`

Extrait le nom du fichier depuis une URL.

### `formatSize(size)`

Formate les tailles en Ko ou Mo selon la valeur.

### `gap(total, unique)`

Calcule le pourcentage d'écart entre le nombre total et unique d'éléments (pour mesurer la redondance).

## 🎨 Personnalisation

### Modifier l'URL de l'API

Dans `src/components/Results.vue`, modifiez la constante `API_BASE_URL` :

```javascript
const API_BASE_URL = "votre-url-api";
```

### Thème et Styles

Les styles sont gérés par Tailwind CSS. Modifiez `tailwind.config.mjs` pour personnaliser le thème.

## 📝 Licence

Ce projet est destiné à un usage éducatif.

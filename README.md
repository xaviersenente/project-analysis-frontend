# WebScope : interface

Interface de lecture des analyses WebScope, pour toutes les SAÉ (SAÉ 105, portfolio S3…). C'est un **site statique** : il lit, au build, un fichier de promo et un JSON par étudiant (résultat d'analyse au format v3, qui porte les axes de sa grille), puis génère une page par projet.

Les analyses se lancent en local avec le backend ; ce site ne fait que les afficher.

## Lancer en local

Node 24 (voir `.nvmrc`).

```bash
npm install
npm run dev                # http://localhost:4321, avec les données fictives
npm run dev -- s3-sae      # les analyses d'une promo (project-analysis-backend/data/s3-sae)
npm test                   # schéma, synthèse, formats
npm run build -- s1-sae    # site statique de la promo dans dist/
```

## Les données

| Source | Quand |
|---|---|
| `donnees-fictives/s1-sae/` | par défaut : SAÉ 105, 6 étudiants inventés, dont un en échec partiel et deux non analysés |
| `npm run dev -- s3-sae --fictif` (`donnees-fictives/s3-sae/`) | portfolio S3 : 3 étudiants inventés (un solide, un fragile, un non analysé), avec site parcouru, captures, fiche de soutenance, propositions de l'IA et une évaluation commencée |
| `npm run build -- <promo>` (`s1-sae`, `s3-sae`…) | les vraies analyses de cette promo, hors de Git (`scripts/lancer.mjs` fixe `WEBSCOPE_DONNEES`) |

Le dossier contient `promo.json` et un fichier `<slug>.json` par projet analysé. Un projet de la promo sans fichier s'affiche « non analysé ». Un fichier qui ne respecte pas le schéma arrête le build, avec le fichier et le champ en cause.

Les vignettes d'images vivent dans `vignettes/<slug>/` du même dossier. Elles sont servies en développement, puis copiées au build dans `dist/projet/<slug>/vignettes/`, sous la page du projet : la règle d'accès d'un étudiant les protège aussi.

Les données fictives se régénèrent avec `npm run donnees-fictives`, à partir de la grille copiée dans `catalogue-criteres.json` de chaque promo : `scripts/genererDonneesFictives.js` (SAÉ 105) et `scripts/genererPortfoliosFictifs.js` (portfolio S3). Les deux sont déterministes.

## Structure

```text
src/
├── schema/resultat.js     # schéma v3 (Zod) : le contrat avec le backend
├── lib/                   # lecture des données, synthèse, formats français
├── config/axes.js         # les quatre axes et leurs couleurs
├── components/            # barre supérieure, sélecteur, navigation, synthèse, axes
├── layouts/Base.astro
├── pages/
│   ├── index.astro        # la promo
│   └── projet/[slug].astro
└── styles/global.css      # jetons de couleur, polices auto-hébergées
```

## Accessibilité

- Verdicts toujours en icône **et** en mot, jamais par la couleur seule ; contrastes AA.
- Tout se fait au clavier : `/` pour chercher un étudiant, `←` et `→` pour passer au projet voisin.
- Le tiroir de navigation, sous 1024 px, est un `popover` ; aucune dépendance JavaScript hors du sélecteur.

# WebScope : interface

Interface de lecture des analyses de la SAÉ 105. C'est un **site statique** : il lit, au build, un fichier de promo et un JSON par étudiant (résultat d'analyse au format v2), puis génère une page par projet.

Les analyses se lancent en local avec le backend ; ce site ne fait que les afficher.

## Lancer en local

Node 24 (voir `.nvmrc`).

```bash
npm install
npm run dev        # http://localhost:4321, avec les données fictives
npm test           # schéma, synthèse, formats
npm run build      # site statique dans dist/
```

## Les données

| Source | Quand |
|---|---|
| `donnees-fictives/` | par défaut : 6 étudiants inventés, dont un en échec partiel et deux non analysés |
| `WEBSCOPE_DONNEES=../project-analysis-backend/data npm run build` | les vraies analyses, hors de Git |

Le dossier contient `promo.json` et un fichier `<slug>.json` par projet analysé. Un projet de la promo sans fichier s'affiche « non analysé ». Un fichier qui ne respecte pas le schéma arrête le build, avec le fichier et le champ en cause.

Les données fictives se régénèrent avec `node scripts/genererDonneesFictives.js`, à partir de `donnees-fictives/catalogue-criteres.json` (la grille de `CRITERES-SAE105-2026.md`).

## Structure

```text
src/
├── schema/resultat.js     # schéma v2 (Zod) : le contrat avec le backend
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

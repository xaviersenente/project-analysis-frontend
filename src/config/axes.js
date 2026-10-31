/**
 * Couleurs des axes. Les axes eux-mêmes (nom, points, ordre) viennent de la grille de la SAÉ,
 * que chaque résultat résume (resultat.grille.axes).
 */

/** Classes de couleur, écrites en entier pour que Tailwind les génère */
const COULEURS = [
  { pastille: "bg-axe-graphique", lisere: "border-axe-graphique" },
  { pastille: "bg-axe-ergonomie", lisere: "border-axe-ergonomie" },
  { pastille: "bg-axe-accessibilite", lisere: "border-axe-accessibilite" },
  { pastille: "bg-axe-methodologie", lisere: "border-axe-methodologie" },
  { pastille: "bg-axe-5", lisere: "border-axe-5" },
  { pastille: "bg-axe-6", lisere: "border-axe-6" },
];

// Les axes de la SAÉ 105 gardent leur couleur, quel que soit leur rang
const PAR_ID = { graphique: 0, ergonomie: 1, accessibilite: 2, methodologie: 3 };

/**
 * @param {string} id - Identifiant de l'axe
 * @param {number} rang - Sa place dans la grille
 */
export const couleurAxe = (id, rang) => COULEURS[PAR_ID[id] ?? rang % COULEURS.length];

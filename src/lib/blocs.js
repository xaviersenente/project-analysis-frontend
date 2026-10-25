/**
 * Aides des blocs propres à chaque axe (palette, échelles)
 */
import { ROLES_COULEUR } from "../schema/resultat.js";

/**
 * La couleur réelle d'une valeur de la palette : « var(--surface) » suit la chaîne des variables
 * (--surface → --white → #fff), sans quoi la pastille resterait vide dans l'interface.
 * @returns {string|null} - null si une variable de la chaîne est introuvable
 */
export const resoudreCouleur = (valeur, palette, profondeur = 0) => {
  if (profondeur > 10) return null;
  const appel = valeur.trim().match(/^var\(\s*(--[\w-]+)\s*(?:,\s*(.+))?\)$/);
  if (!appel) return valeur.trim();
  const [, nom, repli] = appel;
  const cible = palette.find((c) => c.variable === nom);
  if (cible) return resoudreCouleur(cible.valeur, palette, profondeur + 1);
  return repli ? resoudreCouleur(repli, palette, profondeur + 1) : null;
};

/**
 * Regroupe les variables de couleur par rôle, dans l'ordre de ROLES_COULEUR,
 * chacune avec sa couleur résolue
 * @param {Array<{ variable: string, valeur: string, role: string }>} palette
 */
export const grouperPalette = (palette) =>
  ROLES_COULEUR.map((role) => ({
    role,
    couleurs: palette.filter((c) => c.role === role).map((c) => ({ ...c, couleur: resoudreCouleur(c.valeur, palette) })),
  })).filter((g) => g.couleurs.length > 0);

/**
 * Une couleur claire (#rgb ou #rrggbb) ; sert à border les pastilles proches du blanc.
 * Une valeur qu'on ne sait pas lire est supposée claire : la bordure ne gêne jamais.
 */
export const estClaire = (valeur) => {
  const hex = valeur.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)?.[1];
  if (!hex) return true;
  const complet = hex.length === 3 ? [...hex].map((c) => c + c).join("") : hex;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(complet.slice(i, i + 2), 16) / 255);
  // Luminance relative (WCAG)
  const lin = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b) > 0.8;
};

/** Largeur d'une barre proportionnelle : « 25% » */
export const largeurRelative = (valeur, max) =>
  max > 0 ? `${Math.round((valeur / max) * 100)}%` : "0%";

/** Nom CSS d'une famille de l'étudiant dans WebScope : préfixé, pour ne jamais croiser nos polices */
export const nomPolice = (famille) => `WebScope ${famille.replace(/["\\]/g, "")}`;

/** Première graisse d'une valeur font-weight (« 400 », « 100 900 », « bold ») */
const graisseNumerique = (graisse) => (graisse === "bold" ? 700 : Number.parseInt(graisse, 10) || 400);

/**
 * Les polices du site, par famille, chaque graisse avec sa copie publiée
 * @param {Array<{ famille: string, graisse: string, fichier: string, copie?: string|null }>} polices
 * @returns {Array<{ famille: string, nom: string, graisses: Array<object> }>}
 */
export const famillesPolices = (polices) => {
  const familles = new Map();
  for (const p of polices.filter((x) => x.famille !== "inconnue")) {
    if (!familles.has(p.famille)) familles.set(p.famille, { famille: p.famille, nom: nomPolice(p.famille), graisses: [] });
    familles.get(p.famille).graisses.push({ graisse: p.graisse, valeur: graisseNumerique(p.graisse), fichier: p.fichier, copie: p.copie ?? null });
  }
  for (const f of familles.values()) f.graisses.sort((a, b) => a.valeur - b.valeur);
  return [...familles.values()];
};

/** Les @font-face qui chargent les copies des polices de l'étudiant dans la page du projet */
export const cssPolices = (polices) =>
  polices
    .filter((p) => p.copie && p.famille !== "inconnue")
    .map((p) => `@font-face { font-family: "${nomPolice(p.famille)}"; src: url("${encodeURI(p.copie)}"); font-weight: ${/^\d+( \d+)?$/.test(p.graisse) ? p.graisse : graisseNumerique(p.graisse)}; font-display: swap; }`)
    .join("\n");

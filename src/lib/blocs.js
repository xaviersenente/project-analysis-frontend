/**
 * Aides des blocs propres à chaque axe (palette, échelles)
 */
import { ROLES_COULEUR } from "../schema/resultat.js";

/**
 * Regroupe les variables de couleur par rôle, dans l'ordre de ROLES_COULEUR
 * @param {Array<{ variable: string, valeur: string, role: string }>} palette
 */
export const grouperPalette = (palette) =>
  ROLES_COULEUR.map((role) => ({
    role,
    couleurs: palette.filter((c) => c.role === role),
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

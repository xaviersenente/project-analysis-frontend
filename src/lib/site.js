/**
 * Données communes à toutes les pages, calculées une fois au build
 */
import { chargerPromo, chargerResultats } from "./donnees.js";
import { moyennesPromo } from "./synthese.js";

/**
 * @typedef {{ slug: string, nom: string, groupe: string, note: number | null, lettre: string | null }} OptionProjet
 * @typedef {{
 *   promo: import("../types").Promo,
 *   resultats: Map<string, import("../types").Resultat>,
 *   options: OptionProjet[],
 *   moyennes: { totale: number, parAxe: Record<string, number> } | null,
 * }} DonneesSite
 */

/** @type {DonneesSite | null} */
let cache = null;

/** @returns {DonneesSite} */

export const donneesSite = () => {
  // En développement, les JSON sont relus à chaque page pour suivre les nouvelles analyses
  if (cache && import.meta.env?.PROD) return cache;
  const promo = chargerPromo();
  const resultats = chargerResultats(undefined, promo);
  // Options du sélecteur : ordre alphabétique de la promo, avec la note ou l'état
  const options = promo.projets.map(({ slug, nom, groupe }) => {
    const resultat = resultats.get(slug);
    return {
      slug,
      nom,
      groupe,
      note: resultat ? resultat.note.totale : null,
      lettre: resultat ? resultat.note.lettre : null,
    };
  });
  cache = {
    promo,
    resultats,
    options,
    moyennes: moyennesPromo([...resultats.values()]),
  };
  return cache;
};

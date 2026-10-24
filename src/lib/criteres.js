/**
 * Liste des critères d'un axe : extraits surlignés et filtres.
 * Utilisé au build (extraits) et dans le navigateur (filtres).
 */

/** Nombre d'occurrences affichées avant « Voir les … » */
export const OCCURRENCES_VISIBLES = 5;

/**
 * Sépare un extrait en trois parties autour de la zone fautive
 * @param {string} extrait
 * @param {[number, number] | null | undefined} surligne - [début, fin[
 * @returns {{ avant: string, fautif: string, apres: string }}
 */
export const decouperExtrait = (extrait, surligne) => {
  const [debut, fin] = surligne ?? [];
  const valide = Number.isInteger(debut) && Number.isInteger(fin) && debut < fin && fin <= extrait.length;
  if (!valide) return { avant: extrait, fautif: "", apres: "" };
  return {
    avant: extrait.slice(0, debut),
    fautif: extrait.slice(debut, fin),
    apres: extrait.slice(fin),
  };
};

/** Minuscules, sans accents : pour la recherche */
export const normaliser = (texte) =>
  texte.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

const NON_RESPECTE = ["non-respecte", "partiel"];

/**
 * Une ligne de critère correspond-elle aux filtres ?
 * @param {{ verdict: string, statut: string, texte: string }} ligne
 * @param {{ vue: "tous" | "non-respectes" | "a-juger", masquerRecommandations: boolean, recherche: string }} filtres
 */
export const correspondAuFiltre = (ligne, filtres) => {
  if (filtres.masquerRecommandations && ligne.statut === "R") return false;
  if (filtres.vue === "non-respectes") {
    // Un bonus non obtenu n'est jamais un échec
    if (ligne.statut === "B" || !NON_RESPECTE.includes(ligne.verdict)) return false;
  }
  if (filtres.vue === "a-juger" && ligne.verdict !== "a-juger") return false;
  const terme = normaliser(filtres.recherche.trim());
  return !terme || normaliser(ligne.texte).includes(terme);
};

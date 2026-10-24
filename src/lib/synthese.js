/**
 * Calculs de la synthèse d'un projet, à partir de ses critères (format v2)
 */
import { AXES } from "../schema/resultat.js";

const NON_RESPECTE = ["non-respecte", "partiel"];

/**
 * Les trois compteurs de l'en-tête
 * @param {Array} criteres
 * @returns {{ contraintesNonRespectees: number, recommandations: number, aJuger: number }}
 */
export const compterVerdicts = (criteres) => ({
  contraintesNonRespectees: criteres.filter(
    (c) => c.statut === "C" && NON_RESPECTE.includes(c.verdict)
  ).length,
  recommandations: criteres.filter(
    (c) => c.statut === "R" && NON_RESPECTE.includes(c.verdict)
  ).length,
  aJuger: criteres.filter((c) => c.verdict === "a-juger").length,
});

/**
 * Les contraintes non respectées qui coûtent le plus de points.
 * Un bonus, un critère non mesurable ou à juger n'y figurent jamais.
 * @param {Array} criteres
 * @param {number} nombre - Taille de la liste (5 par défaut)
 * @returns {Array} - Critères enrichis de pointsPerdus, du plus coûteux au moins coûteux
 */
export const priorites = (criteres, nombre = 5) =>
  criteres
    .filter((c) => c.statut === "C" && NON_RESPECTE.includes(c.verdict) && c.points)
    .map((c, ordre) => ({
      ...c,
      ordre,
      pointsPerdus: c.points.max - (c.points.obtenus ?? 0),
    }))
    .sort((a, b) => b.pointsPerdus - a.pointsPerdus || a.ordre - b.ordre)
    .slice(0, nombre)
    .map(({ ordre, ...c }) => c);

/**
 * Nombre de contraintes non respectées par axe (badges de la navigation)
 * @param {Array} criteres
 * @returns {Record<string, number>}
 */
export const badgesParAxe = (criteres) =>
  Object.fromEntries(
    AXES.map((axe) => [
      axe,
      criteres.filter(
        (c) => c.axe === axe && c.statut === "C" && NON_RESPECTE.includes(c.verdict)
      ).length,
    ])
  );

const moyenne = (valeurs) =>
  Math.round((valeurs.reduce((s, v) => s + v, 0) / valeurs.length) * 10) / 10;

/**
 * Moyennes de la promo, sur les seuls projets analysés
 * (un projet dont rien n'a pu être mesuré n'y compte pas).
 * Par axe, la moyenne est une proportion (0 à 1) : le maximum d'un axe varie
 * d'un projet à l'autre quand des critères ne sont pas mesurables.
 * @param {Array} resultats - Résultats v2
 * @returns {{ totale: number, parAxe: Record<string, number> } | null}
 */
export const moyennesPromo = (tousLesResultats) => {
  const resultats = tousLesResultats.filter((r) => r.note.max > 0);
  if (resultats.length === 0) return null;
  const ratio = (r, axe) => r.note.parAxe[axe].obtenus / Math.max(r.note.parAxe[axe].max, 1);
  return {
    totale: moyenne(resultats.map((r) => r.note.totale)),
    parAxe: Object.fromEntries(
      AXES.map((axe) => [
        axe,
        Math.round((resultats.reduce((s, r) => s + ratio(r, axe), 0) / resultats.length) * 1000) / 1000,
      ])
    ),
  };
};

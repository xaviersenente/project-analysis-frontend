/**
 * Calculs de la synthèse d'un projet, à partir de ses critères (format v3)
 */

const NON_RESPECTE = ["non-respecte", "partiel"];

/**
 * Les trois compteurs de l'en-tête
 * @param {Array} criteres
 * @returns {{ contraintesNonRespectees: number, recommandations: number, informations: number, aJuger: number }}
 */
export const compterVerdicts = (criteres) => ({
  contraintesNonRespectees: criteres.filter(
    (c) => c.statut === "C" && NON_RESPECTE.includes(c.verdict)
  ).length,
  recommandations: criteres.filter(
    (c) => c.statut === "R" && NON_RESPECTE.includes(c.verdict)
  ).length,
  // Mesures données pour information (portfolio : là où le jury regardera)
  informations: criteres.filter(
    (c) => c.statut === "I" && NON_RESPECTE.includes(c.verdict)
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
 * @param {{ id: string }[]} axes - Axes de la grille
 * @returns {Record<string, number>}
 */
export const badgesParAxe = (criteres, axes) =>
  Object.fromEntries(
    axes.map(({ id: axe }) => [
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
 * Les axes sont ceux des résultats (une promo, une grille).
 * @param {Array} resultats - Résultats v3
 * @returns {{ totale: number, parAxe: Record<string, number> } | null}
 */
export const moyennesPromo = (tousLesResultats) => {
  const resultats = tousLesResultats.filter((r) => r.note.max > 0);
  if (resultats.length === 0) return null;
  const ratio = (r, axe) => r.note.parAxe[axe].obtenus / Math.max(r.note.parAxe[axe].max, 1);
  const axes = [...new Set(resultats.flatMap((r) => Object.keys(r.note.parAxe)))];
  return {
    totale: moyenne(resultats.map((r) => r.note.totale)),
    parAxe: Object.fromEntries(
      axes.map((axe) => {
        const avecAxe = resultats.filter((r) => r.note.parAxe[axe]);
        return [axe, Math.round((avecAxe.reduce((s, r) => s + ratio(r, axe), 0) / avecAxe.length) * 1000) / 1000];
      })
    ),
  };
};

/**
 * Les verdicts : leur mot et leur icône, partout les mêmes (badge, ligne de critère,
 * formulaire de l'enseignant, vue par page). Les couleurs restent dans Verdict.astro et
 * VueParPage.astro : elles dépendent du statut du critère et du contexte d'affichage.
 */
export const VERDICTS = {
  respecte: { mot: "respecté", icone: "✓" },
  partiel: { mot: "partiel", icone: "◐" },
  "non-respecte": { mot: "non respecté", icone: "✕" },
  "non-mesurable": { mot: "non mesurable", icone: "?" },
  "a-juger": { mot: "à juger", icone: "✎" },
};

/** Le mot d'un verdict, avec sa majuscule en tête de libellé (« Non respecté ») */
export const motVerdict = (verdict, { majuscule = false } = {}) => {
  const mot = VERDICTS[verdict]?.mot ?? verdict;
  return majuscule ? mot.charAt(0).toUpperCase() + mot.slice(1) : mot;
};

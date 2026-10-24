/**
 * Formats français : virgule décimale, espace pour les milliers, dates en toutes lettres
 */

const nombreFr = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 });
const dateFr = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Paris",
});

/** 1234.5 → « 1 234,5 » (espace insécable fine, comme le veut Intl) */
export const nombre = (valeur) => (valeur === null || valeur === undefined ? "—" : nombreFr.format(valeur));

/** ISO → « 16 janvier 2027 à 09:10 » */
export const date = (iso) => dateFr.format(new Date(iso));

// Unités abrégées : jamais de « s » au pluriel
const INVARIABLES = new Set(["%", "px", "ch", "Ko", "Mo", "rem"]);

/** Unité accolée au nombre : « 7 % », « 150 Ko », « 3 erreurs » */
const avecUnite = (valeur, unite) => {
  if (!unite) return nombre(valeur);
  const pluriel = valeur > 1 && !INVARIABLES.has(unite) && !unite.endsWith("s") ? "s" : "";
  return `${nombre(valeur)} ${unite}${pluriel}`;
};

/**
 * Valeur mesurée d'un critère, dans l'unité de son seuil
 * @param {object} critere - Critère v2
 */
export const valeurCritere = (critere) => {
  if (critere.detailValeur) return critere.detailValeur;
  if (critere.valeur === null) return "—";
  return avecUnite(critere.valeur, critere.seuil?.unite);
};

/** Seuil d'un critère : « ≤ 5 % », ou son texte descriptif */
export const seuilCritere = (critere) => {
  if (critere.seuil) {
    const { operateur, nombre: n, unite } = critere.seuil;
    return `${operateur} ${avecUnite(n, unite)}`;
  }
  return critere.detailSeuil ?? "—";
};

/** Points : « 3 pts », « 1 pt » */
export const points = (n) => `${nombre(n)} pt${Math.abs(n) > 1 ? "s" : ""}`;

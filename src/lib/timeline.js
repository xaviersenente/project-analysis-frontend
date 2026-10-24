/**
 * Géométrie de la frise des commits (calculée au build, rendue en SVG)
 */

const temps = (date) => new Date(date).getTime();

/**
 * Échelle linéaire du temps vers l'axe horizontal
 * @returns {(date: string) => number}
 */
export const echelleTemps = (debut, fin, xMin, xMax) => {
  const t0 = temps(debut);
  const etendue = Math.max(temps(fin) - t0, 1);
  return (date) => xMin + ((temps(date) - t0) / etendue) * (xMax - xMin);
};

const RAYON_MIN = 3;
const RAYON_MAX = 12;

/**
 * Rayon d'un point de commit : la surface suit le nombre de lignes modifiées
 */
export const rayonCommit = (lignes, maxLignes) =>
  RAYON_MIN + Math.sqrt(Math.max(lignes, 0) / Math.max(maxLignes, 1)) * (RAYON_MAX - RAYON_MIN);

const jourParis = new Intl.DateTimeFormat("fr-FR", {
  timeZone: "Europe/Paris",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});
const libelleJour = new Intl.DateTimeFormat("fr-FR", {
  timeZone: "Europe/Paris",
  day: "numeric",
  month: "short",
});

const decalageParis = new Intl.DateTimeFormat("en-US", { timeZone: "Europe/Paris", timeZoneName: "longOffset" });

/** Décalage de Paris à une date donnée : « +01:00 » en hiver, « +02:00 » en été */
const decalage = (date) => decalageParis.formatToParts(date).find((p) => p.type === "timeZoneName").value.replace("GMT", "") || "+00:00";

/** Minuit, heure de Paris, du jour d'une date (heure d'été comprise) */
const minuitParis = (date) => {
  const [jour, mois, annee] = jourParis.format(new Date(date)).split("/");
  // Le décalage pris à midi : il vaut pour minuit, sauf la nuit du changement d'heure
  const midi = new Date(`${annee}-${mois}-${jour}T12:00:00Z`);
  return new Date(`${annee}-${mois}-${jour}T00:00:00${decalage(midi)}`);
};

/**
 * Un repère par jour, de minuit le premier jour jusqu'à la fin
 * @returns {Array<{ date: string, libelle: string }>}
 */
export const graduationsJours = (debut, fin) => {
  const reperes = [];
  // Chaque minuit est recalculé : un jour de changement d'heure dure 23 h ou 25 h
  for (let jour = minuitParis(debut); jour.getTime() <= temps(fin); jour = minuitParis(new Date(jour.getTime() + 36 * 3600e3))) {
    reperes.push({ date: jour.toISOString(), libelle: libelleJour.format(jour) });
  }
  return reperes;
};

/**
 * Colonne d'une date dans la frise : le dernier jour qui commence avant elle
 * @param {string} date
 * @param {Array<{ date: string }>} jours - Graduations de graduationsJours
 */
export const indexJour = (date, jours) => {
  const t = temps(date);
  let index = 0;
  jours.forEach((jour, i) => {
    if (temps(jour.date) <= t) index = i;
  });
  return index;
};

/** Minutes écoulées depuis minuit, heure de Paris */
export const minutesDuJour = (date) => (temps(date) - minuitParis(date).getTime()) / 60e3;

/** Début de l'axe : minuit du premier jour */
export const debutFrise = (date) => minuitParis(date).toISOString();

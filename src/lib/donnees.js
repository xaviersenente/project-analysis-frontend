/**
 * Lecture des données au build : un fichier de promo et un JSON par étudiant.
 * Le dossier vient de WEBSCOPE_DONNEES (le data/ local, hors de Git),
 * sinon des données fictives du dépôt.
 */
import fs from "node:fs";
import path from "node:path";
import { promoSchema, resultatSchema, SLUG_REGEX } from "../schema/resultat.js";

export const dossierDonnees = () =>
  path.resolve(process.env.WEBSCOPE_DONNEES || "donnees-fictives");

const lireJson = (fichier) => JSON.parse(fs.readFileSync(fichier, "utf-8"));

/**
 * Valide un objet ; en cas d'erreur, le build s'arrête avec le fichier et le champ en cause
 */
const valider = (schema, donnees, fichier) => {
  const resultat = schema.safeParse(donnees);
  if (!resultat.success) {
    const detail = resultat.error.issues
      .slice(0, 5)
      .map((i) => `  ${i.path.join(".") || "(racine)"} : ${i.message}`)
      .join("\n");
    throw new Error(`Données invalides dans ${fichier} :\n${detail}`);
  }
  return resultat.data;
};

/**
 * @param {string} dossier
 * @returns {object} - La promo, projets triés par nom
 */
export const chargerPromo = (dossier = dossierDonnees()) => {
  const fichier = path.join(dossier, "promo.json");
  const promo = valider(promoSchema, lireJson(fichier), fichier);
  promo.projets.sort((a, b) => a.nom.localeCompare(b.nom, "fr"));
  return promo;
};

/**
 * Les résultats des projets analysés ; un projet sans fichier n'est pas encore analysé
 * @param {string} dossier
 * @param {object} promo
 * @returns {Map<string, object>} - slug → résultat
 */
export const chargerResultats = (dossier = dossierDonnees(), promo = chargerPromo(dossier)) => {
  const resultats = new Map();
  for (const { slug } of promo.projets) {
    if (!SLUG_REGEX.test(slug)) {
      throw new Error(`Identifiant de projet invalide : ${slug}`);
    }
    const fichier = path.join(dossier, `${slug}.json`);
    if (!fs.existsSync(fichier)) continue;
    resultats.set(slug, valider(resultatSchema, lireJson(fichier), fichier));
  }
  return resultats;
};

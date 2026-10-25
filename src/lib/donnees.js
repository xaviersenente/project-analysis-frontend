/**
 * Lecture des données au build : un fichier de promo, un JSON par étudiant,
 * et les notes de l'enseignant (notes/<slug>.json, mode local) appliquées par-dessus.
 * Le dossier vient de WEBSCOPE_DONNEES (le data/ local, hors de Git),
 * sinon des données fictives du dépôt.
 */
import fs from "node:fs";
import path from "node:path";
import { promoSchema, resultatSchema, SLUG_REGEX } from "../schema/resultat.js";
import { notesSchema, NOTES_VIDES } from "../schema/notes.js";
import { appliquerNotes, verifierNotes } from "./notes.js";

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

/** Chemin des notes de l'enseignant pour un projet */
export const cheminNotes = (dossier, slug) => path.join(dossier, "notes", `${slug}.json`);

/**
 * Les notes de l'enseignant pour un résultat ; vides s'il n'y en a pas encore
 * @throws {Error} - Notes invalides : le build s'arrête avec le fichier et le problème
 */
export const lireNotes = (dossier, slug, resultat) => {
  const fichier = cheminNotes(dossier, slug);
  if (!fs.existsSync(fichier)) return NOTES_VIDES;
  const notes = valider(notesSchema, lireJson(fichier), fichier);
  const problemes = verifierNotes(notes, resultat);
  if (problemes.length) throw new Error(`Notes invalides dans ${fichier} :\n  ${problemes.join("\n  ")}`);
  return notes;
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
    const resultat = valider(resultatSchema, lireJson(fichier), fichier);
    resultats.set(slug, appliquerNotes(resultat, lireNotes(dossier, slug, resultat)));
  }
  return resultats;
};

/**
 * Mode local : enregistrer les notes de l'enseignant, en développement seulement.
 *
 * POST /__webscope/notes/<slug> écrit <données>/notes/<slug>.json (hors de Git).
 * Corps : { critere: "G10", note: { points?, verdict?, commentaire } | null } pour un critère,
 * ou { commentaire: "…" | null } pour le commentaire général.
 * Le site construit n'a pas cette adresse : il est en lecture seule.
 */
import fs from "node:fs";
import path from "node:path";
import { notesSchema, NOTES_VIDES } from "../src/schema/notes.js";
import { verifierNotes } from "../src/lib/notes.js";

const SLUG = /^[a-z0-9-]+$/;
const dossierDonnees = () => path.resolve(process.env.WEBSCOPE_DONNEES || "donnees-fictives");

const lireCorps = (req) =>
  new Promise((resolve, reject) => {
    let corps = "";
    req.on("data", (morceau) => {
      corps += morceau;
      if (corps.length > 100_000) reject(new Error("Corps trop long"));
    });
    req.on("end", () => resolve(corps));
    req.on("error", reject);
  });

const repondre = (res, statut, donnees) => {
  res.statusCode = statut;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(donnees));
};

/** Applique une modification aux notes existantes ; renvoie les nouvelles notes */
export const modifierNotes = (notes, demande, le = new Date().toISOString()) => {
  if ("critere" in demande) {
    const criteres = { ...notes.criteres };
    if (demande.note === null) delete criteres[demande.critere];
    else criteres[demande.critere] = { ...demande.note, commentaire: demande.note.commentaire?.trim() || null, le };
    return { ...notes, criteres };
  }
  return { ...notes, commentaire: demande.commentaire?.trim() || null };
};

export default function notes() {
  return {
    name: "webscope-notes",
    hooks: {
      "astro:server:setup": ({ server }) => {
        server.middlewares.use(async (req, res, next) => {
          const correspondance = req.url?.match(/^\/__webscope\/notes\/([^/?#]+)$/);
          if (!correspondance) return next();
          if (req.method !== "POST") return repondre(res, 405, { erreurs: ["POST seulement"] });
          const [, slug] = correspondance;
          const dossier = dossierDonnees();
          const fichierResultat = path.join(dossier, `${slug}.json`);
          if (!SLUG.test(slug) || !fs.existsSync(fichierResultat)) return repondre(res, 404, { erreurs: ["Projet inconnu"] });
          try {
            const demande = JSON.parse(await lireCorps(req));
            const fichier = path.join(dossier, "notes", `${slug}.json`);
            const actuelles = fs.existsSync(fichier) ? JSON.parse(fs.readFileSync(fichier, "utf-8")) : NOTES_VIDES;
            const verification = notesSchema.safeParse(modifierNotes(actuelles, demande));
            if (!verification.success) return repondre(res, 400, { erreurs: verification.error.issues.map((i) => `${i.path.join(".")} : ${i.message}`) });
            const problemes = verifierNotes(verification.data, JSON.parse(fs.readFileSync(fichierResultat, "utf-8")));
            if (problemes.length) return repondre(res, 400, { erreurs: problemes });
            fs.mkdirSync(path.dirname(fichier), { recursive: true });
            // Écriture atomique : un fichier à moitié écrit ne doit jamais casser le build
            fs.writeFileSync(`${fichier}.tmp`, JSON.stringify(verification.data, null, 2) + "\n");
            fs.renameSync(`${fichier}.tmp`, fichier);
            return repondre(res, 200, { ok: true });
          } catch (error) {
            return repondre(res, 400, { erreurs: [error.message] });
          }
        });
      },
    },
  };
}

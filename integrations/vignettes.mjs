/**
 * Vignettes d'images : elles vivent avec les données (<données>/vignettes/<slug>/),
 * hors de Git, et sont publiées sous la page de chaque projet (/projet/<slug>/vignettes/),
 * donc derrière la même règle d'accès que le reste du projet.
 *
 * - en développement : servies directement depuis le dossier des données ;
 * - au build : copiées dans dist/projet/<slug>/vignettes/.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SLUG = /^[a-z0-9-]+$/;
const FICHIER = /^[a-z0-9-]+\.(webp|svg)$/;
const TYPES = { webp: "image/webp", svg: "image/svg+xml" };

const dossierVignettes = () =>
  path.resolve(process.env.WEBSCOPE_DONNEES || "donnees-fictives", "vignettes");

export default function vignettes() {
  return {
    name: "webscope-vignettes",
    hooks: {
      "astro:server:setup": ({ server }) => {
        server.middlewares.use((req, res, next) => {
          const correspondance = req.url?.match(/^\/projet\/([^/]+)\/vignettes\/([^/?#]+)/);
          if (!correspondance) return next();
          const [, slug, fichier] = correspondance;
          const source = path.join(dossierVignettes(), slug, fichier);
          if (!SLUG.test(slug) || !FICHIER.test(fichier) || !fs.existsSync(source)) return next();
          res.setHeader("Content-Type", TYPES[fichier.split(".").pop()]);
          fs.createReadStream(source).pipe(res);
        });
      },

      "astro:build:done": ({ dir, logger }) => {
        const racine = dossierVignettes();
        if (!fs.existsSync(racine)) return;
        let total = 0;
        for (const slug of fs.readdirSync(racine).filter((s) => SLUG.test(s))) {
          const cible = path.join(fileURLToPath(dir), "projet", slug, "vignettes");
          // Seulement pour un projet dont la page existe
          if (!fs.existsSync(path.dirname(cible))) continue;
          fs.mkdirSync(cible, { recursive: true });
          for (const fichier of fs.readdirSync(path.join(racine, slug)).filter((f) => FICHIER.test(f))) {
            fs.copyFileSync(path.join(racine, slug, fichier), path.join(cible, fichier));
            total++;
          }
        }
        logger.info(`${total} vignette(s) copiée(s)`);
      },
    },
  };
}

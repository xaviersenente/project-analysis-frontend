/**
 * Lance Astro sur les analyses d'une promo (un dossier de project-analysis-backend/data/).
 *
 * Usage :
 *   node scripts/lancer.mjs dev                 données fictives
 *   node scripts/lancer.mjs dev s3-sae          les analyses de la promo s3-sae
 *   node scripts/lancer.mjs build s1-sae
 *   node scripts/lancer.mjs dev s1-sae --port 4322   (les autres options vont à Astro)
 *
 * La promo devient WEBSCOPE_DONNEES, que lisent les données, les notes et les vignettes.
 */
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const racineFrontend = fileURLToPath(new URL("..", import.meta.url));
const racineDonnees = path.resolve(racineFrontend, "../project-analysis-backend/data");
// Même règle que le backend (services/promo/promoService.js)
const PROMO_REGEX = /^s[1-6]-(sae|projet)(-[a-z0-9]+)*$/;

const [commande, ...reste] = process.argv.slice(2);
const promo = reste[0] && !reste[0].startsWith("-") ? reste.shift() : null;

const disponibles = fs.existsSync(racineDonnees)
  ? fs.readdirSync(racineDonnees).filter((d) => PROMO_REGEX.test(d) && fs.existsSync(path.join(racineDonnees, d, "promo.json"))).sort()
  : [];

if (!["dev", "build", "preview"].includes(commande)) {
  console.error("Usage : node scripts/lancer.mjs dev|build|preview [promo] [options d'Astro]");
  process.exit(1);
}
if (promo) {
  if (!PROMO_REGEX.test(promo) || !disponibles.includes(promo)) {
    console.error(`Promo introuvable : « ${promo} ». Disponibles : ${disponibles.join(", ") || "aucune"}`);
    process.exit(1);
  }
  process.env.WEBSCOPE_DONNEES = path.join(racineDonnees, promo);
  console.log(`Promo : ${promo}`);
} else if (!process.env.WEBSCOPE_DONNEES) {
  console.log(`Données fictives (promos disponibles : ${disponibles.join(", ") || "aucune"})`);
}

const astro = path.join(racineFrontend, "node_modules/astro/bin/astro.mjs");
const enfant = spawn(process.execPath, [astro, commande, ...reste], { cwd: racineFrontend, stdio: "inherit", env: process.env });
enfant.on("exit", (code, signal) => (signal ? process.kill(process.pid, signal) : process.exit(code ?? 0)));
for (const s of ["SIGINT", "SIGTERM"]) process.on(s, () => enfant.kill(s));

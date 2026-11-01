/**
 * Génère les données fictives du portfolio S3 (donnees-fictives/s3-sae/) à partir de la grille
 * copiée dans catalogue-criteres.json. Deux portfolios inventés, l'un solide, l'autre fragile,
 * et un projet non analysé. Noms et sites inventés ; captures dessinées en SVG. Le résultat est déterministe.
 *
 * Usage : node scripts/genererPortfoliosFictifs.js
 */
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";

const dossier = path.resolve("donnees-fictives/s3-sae");
const grille = JSON.parse(fs.readFileSync(path.join(dossier, "catalogue-criteres.json"), "utf-8"));

const DATE_RENDU = "2027-01-18T23:59:00+01:00";
const DATE_DEBUT = "2026-11-23T08:00:00+01:00";
const ANALYSE_LE = "2027-01-20T09:30:00+01:00";
const LETTRES = { "A+": 95, A: 90, B: 80, C: 70, D: 60, E: 50, F: 0 };

const sha = (texte) => createHash("sha1").update(texte).digest("hex");

const occ = (fichier, ligne, extrait, fautif = null) => {
  const debut = fautif ? extrait.indexOf(fautif) : -1;
  return { fichier, ligne, colonne: null, extrait, surligne: debut >= 0 ? [debut, debut + fautif.length] : null };
};

// --- Les deux portfolios : leurs mesures, critère par critère ---
// { verdict, valeur, detailValeur, occurrences, raison, proposition }

const PROFILS = {
  "pf-01": {
    nom: "Garnier Lucie",
    site: "https://lucie-garnier.example",
    depot: "lucie-garnier/portfolio",
    couleurs: { fond: "#fdf6ec", texte: "#2b2118", accent: "#c2410c" },
    sessions: 14,
    partFin: 0.18,
    mesures: {
      ED2: {
        proposition: {
          niveau: "partielles",
          justification:
            "Trois projets sur quatre donnent le contexte, le rôle et le résultat. Le processus (recherches, arbitrages) n'est détaillé que pour l'identité du festival ; les deux autres études passent directement du brief au résultat.",
          preuves: [
            occ("/projets/festival-lumieres", 3, "La commande : une identité pour un festival de quartier, en six semaines."),
            occ("/projets/festival-lumieres", 7, "J'ai testé trois pistes typographiques avant de retenir une linéale étroite."),
            occ("/projets/appli-meteo", 3, "Projet de groupe : j'étais en charge du design d'interface."),
          ],
        },
      },
      TE2: { valeur: null, detailValeur: "Astro, données en Markdown · niveau candidat : générateur de site statique", occurrences: [occ("package.json", 12, "\"astro\": \"^5.4.0\"")] },
      TE5: { verdict: "respecte", valeur: 0 },
      Q3: { verdict: "respecte", valeur: 0 },
      Q4: { verdict: "non-respecte", valeur: 1, occurrences: [occ("/projets/appli-meteo", null, "Largeur de la page à 360 px : 412 px (une image de 1 200 px sans max-width)", "412 px")] },
      Q5: { verdict: "respecte", valeur: 0 },
      Q6: { verdict: "respecte", detailValeur: "sitemap.xml (6 adresses) et robots.txt" },
      Q7: { verdict: "respecte", valeur: 68.4, detailValeur: "68.4 pour la page la plus faible ; moyenne 74.1" },
      Q8: { verdict: "non-respecte", valeur: 1, occurrences: [occ("/", null, "fonts.googleapis.com · polices · chargé avant tout consentement", "fonts.googleapis.com")] },
      Q9: { verdict: "respecte", detailValeur: "/mentions-legales" },
      Q10: { verdict: "respecte", detailValeur: "lucie-garnier.example" },
      Q11: { verdict: "respecte", valeur: 0 },
      Q12: { verdict: "respecte", detailValeur: "4 domaines sur 4", occurrences: [occ("QUALITE.md", 1, "# Ma grille qualité")] },
      Q13: {
        proposition: {
          niveau: "pertinente",
          justification:
            "Les critères de QUALITE.md sont tirés du site (images WebP, contraste du bouton orange, menu au clavier) et les mesures les confirment, sauf la largeur à 360 px, que la grille dit vérifiée alors qu'une page déborde.",
          preuves: [occ("QUALITE.md", 9, "Toutes les images sont en WebP, 1 600 px de large au plus."), occ("QUALITE.md", 14, "Aucune page ne dépasse la largeur d'un écran de téléphone.")],
        },
      },
      PR2: { verdict: "respecte", valeur: 3, detailValeur: "Behance, LinkedIn, Instagram" },
      // Acquis du S1
      E2: { verdict: "non-respecte", detailValeur: "5 pages sur 6", occurrences: [occ("/projets/festival-lumieres", 18, '<a href="/projets" class="nav__lien">Projets</a>', '<a href="/projets"')] },
      E10: { verdict: "non-respecte", valeur: 412, occurrences: [occ("/projets/appli-meteo", null, "maquette-meteo.png · 412 Ko", "412 Ko")] },
      G5: { verdict: "respecte", valeur: 3 },
      E11: { verdict: "respecte", valeur: 640 },
      M1: { verdict: "respecte", valeur: 0 },
      A10: { verdict: "respecte", valeur: 0, detailValeur: "18 commande(s) sur 18 atteintes au clavier" },
      A11: { verdict: "respecte", detailValeur: "présent (CSS)" },
      E3: { verdict: "respecte", valeur: 3, detailValeur: "les trois" },
      E4: { verdict: "non-respecte", valeur: 32, occurrences: [occ("/", null, '<button class="menu__bouton" aria-label="Menu">  ← 32 × 32 px', "32 × 32 px")] },
      G8: { verdict: "respecte", valeur: 6, detailValeur: "14 px, 16 px, 20 px, 24 px, 32 px, 48 px" },
      G9: { verdict: "respecte", valeur: 68 },
      PC2: { verdict: "respecte", valeur: 14, detailValeur: "14 sessions sur 31 jours" },
      PC3: { verdict: "respecte", valeur: 88, detailValeur: "7 semaines sur 8" },
      PC4: { verdict: "respecte", detailValeur: "IA.md · 4 usages déclarés", occurrences: [occ("IA.md", 1, "# Usages de l'IA")] },
      PC5: { verdict: "respecte", valeur: 0 },
      PC6: {
        proposition: {
          niveau: "partielle",
          justification:
            "IA.md déclare une aide au code pour le filtre des projets, et l'historique montre bien ce filtre ajouté en une fois. La reprise du code générée n'est pas décrite concrètement.",
          preuves: [occ("IA.md", 6, "J'ai demandé à Claude une première version du filtre par catégorie.")],
        },
      },
    },
    tiers: [{ hote: "fonts.googleapis.com", categorie: "polices", pages: ["/", "/projets", "/a-propos"] }],
    cookies: [],
  },
  "pf-02": {
    nom: "Moreau Théo",
    site: "https://theo-moreau.example",
    depot: "theo-moreau/mon-portfolio",
    couleurs: { fond: "#0f172a", texte: "#e2e8f0", accent: "#22d3ee" },
    sessions: 4,
    partFin: 0.72,
    alertes: [
      { type: "ia-non-declaree", message: "Pas de fichier IA.md", details: "Le sujet traite son absence comme une déclaration mensongère" },
      { type: "fichiers-sensibles", message: "Fichiers sensibles dans le dépôt public", details: "1 élément(s) : .env" },
    ],
    mesures: {
      ED2: {
        proposition: {
          niveau: "survolées",
          justification: "Les pages de projets montrent surtout des images ; le contexte tient en une phrase et ni le rôle ni le processus ne sont décrits.",
          preuves: [occ("/projets/affiche", 3, "Une affiche réalisée en cours.")],
        },
      },
      TE2: { valeur: null, detailValeur: "WordPress, thème du commerce · niveau candidat : configuration d'un thème", occurrences: [occ("(site)", null, "<meta name=\"generator\" content=\"WordPress 6.7\">")] },
      TE3: { verdict: "non-respecte", valeur: 2, occurrences: [occ("style.css", 3, "Theme Name: Portfolia Pro", "Portfolia Pro"), occ("(site)", null, "Crédit en pied de page : « Theme by Portfolia »", "Theme by Portfolia")] },
      TE4: { verdict: "non-respecte", valeur: 1, occurrences: [occ(".env", 1, "DB_PASSWORD=•••••• (valeur masquée)", "DB_PASSWORD")] },
      TE5: { verdict: "non-respecte", valeur: 1, occurrences: [occ("(site)", null, "Swiper 11 chargé, absent de la documentation", "Swiper 11")] },
      Q3: { verdict: "non-respecte", valeur: 12, detailValeur: "12 éléments en erreur", occurrences: [occ("/", null, "color-contrast · #64748b sur #0f172a · 3,4:1", "3,4:1"), occ("/contact", null, "label · <input type=\"email\"> sans étiquette", "sans étiquette")] },
      Q4: { verdict: "respecte", valeur: 0 },
      Q5: { verdict: "non-respecte", valeur: 3, detailValeur: "3 page(s) sur 5", occurrences: [occ("/projets", null, "meta description absente", "absente")] },
      Q6: { verdict: "non-respecte", detailValeur: "robots.txt seul", occurrences: [occ("/sitemap.xml", null, "404", "404")] },
      Q7: { verdict: "non-respecte", valeur: 41.2, detailValeur: "41.2 pour la page la plus faible ; moyenne 47.9", occurrences: [occ("/", null, "EcoIndex 41.2 (E) · 3,8 Mo · 96 requêtes", "41.2")] },
      Q8: { verdict: "non-respecte", valeur: 2, occurrences: [occ("/", null, "www.googletagmanager.com · mesure d'audience", "googletagmanager"), occ("/", null, "fonts.googleapis.com · polices", "fonts.googleapis.com")] },
      Q9: { verdict: "non-respecte", detailValeur: "pas de page de mentions légales" },
      Q10: { verdict: "partiel", detailValeur: "theo-moreau.example · pas de redirection http → https" },
      Q11: { verdict: "non-respecte", valeur: 1, occurrences: [occ("/a-propos", null, "/cv.pdf → 404", "404")] },
      Q12: { verdict: "non-respecte", valeur: 0, detailValeur: "QUALITE.md absent" },
      Q13: { verdict: "non-mesurable", raison: "QUALITE.md absent : rien à confronter (voir Q12)" },
      PR2: { verdict: "non-respecte", valeur: 1, detailValeur: "LinkedIn" },
      // Acquis du S1, oubliés : WordPress et son thème n'excusent pas tout
      G4: { verdict: "partiel", detailValeur: "woff2 ✓ · swap ✕ · pile de secours ✓", occurrences: [occ("/", null, "@font-face « Poppins » 700 : font-display auto", "font-display auto")] },
      G5: { verdict: "non-respecte", valeur: 9, occurrences: [occ("/", null, "poppins-v20-latin-100.woff2 · 8 Ko"), occ("/", null, "poppins-v20-latin-900.woff2 · 8 Ko")] },
      G6: { verdict: "non-respecte", detailValeur: "aucun preload" },
      A4: { verdict: "non-respecte", valeur: 4, occurrences: [occ("/", 212, '<h4 class="elementor-heading-title">Mes projets</h4>', "<h4")] },
      A5: { verdict: "non-respecte", valeur: 62.5, occurrences: [occ("/projets", 148, '<img src="https://theo-moreau.example/wp-content/uploads/affiche.jpg" class="attachment-full">', "<img")] },
      A8: { verdict: "non-respecte", valeur: 50, occurrences: [occ("/", 61, '<button class="menu-toggle"><span class="burger"></span></button>', '<button class="menu-toggle">')] },
      E2: { verdict: "non-respecte", detailValeur: "0 pages sur 5" },
      E7: { verdict: "non-respecte", valeur: 3, occurrences: [occ("/", 230, '<a href="/projets/affiche">En savoir plus</a>', "En savoir plus")] },
      E10: { verdict: "non-respecte", valeur: 1840, occurrences: [occ("/", null, "fond-accueil.jpg · 1840 Ko", "1840 Ko"), occ("/projets", null, "affiche.jpg · 620 Ko", "620 Ko")] },
      E11: { verdict: "non-respecte", valeur: 2900, occurrences: [occ("/", null, "2900 Ko transférés", "2900 Ko")] },
      E12: { verdict: "non-respecte", valeur: 0, occurrences: [occ("/", null, "fond-accueil.jpg · image/jpeg", "image/jpeg")] },
      E13: { verdict: "non-respecte", valeur: 40, occurrences: [occ("/projets", 148, '<img src="…/affiche.jpg" class="attachment-full">', "<img")] },
      E9: { verdict: "non-respecte", valeur: 0 },
      A10: { verdict: "non-respecte", valeur: 9, detailValeur: "3 commande(s) sur 12 atteintes au clavier", occurrences: [occ("/", null, '<a class="elementor-item" href="/projets">  ← aucun changement visible au focus', "aucun changement visible")] },
      A11: { verdict: "non-respecte", detailValeur: "absent", occurrences: [occ("/", null, "42 animation(s) au chargement", "42 animation(s)")] },
      E3: { verdict: "partiel", valeur: 1, detailValeur: "manque :focus-visible, :active" },
      A14: { verdict: "non-respecte", valeur: 412, detailValeur: "5 pages sur 5, à 180 px", occurrences: [occ("/", null, '<div class="elementor-container">  ← dépasse jusqu\'à 412 px', "412 px")] },
      G8: { verdict: "non-respecte", valeur: 13, detailValeur: "11 px, 12 px, 13 px, 14 px, 15 px, 16 px, 18 px, 20 px, 22 px, 26 px, 30 px, 40 px, 64 px" },
      G9: { verdict: "non-respecte", valeur: 142, occurrences: [occ("/a-propos", null, '<p class="elementor-text">  ← 142 caractères par ligne à 1280 px', "142 caractères")] },
      M1: { verdict: "non-respecte", valeur: 23, occurrences: [occ("/", 44, '<div class="elementor-widget-wrap">  ← Element “div” not allowed as child of element “ul” in this context.', "div")] },
      PC2: { verdict: "non-respecte", valeur: 4, detailValeur: "4 sessions sur 5 jours" },
      PC3: { verdict: "non-respecte", valeur: 25, detailValeur: "2 semaines sur 8" },
      PC4: { verdict: "non-respecte", detailValeur: "IA.md absent" },
      PC5: { verdict: "non-respecte", valeur: 1, occurrences: [occ("(historique)", null, "Co-authored-by: Copilot dans 3 commits", "Copilot")] },
      PC6: { verdict: "non-mesurable", raison: "IA.md absent : rien à confronter (voir PC4)" },
    },
    tiers: [
      { hote: "www.googletagmanager.com", categorie: "mesure d'audience", pages: ["/", "/projets", "/contact"] },
      { hote: "fonts.googleapis.com", categorie: "polices", pages: ["/", "/projets"] },
    ],
    cookies: [{ nom: "_ga", domaine: ".theo-moreau.example", tiers: false }],
  },
};

const PROMO = [
  { slug: "pf-01", nom: "Garnier Lucie", groupe: "S3 · TP A" },
  { slug: "pf-02", nom: "Moreau Théo", groupe: "S3 · TP B" },
  { slug: "pf-03", nom: "Lambert Chloé", groupe: "S3 · TP A" },
];

// --- Les critères, d'après la grille ---

const criteresDe = (profil) =>
  grille.criteres.map((modele) => {
    const m = profil.mesures[modele.id] ?? {};
    const base = {
      id: modele.id,
      axe: modele.axe,
      libelle: modele.libelle,
      statut: modele.statut,
      methode: modele.methode,
      verdict: "respecte",
      valeur: null,
      seuil: modele.seuil,
      points: modele.statut === "C" ? { obtenus: null, max: modele.points } : null,
      piste: modele.piste,
      sourceCours: modele.sourceCours,
      ...(modele.origine ? { origine: modele.origine } : {}),
      ...(modele.propositionDepuis ? { propositionDepuis: modele.propositionDepuis } : {}),
      occurrences: [],
      totalOccurrences: 0,
    };
    if (modele.methode === "manuel") return { ...base, verdict: "a-juger" };
    if (modele.methode === "ia") {
      if (m.verdict === "non-mesurable") return { ...base, echelle: modele.echelle, verdict: "non-mesurable", raison: m.raison };
      const proposition = { ...m.proposition, preuvesEcartees: 0, modele: "claude-opus-5-5", prompt: "fictif000000" };
      return { ...base, echelle: modele.echelle, verdict: "a-juger", detailValeur: `niveau proposé : ${proposition.niveau}`, proposition, occurrences: proposition.preuves, totalOccurrences: proposition.preuves.length };
    }
    const occurrences = m.occurrences ?? [];
    return {
      ...base,
      verdict: m.verdict ?? "respecte",
      valeur: m.valeur ?? (modele.seuil ? 0 : null),
      ...(m.detailValeur ? { detailValeur: m.detailValeur } : {}),
      ...(m.raison ? { raison: m.raison } : {}),
      occurrences,
      totalOccurrences: occurrences.length,
    };
  });

/** Points proposés au jury (Q2), comme l'analyse : respectée 1, partielle ½, non respectée 0, au demi-point */
const APPORT = { respecte: 1, partiel: 0.5, "non-respecte": 0 };
const proposerPoints = (criteres) => {
  for (const c of criteres.filter((c) => c.propositionDepuis)) {
    const mesures = c.propositionDepuis.map((id) => criteres.find((m) => m.id === id)).filter((m) => m && m.verdict in APPORT);
    const valeur = Math.round((mesures.reduce((s, m) => s + APPORT[m.verdict], 0) / mesures.length) * c.points.max * 2) / 2;
    c.pointsProposes = { valeur, max: c.points.max, mesures: mesures.map((m) => ({ id: m.id, verdict: m.verdict })) };
    c.detailValeur = `proposé : ${String(valeur).replace(".", ",")} / ${c.points.max}`;
  }
  return criteres;
};

/** Note : tout est à juger ; les points viennent des notes de l'enseignant (mode local) */
const noteDe = () => {
  const parAxe = Object.fromEntries(
    grille.axes.map((axe) => [axe.id, { obtenus: 0, max: grille.criteres.filter((c) => c.axe === axe.id && c.statut === "C").reduce((s, c) => s + c.points, 0) }])
  );
  const max = Object.values(parAxe).reduce((s, a) => s + a.max, 0);
  return { base: 0, max, total: 20, bonus: 0, totale: 0, lettre: "—", lettres: LETTRES, aJuger: max, parAxe };
};

// --- Historique : des sessions étalées (pf-01) ou tassées avant le rendu (pf-02) ---

const isoParis = (ms) => new Date(ms + 3600e3).toISOString().replace(/\.\d{3}Z$/, "+01:00");
const MESSAGES = ["Structure des pages", "Grille des projets", "Étude de cas du festival", "Mentions légales", "Menu mobile", "Images en WebP", "JOURNAL : semaine", "Corrections de contraste", "Page à propos", "Filtre des projets"];

const historiqueDe = (slug, profil) => {
  const rendu = Date.parse(DATE_RENDU);
  const debut = Date.parse(DATE_DEBUT);
  const fin48 = rendu - 48 * 3600e3;
  const sessions = [];
  const commits = [];
  for (let i = 0; i < profil.sessions; i++) {
    const tard = i >= profil.sessions * (1 - profil.partFin);
    const t0 = tard ? fin48 + ((i % 3) + 1) * 9 * 3600e3 : debut + (i / profil.sessions) * (fin48 - debut) + 14 * 3600e3;
    const n = 2 + (i % 3);
    for (let k = 0; k < n; k++) {
      const t = t0 + k * 25 * 60e3;
      const message = slug === "pf-02" && k === 1 ? "update" : `${MESSAGES[(i + k) % MESSAGES.length]}`;
      commits.push({
        sha: sha(`${slug}-${i}-${k}`).slice(0, 40),
        auteur: profil.nom,
        dateAuteur: isoParis(t),
        dateCommit: isoParis(t),
        message,
        ajouts: 20 + ((i * 37 + k * 11) % 180),
        suppressions: (i * 13 + k * 7) % 40,
        fichiers: 1 + ((i + k) % 5),
        drapeaux: message === "update" ? ["message-generique"] : [],
      });
    }
    sessions.push({ debut: isoParis(t0), fin: isoParis(t0 + (n - 1) * 25 * 60e3), commits: n });
  }
  const dernieres48 = commits.filter((c) => Date.parse(c.dateAuteur) >= fin48).length;
  const jours = new Set(commits.map((c) => c.dateAuteur.slice(0, 10))).size;
  return {
    dateRendu: DATE_RENDU,
    seuils: { sessionsMin: 10, joursMin: 10, partDernieres48hMax: 0.3 },
    indicateurs: {
      commits: commits.length,
      sessions: sessions.length,
      joursActifs: jours,
      dureeProjetJours: Math.round((Date.parse(commits.at(-1).dateAuteur) - Date.parse(commits[0].dateAuteur)) / 864e5),
      dureeEstimeeMinutes: sessions.reduce((s, x) => s + (Date.parse(x.fin) - Date.parse(x.debut)) / 60e3 + 30, 0),
      partDernieres48h: Math.round((dernieres48 / commits.length) * 100) / 100,
      plusGrosCommit: Math.max(...commits.map((c) => c.ajouts + c.suppressions)),
      commitsAutreAuteur: 0,
    },
    sessions,
    commits,
    tags: [],
  };
};

// --- Le site parcouru, avec ses captures dessinées ---

const PAGES = [
  { chemin: "/", titre: "Accueil" },
  { chemin: "/projets", titre: "Projets" },
  { chemin: "/projets/festival-lumieres", titre: "Festival des lumières" },
  { chemin: "/projets/appli-meteo", titre: "Appli météo" },
  { chemin: "/a-propos", titre: "À propos" },
  { chemin: "/contact", titre: "Contact" },
];

const nomCapture = (chemin, largeur) => `${sha(chemin).slice(0, 12)}-${largeur}.svg`;

/** Une maquette de page : en-tête, grand titre, cartes de projets ; plus haute en mobile */
const dessinerPage = (profil, page, largeur) => {
  const { fond, texte, accent } = profil.couleurs;
  const colonnes = largeur >= 1280 ? 3 : largeur >= 768 ? 2 : 1;
  const marge = largeur >= 768 ? 48 : 20;
  const carteL = (largeur - 2 * marge - (colonnes - 1) * 24) / colonnes;
  const rangs = Math.ceil(6 / colonnes);
  const hauteur = 520 + rangs * (carteL * 0.75 + 70) + 200;
  const cartes = Array.from({ length: 6 }, (_, i) => {
    const x = marge + (i % colonnes) * (carteL + 24);
    const y = 520 + Math.floor(i / colonnes) * (carteL * 0.75 + 70);
    return `<rect x="${x}" y="${y}" width="${carteL}" height="${carteL * 0.75}" rx="8" fill="${accent}" opacity="${0.35 + (i % 3) * 0.2}"/><rect x="${x}" y="${y + carteL * 0.75 + 16}" width="${carteL * 0.6}" height="14" rx="4" fill="${texte}" opacity="0.7"/>`;
  }).join("");
  const titre = page.titre.replace(/&/g, "&amp;");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${largeur}" height="${Math.round(hauteur)}" viewBox="0 0 ${largeur} ${Math.round(hauteur)}">
<rect width="100%" height="100%" fill="${fond}"/>
<rect x="${marge}" y="28" width="120" height="20" rx="4" fill="${texte}"/>
<rect x="${largeur - marge - (largeur >= 768 ? 280 : 28)}" y="28" width="${largeur >= 768 ? 280 : 28}" height="20" rx="4" fill="${texte}" opacity="0.5"/>
<text x="${marge}" y="${largeur >= 768 ? 260 : 220}" font-family="system-ui, sans-serif" font-size="${largeur >= 768 ? 64 : 36}" font-weight="700" fill="${texte}">${titre}</text>
<rect x="${marge}" y="${largeur >= 768 ? 300 : 250}" width="${Math.min(520, largeur - 2 * marge)}" height="14" rx="4" fill="${texte}" opacity="0.4"/>
<rect x="${marge}" y="${largeur >= 768 ? 330 : 276}" width="${Math.min(420, largeur - 2 * marge - 40)}" height="14" rx="4" fill="${texte}" opacity="0.4"/>
<rect x="${marge}" y="${largeur >= 768 ? 380 : 320}" width="160" height="44" rx="22" fill="${accent}"/>
${cartes}
</svg>
`;
};

const parcoursDe = (slug, profil) => {
  const pf02 = slug === "pf-02";
  const pages = PAGES.filter((p) => !(pf02 && p.chemin === "/projets/festival-lumieres")).map((p, i) => {
    const largeurs = p.chemin === "/" ? [360, 768, 1280] : [360];
    const m = profil.mesures;
    return {
      chemin: p.chemin,
      url: profil.site + p.chemin,
      statut: 200,
      titre: `${p.titre} · ${profil.nom.split(" ").reverse().join(" ")}`,
      poidsKo: pf02 ? 2900 + i * 180 : 640 + i * 70,
      requetes: pf02 ? 80 + i * 4 : 18 + i * 2,
      dom: pf02 ? 1400 + i * 60 : 420 + i * 30,
      ecoindex: pf02 ? { score: 41.2 + i * 2.1, note: "E" } : { score: 68.4 + i * 1.9, note: "B" },
      debordement: !pf02 && p.chemin === "/projets/appli-meteo",
      violations: pf02 ? (i < 3 ? 4 : 0) : 0,
      tiers: (m.Q8?.valeur ?? 0) && i < 3 ? m.Q8.valeur : 0,
      captures: largeurs.map((largeur) => ({ largeur, image: `captures/${nomCapture(p.chemin, largeur)}` })),
    };
  });
  return {
    url: profil.site + "/",
    parcouruLe: ANALYSE_LE,
    https: { actif: true, redirection: !pf02 },
    robots: true,
    sitemap: { present: !pf02, urls: pf02 ? 0 : 6 },
    nonParcourues: 0,
    pages,
    tiers: profil.tiers,
    cookies: profil.cookies,
  };
};

// --- La fiche de soutenance : un passage tiré, trois questions ---

const CODE = `const boutons = document.querySelectorAll(".filtre");
const cartes = document.querySelectorAll(".projet");

boutons.forEach((bouton) => {
  bouton.addEventListener("click", () => {
    const categorie = bouton.dataset.categorie;
    boutons.forEach((b) => b.setAttribute("aria-pressed", b === bouton));
    cartes.forEach((carte) => {
      const visible = categorie === "tout" || carte.dataset.categorie === categorie;
      carte.hidden = !visible;
    });
  });
});`;

const soutenanceDe = (slug) => ({
  graine: `${slug}·${sha(slug).slice(0, 7)}·1`,
  candidats: slug === "pf-01" ? 9 : 3,
  tirages: [
    {
      fichier: slug === "pf-01" ? "src/scripts/filtres.js" : "wp-content/themes/enfant/js/menu.js",
      debut: 1,
      fin: 13,
      langage: "javascript",
      code: CODE,
      questions: [
        { question: "Pourquoi mettre à jour aria-pressed sur tous les boutons, et pas seulement sur celui cliqué ?", attendu: "Un seul filtre est actif : les autres doivent annoncer qu'ils ne le sont plus.", lignes: { debut: 7, fin: 7 } },
        { question: "Que se passe-t-il pour une carte sans data-categorie ?", attendu: "Elle n'est visible que pour le filtre « tout ».", lignes: { debut: 9, fin: 10 } },
        { question: "Pourquoi hidden plutôt qu'une classe CSS ?", attendu: "La carte est retirée de l'affichage et de l'arbre d'accessibilité, sans feuille de style.", lignes: { debut: 10, fin: 10 } },
      ],
    },
  ],
  ia: { statut: "proposees", modele: "claude-opus-5-5", prompt: "fictif000000", ecartees: 0 },
});

// --- Écriture ---

const resultatDe = (slug) => {
  const profil = PROFILS[slug];
  const version = sha(`${slug}-v1`);
  return {
    version: 3,
    grille: { id: grille.id, nom: grille.nom, profil: grille.profil, axes: grille.axes },
    source: { depot: profil.depot, ref: version.slice(0, 7), sha: version, raison: "dernier commit avant la date de rendu", analyseLe: ANALYSE_LE },
    projet: { slug, nom: profil.nom, groupe: PROMO.find((p) => p.slug === slug).groupe },
    liens: { site: profil.site + "/", depot: `https://github.com/${profil.depot}`, figma: null },
    note: noteDe(),
    criteres: proposerPoints(criteresDe(profil)),
    alertes: profil.alertes ?? [],
    nonMesurable: [],
    historique: historiqueDe(slug, profil),
    parcours: parcoursDe(slug, profil),
    soutenance: soutenanceDe(slug),
  };
};

fs.writeFileSync(
  path.join(dossier, "promo.json"),
  JSON.stringify(
    {
      promo: "Portfolio S3 · 2026-2027 (données fictives)",
      grille: grille.id,
      dateRendu: DATE_RENDU,
      dateDebut: DATE_DEBUT,
      ia: { mode: "claude-code", criteres: true, questionsSoutenance: true },
      projets: PROMO,
    },
    null,
    2
  ) + "\n"
);

for (const slug of Object.keys(PROFILS)) {
  const resultat = resultatDe(slug);
  const captures = path.join(dossier, "captures", slug);
  fs.rmSync(captures, { recursive: true, force: true });
  fs.mkdirSync(captures, { recursive: true });
  for (const page of resultat.parcours.pages) {
    for (const c of page.captures) {
      fs.writeFileSync(path.join(captures, path.basename(c.image)), dessinerPage(PROFILS[slug], PAGES.find((p) => p.chemin === page.chemin), c.largeur));
    }
  }
  fs.writeFileSync(path.join(dossier, `${slug}.json`), JSON.stringify(resultat, null, 2) + "\n");
}

// Mode local : une évaluation commencée pour pf-01 (points, niveau de l'IA validé, un autre corrigé)
const LE = "2027-01-21T10:00:00+01:00";
fs.mkdirSync(path.join(dossier, "notes"), { recursive: true });
fs.writeFileSync(
  path.join(dossier, "notes", "pf-01.json"),
  JSON.stringify(
    {
      commentaire: "Un portfolio cohérent, une direction artistique affirmée. Détaillez davantage le processus dans les études de cas.",
      criteres: {
        DA1: { points: 3, commentaire: "Palette et typographie tenues sur tout le site.", le: LE },
        ED1: { points: 2, commentaire: null, le: LE },
        Q2: { points: 1.5, commentaire: null, le: LE },
        ED2: { niveau: "partielles", commentaire: null, le: LE },
        Q13: { niveau: "partielle", commentaire: "La grille annonce la largeur à 360 px vérifiée, ce que la mesure contredit.", le: LE },
      },
    },
    null,
    2
  ) + "\n"
);

console.log(`Portfolios fictifs écrits dans ${dossier}`);

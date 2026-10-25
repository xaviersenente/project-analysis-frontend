/**
 * Génère les données fictives de donnees-fictives/ à partir du catalogue des critères.
 * Noms inventés, écrits « Nom Prénom » (règle du cahier des charges). Le résultat est déterministe.
 *
 * Usage : node scripts/genererDonneesFictives.js
 */
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";

const dossier = path.resolve("donnees-fictives");
const catalogue = JSON.parse(
  fs.readFileSync(path.join(dossier, "catalogue-criteres.json"), "utf-8")
);

const GRADES = [["A+", 95], ["A", 90], ["B", 80], ["C", 70], ["D", 60], ["E", 50], ["F", 0]];
const lettre = (pourcentage) => GRADES.find(([, seuil]) => pourcentage >= seuil)[0];

// --- Occurrences d'exemple, avec la partie fautive surlignée ---

const occ = (fichier, ligne, colonne, extrait, fautif) => {
  const debut = fautif ? extrait.indexOf(fautif) : -1;
  return {
    fichier,
    ligne,
    colonne,
    extrait,
    surligne: debut >= 0 ? [debut, debut + fautif.length] : null,
  };
};

const OCCURRENCES = {
  G1: [occ("css/style.css", 3, 3, "--jaune: #f5c518;", "--jaune")],
  // Douze couleurs en dur : de quoi tester le repli au-delà de cinq
  G2: [
    ["carte", "color", "#7b7b7b", 142],
    ["bouton", "background", "#222", 188],
    ["entete", "background-color", "#fff", 31],
    ["nav__lien", "color", "#1a1a1a", 54],
    ["pied", "background", "#f5c518", 260],
    ["titre", "color", "#111", 70],
    ["carte__date", "color", "#999", 151],
    ["bouton:hover", "background", "#000", 195],
    ["formulaire", "border-color", "#ccc", 221],
    ["citation", "border-left-color", "#f5c518", 240],
    ["legende", "color", "#9a9a9a", 247],
    ["equipe__nom", "color", "#333", 172],
  ].map(([classe, propriete, couleur, ligne]) =>
    occ("css/style.css", ligne, 3, `.${classe} { ${propriete}: ${couleur}; }`, couleur)
  ),
  G3: [occ("css/style.css", 97, 3, ".entete { padding: 18px 24px; }", "18px 24px")],
  G7: [occ("css/style.css", 61, 3, "h2 { font-size: 22px; line-height: 28px; }", "22px")],
  G11: [
    occ("index.html", 41, 9, "<h2 class=\"section__titre\">  ← « Upcoming events » : taille 36 px → 28 px, graisse 600 → 700", "taille 36 px → 28 px"),
    occ("index.html", 58, 11, "<p class=\"carte__date\">  ← « 23 FEB » : police Inter → Arial", "police Inter → Arial"),
    occ("index.html", null, null, "« Growing all around the globe. »  ← absent de la page (écran « Home Mobile »)", "absent de la page"),
    occ("team.html", 72, 11, "<p class=\"membre__poste\">  ← « UX Designer @Google » : couleur #000000 → #d4145a", "couleur #000000 → #d4145a"),
    occ("css/style.css", 12, 3, "<a class=\"bouton\">  ← #d4145a absente de la maquette", "#d4145a"),
  ],
  E1: [occ("js/menu.js", 4, 3, "bouton.addEventListener(\"click\", () => menu.classList.toggle(\"ouvert\"));", "classList.toggle")],
  E2: [occ("about.html", 14, 9, "<a href=\"about.html\" class=\"nav__lien\">À propos</a>", "<a href=\"about.html\"")],
  E4: [occ("index.html", 22, 7, "<a class=\"pied__icone\" href=\"…\">", "pied__icone")],
  E7: [
    occ("index.html", 48, 9, "<a href=\"works.html\">Voir plus</a>", "Voir plus"),
    occ("events.html", 31, 9, "<a href=\"event.html\">En savoir plus</a>", "En savoir plus"),
  ],
  E10: [occ("assets/img/equipe.jpg", null, null, "equipe.jpg · 312 Ko · 2400 × 1600", "312 Ko")],
  E12: [occ("assets/img/equipe.jpg", null, null, "equipe.jpg (JPEG)", "JPEG")],
  A3: [
    occ("contact.html", 12, 5, "<nav class=\"nav\">", "<nav class=\"nav\">"),
    occ("team.html", 9, 3, "<div class=\"contenu\">", "<div class=\"contenu\">"),
  ],
  A4: [occ("works.html", 27, 5, "<h4 class=\"projet__titre\">Brand Lab</h4>", "<h4")],
  A5: [occ("team.html", 41, 9, "<img src=\"assets/img/clara.webp\" width=\"320\" height=\"320\">", "<img src=\"assets/img/clara.webp\"")],
  A8: [occ("index.html", 18, 7, "<button class=\"burger\"><span></span><span></span></button>", "<button class=\"burger\">")],
  A10: [occ("css/style.css", 210, 3, ".nav__lien:focus { outline: none; }", "outline: none")],
  A11: [occ("css/style.css", 230, 3, ".carte { transition: transform 0.3s; }", "transition")],
  A12: [occ("index.html", 52, 7, "<p class=\"legende\">#9a9a9a sur #ffffff · 2,8:1 · requis 4,5:1</p>", "2,8:1")],
  A15: [occ("(site)", null, null, "blockquote : absente de toutes les pages", "blockquote")],
  M1: [
    occ("contact.html", 33, 11, "<label for=\"email\">Courriel</label><input id=\"mail\">", "id=\"mail\""),
    occ("works.html", 58, 5, "<p><div class=\"projet\">", "<div"),
  ],
  M3: [
    occ("css/style.css", 77, 3, "#hero { margin-top: 0; }", "#hero"),
    occ("css/style.css", 154, 11, ".titre { color: var(--texte) !important; }", "!important"),
  ],
  M4: [occ("js/menu.js", 4, 3, "bouton.addEventListener(\"click\", () => menu.classList.toggle(\"ouvert\"));", "classList.toggle")],
  M5: [occ("css/style.css", 301, 1, ".ancienne-carte { … }", ".ancienne-carte")],
  M8: [occ("assets/img/Photo Équipe.JPG", null, null, "assets/img/Photo Équipe.JPG", "Photo Équipe.JPG")],
  M12: [occ("README.md", 6, 1, "- URL Figma : ", "URL Figma : ")],
};

// --- Ce que l'outil relève pour aider à juger les critères manuels ---

const ELEMENTS_A_JUGER = {
  A6: [
    occ("index.html", 34, 9, "<img src=\"assets/img/IMG_2041.webp\" alt=\"IMG_2041.webp\">", "alt=\"IMG_2041.webp\""),
    occ("team.html", 22, 9, "<img src=\"assets/img/equipe.webp\" alt=\"Photo de l'équipe\">", "alt=\"Photo de l'équipe\""),
    occ("works.html", 18, 11, "<img src=\"assets/img/brand-lab.webp\" alt=\"Affiche Brand Lab sur fond jaune\">", null),
    occ("index.html", 12, 7, "<img src=\"assets/svg/logo.svg\" alt=\"\">", null),
  ],
  A16: [
    occ("events.html", 27, 11, "<p class=\"evenement__date\">12 mars 2027</p>", "<p class=\"evenement__date\">"),
    occ("about.html", 40, 7, "<div class=\"chiffre\"><span>12</span> projets</div>", null),
    occ("team.html", 31, 7, "<figure><img src=\"…\" alt=\"…\"><figcaption>Clara, directrice artistique</figcaption></figure>", null),
  ],
};

// --- Profils : quels critères échouent, et comment ---

const PROFILS = {
  "etu-01": {
    nom: "Lemoine Clara",
    groupe: "TP B2",
    echecs: ["G2", "G3", "G11", "E2", "E7", "E10", "A3", "A5", "A10", "A12", "M1", "M3", "M4", "M5"],
    partiels: ["G7", "A4", "E12"],
    recommandations: ["G6", "G9", "E6", "E13", "A9", "M11"],
    nonMesurables: {},
    bem: 74,
    alertes: [
      { type: "js-remplace-css", message: "JavaScript détecté qui remplace du CSS", details: "js/menu.js, chargé sur 8 pages" },
      { type: "autre-auteur", message: "Commits d'un autre auteur", details: "2 commits de t.marchal" },
    ],
  },
  "etu-02": {
    nom: "Marchal Hugo",
    groupe: "TP A1",
    echecs: ["G1", "E1", "E4", "A8", "A11", "A15", "M8", "M12"],
    partiels: ["G2", "M1"],
    recommandations: ["G5", "E9", "M6", "M14"],
    // Échec partiel : le navigateur n'a pas pu tourner
    nonMesurables: {
      E4: "Lighthouse a dépassé le délai (90 s)",
      E5: "Lighthouse a dépassé le délai (90 s)",
      A12: "Lighthouse a dépassé le délai (90 s)",
      A13: "Lighthouse a dépassé le délai (90 s)",
      A14: "Lighthouse a dépassé le délai (90 s)",
      E11: "Lighthouse a dépassé le délai (90 s)",
      E15: "Lighthouse a dépassé le délai (90 s)",
      M9: "Lighthouse a dépassé le délai (90 s)",
      G11: "Pas de lien vers la maquette Figma (fichier de promo ou README)",
    },
    bem: 38,
    alertes: [
      { type: "site-inaccessible", message: "Site inaccessible en ligne", details: "https://hugo-marchal.github.io/sae105/ répond 404 ; l'analyse du dépôt reste valable" },
    ],
  },
  "etu-03": {
    nom: "Roux Inès",
    groupe: "TP B1",
    echecs: ["E7", "M5"],
    partiels: ["G3"],
    recommandations: ["G9", "E13"],
    nonMesurables: {},
    bem: 92,
    alertes: [
      { type: "site-non-a-jour", message: "Le site en ligne n'est pas la version évaluée", details: "déployé : 4c1d2e9 le 17/01/2027 10:12" },
    ],
  },
  "etu-04": {
    nom: "Benali Yanis",
    groupe: "TP A2",
    echecs: ["G1", "G2", "G4", "E1", "E2", "E3", "E8", "A1", "A3", "A4", "A7", "A10", "A15", "M1", "M2", "M4", "M10"],
    partiels: ["G7", "E12", "A5", "M5"],
    recommandations: ["G5", "G6", "G8", "E6", "E9", "E14", "A9", "M6", "M11", "M14"],
    nonMesurables: {},
    bem: 12,
    alertes: [
      { type: "pages-404", message: "Adresses en erreur sur le site en ligne", details: "Contact.html (404, casse), /assets/fonts/titre.woff2 (404, chemin en /)" },
      { type: "historique-reecrit", message: "Historique Git réécrit", details: "push --force le 14/01/2027" },
    ],
  },
};

// Projets de la promo : deux ne sont pas analysés
const PROMO = [
  ...Object.entries(PROFILS).map(([slug, p]) => ({ slug, nom: p.nom, groupe: p.groupe })),
  { slug: "etu-05", nom: "Fontaine Léa", groupe: "TP A1" },
  { slug: "etu-06", nom: "Garnier Noah", groupe: "TP B2" },
];

// --- Valeurs mesurées d'exemple ---

const valeurPour = (c, verdict) => {
  if (!c.seuil || verdict === "non-mesurable" || verdict === "a-juger") return null;
  const { operateur, nombre } = c.seuil;
  const ok = verdict === "respecte";
  const partiel = verdict === "partiel";
  if (c.id === "M7") return null; // fixé à part
  if (operateur === "=") return ok ? nombre : nombre === 100 ? (partiel ? 86 : 71) : partiel ? 1 : 3;
  // Un compte reste entier ; seul un score Lighthouse peut avoir une décimale
  const arrondi = (v) => (c.seuil.unite === "" ? Math.round(v * 10) / 10 : Math.round(v));
  if (operateur === "≥" || operateur === ">") return ok ? arrondi(Math.max(nombre * 1.05, nombre + 1)) : partiel ? Math.round(nombre * 0.9) : Math.round(nombre * 0.6);
  return ok ? Math.round(nombre * 0.7) : partiel ? Math.round(nombre * 1.2) : Math.round(nombre * 2);
};

// Points max par critère : les points de l'axe répartis entre ses contraintes
const pointsMax = Object.fromEntries(
  catalogue.axes.flatMap((axe) => {
    const contraintes = catalogue.criteres.filter((c) => c.axe === axe.id && c.statut === "C");
    const base = Math.floor(axe.points / contraintes.length);
    let reste = axe.points - base * contraintes.length;
    return contraintes.map((c) => [c.id, base + (reste-- > 0 ? 1 : 0)]);
  })
);

// --- Vue par page : chaque contrôle suit le verdict de son critère ---

const PAGES = [
  ["index.html", "BBrands Agency — Accueil"],
  ["works.html", "Nos réalisations"],
  ["work.html", "Brand Lab"],
  ["about.html", "À propos"],
  ["team.html", "L'équipe"],
  ["events.html", "Événements"],
  ["event.html", "Brand Day 2027"],
  ["contact.html", "Contact"],
];

// Contrôle → [critère, pages en échec (null : toutes), détail de l'échec, détail du succès]
const CONTROLES = {
  lang: ["A1", ["about.html", "team.html"], "lang absent sur <html>", "lang=\"fr\""],
  titleUnique: ["A2", ["work.html", "event.html"], "même title que la page d'accueil", "title propre à la page"],
  descriptionUnique: ["A2", ["work.html", "event.html"], "meta description en double", "description propre à la page"],
  reperes: ["A3", ["contact.html", "team.html"], "main absent ; nav sans aria-label", "header, nav, main, footer"],
  h1Unique: ["A4", ["works.html"], "2 h1", "1 h1"],
  titresSansSaut: ["A4", ["works.html"], "h2 → h4", "aucun niveau sauté"],
  menuPopover: ["E1", null, "menu ouvert par js/menu.js", "popover et popovertarget"],
  ariaCurrent: ["E2", ["about.html", "events.html"], "aucun lien aria-current", "aria-current=\"page\""],
};

const genererPages = (criteres, profil) => {
  const verdictDe = (id) => criteres.find((c) => c.id === id);
  return PAGES.map(([fichier, titre], numero) => {
    const controles = {};
    for (const [cle, [id, enEchec, detailEchec, detailSucces]] of Object.entries(CONTROLES)) {
      const c = verdictDe(id);
      if (c.verdict === "non-mesurable") {
        controles[cle] = { verdict: "non-mesurable", detail: c.raison };
      } else if (["non-respecte", "partiel"].includes(c.verdict) && (enEchec === null || enEchec.includes(fichier))) {
        // Sans motif JavaScript (M4 respecté), le menu repose sur une case à cocher
        const sansJs = cle === "menuPopover" && !["non-respecte", "partiel"].includes(verdictDe("M4").verdict);
        controles[cle] = { verdict: "non-respecte", detail: sansJs ? "menu en case à cocher, sans popover" : detailEchec };
      } else {
        controles[cle] = { verdict: "respecte", detail: detailSucces };
      }
    }
    // Validation W3C : des erreurs sur deux pages quand M1 n'est pas respecté
    const m1 = verdictDe("M1");
    const erreurs = ["non-respecte", "partiel"].includes(m1.verdict)
      ? { "contact.html": 3, "works.html": 2 }[fichier] ?? 0
      : 0;
    controles.w3c = {
      verdict: erreurs ? "non-respecte" : "respecte",
      valeur: String(erreurs),
      detail: erreurs ? `${erreurs} erreurs de validation` : "aucune erreur",
    };
    // Lighthouse Accessibilité, page par page
    const a13 = verdictDe("A13");
    if (a13.verdict === "non-mesurable") {
      controles.lighthouseA11y = { verdict: "non-mesurable", detail: a13.raison };
    } else {
      const score = [100, 96, 98, 100, 92, 97, 100, profil.echecs.includes("A12") ? 89 : 95][numero];
      controles.lighthouseA11y = {
        verdict: score >= 95 ? "respecte" : "non-respecte",
        valeur: String(score),
        detail: score >= 95 ? `score ${score}` : `score ${score}, objectif 95`,
      };
    }
    return { fichier, titre, controles };
  });
};

// --- Ressources : images, polices, arborescence ---

const genererRessources = (criteres, profil) => {
  const verdict = (id) => criteres.find((c) => c.id === id).verdict;
  const echoue = (id) => ["non-respecte", "partiel"].includes(verdict(id));

  const images = [
    { fichier: "assets/svg/logo.svg", format: "svg", poidsKo: 4, largeur: 120, hauteur: 32, alt: "", loading: "eager", pages: PAGES.map(([f]) => f) },
    { fichier: "assets/img/hero.avif", format: "avif", poidsKo: 86, largeur: 1080, hauteur: 1350, alt: "Affiche de la Brand Day sur fond jaune", loading: "eager", pages: ["index.html"] },
    { fichier: "assets/img/IMG_2041.webp", format: "webp", poidsKo: 64, largeur: 800, hauteur: 600, alt: "IMG_2041.webp", loading: "lazy", pages: ["index.html"] },
    { fichier: "assets/img/brand-lab.webp", format: "webp", poidsKo: 118, largeur: 900, hauteur: 1200, alt: "Affiche Brand Lab sur fond jaune", loading: "lazy", pages: ["works.html", "work.html"] },
    { fichier: "assets/img/studio.webp", format: "webp", poidsKo: 97, largeur: 900, hauteur: 600, alt: "Le studio, vu depuis l'entrée", loading: "lazy", pages: ["about.html"] },
    { fichier: "assets/img/clara.webp", format: "webp", poidsKo: 41, largeur: 320, hauteur: 320, alt: echoue("A5") ? null : "Clara, directrice artistique", loading: "lazy", pages: ["team.html"] },
    { fichier: "assets/img/brand-day.webp", format: "webp", poidsKo: 132, largeur: 1200, hauteur: 800, alt: "Public de la Brand Day 2026", loading: "lazy", pages: ["events.html", "event.html"] },
    { fichier: "assets/svg/instagram.svg", format: "svg", poidsKo: 2, largeur: 24, hauteur: 24, alt: "Instagram", loading: "eager", pages: PAGES.map(([f]) => f) },
  ];
  if (echoue("E10") || echoue("E12")) {
    images.push({ fichier: "assets/img/equipe.jpg", format: "jpg", poidsKo: 312, largeur: 2400, hauteur: 1600, alt: "Photo de l'équipe", loading: null, pages: ["team.html"] });
  }
  if (echoue("E12")) {
    images.push({ fichier: "assets/img/carte.png", format: "png", poidsKo: 228, largeur: 1200, hauteur: 900, alt: "Plan d'accès au studio", loading: "lazy", pages: ["contact.html"] });
  }

  const autoHeberge = !echoue("G4");
  const polices = autoHeberge
    ? [
        { fichier: "assets/fonts/space-grotesk-700.woff2", famille: "Space Grotesk", graisse: "700", format: "woff2", poidsKo: 22, prechargee: !echoue("G6") },
        { fichier: "assets/fonts/inter-400.woff2", famille: "Inter", graisse: "400", format: "woff2", poidsKo: 24, prechargee: false },
        { fichier: "assets/fonts/inter-700.woff2", famille: "Inter", graisse: "700", format: "woff2", poidsKo: 25, prechargee: false },
      ]
    : [
        { fichier: "assets/fonts/SpaceGrotesk-Bold.ttf", famille: "Space Grotesk", graisse: "700", format: "ttf", poidsKo: 86, prechargee: false },
        { fichier: "assets/fonts/Inter-Regular.ttf", famille: "Inter", graisse: "400", format: "ttf", poidsKo: 310, prechargee: false },
      ];
  if (echoue("G5")) {
    for (const graisse of ["300", "500", "600"]) {
      polices.push({ fichier: `assets/fonts/inter-${graisse}.woff2`, famille: "Inter", graisse, format: "woff2", poidsKo: 24, prechargee: false });
    }
  }

  const fichiers = [
    "README.md",
    "NOTES.md",
    ...PAGES.map(([f]) => f),
    "css/style.css",
    ...(echoue("M4") || echoue("E1") ? ["js/menu.js"] : []),
    ...images.map((i) => i.fichier),
    ...polices.map((p) => p.fichier),
  ];
  const arborescence = fichiers.map((chemin) => ({ chemin, problemes: [] }));
  if (echoue("M8")) {
    arborescence.push(
      { chemin: "assets/img/Photo Équipe.JPG", problemes: ["majuscule", "espace", "accent"] },
      { chemin: "Contact.html", problemes: ["majuscule"] }
    );
  }

  const e11 = criteres.find((c) => c.id === "E11");
  return {
    images,
    poidsAccueilKo: e11.verdict === "non-mesurable" ? null : e11.valeur,
    polices,
    arborescence,
  };
};

// --- Blocs propres à chaque axe ---

const genererBlocs = (criteres, profil) => {
  const critere = (id) => criteres.find((c) => c.id === id);
  const echoue = (id) => ["non-respecte", "partiel"].includes(critere(id).verdict);
  const rem = (r) => ({ valeur: `${r}rem`, px: r * 16 });

  const palette = echoue("G1")
    ? [
        { variable: "--jaune", valeur: "#f5c518", role: "autre" },
        { variable: "--noir", valeur: "#111111", role: "autre" },
        { variable: "--gris", valeur: "#7b7b7b", role: "autre" },
        { variable: "--blanc", valeur: "#ffffff", role: "autre" },
      ]
    : [
        { variable: "--surface", valeur: "#fffdf7", role: "surface" },
        { variable: "--surface-alt", valeur: "#f4f1e8", role: "surface" },
        { variable: "--texte", valeur: "#1a1a1a", role: "texte" },
        { variable: "--texte-doux", valeur: "#5c5c5c", role: "texte" },
        { variable: "--accent", valeur: "#f5c518", role: "accent" },
        { variable: "--accent-fonce", valeur: "#8a6d00", role: "accent" },
        { variable: "--bordure", valeur: "#e2ddd0", role: "bordure" },
      ];

  const espacements = echoue("G3")
    ? [
        { variable: "--petit", ...rem(0.5) },
        { variable: "--moyen", ...rem(1) },
        { variable: "--grand", ...rem(2) },
      ]
    : [0.25, 0.5, 1, 1.5, 2, 3].map((r, i) => ({ variable: `--espace-${i + 1}`, ...rem(r) }));

  const tailles = echoue("G8") || echoue("G7")
    ? [12, 14, 15, 16, 18, 20, 22, 28, 36].map((px) => ({ variable: null, valeur: `${px}px`, px }))
    : [0.875, 1, 1.25, 1.5, 2, 2.75].map((r, i) => ({ variable: `--taille-${i + 1}`, ...rem(r) }));

  const a13 = critere("A13");
  const lighthouse =
    a13.verdict === "non-mesurable"
      ? { performance: null, accessibilite: null, bonnesPratiques: null, seo: null }
      : { performance: 82, accessibilite: Math.round(a13.valeur ?? 90), bonnesPratiques: 100, seo: 92 };

  const contrastes = echoue("A12")
    ? [
        { texte: "#9a9a9a", fond: "#ffffff", rapport: 2.8, requis: 4.5, page: "index.html", selecteur: ".legende" },
        { texte: "#ffffff", fond: "#f5c518", rapport: 1.6, requis: 3, page: "index.html", selecteur: ".bouton" },
        { texte: "#7b7b7b", fond: "#f4f1e8", rapport: 3.9, requis: 4.5, page: "team.html", selecteur: ".carte__date" },
      ]
    : [];

  const PAGES_BALISES = {
    article: ["works.html", "events.html"],
    nav: PAGES.map(([f]) => f),
    figure: ["work.html", "team.html"],
    figcaption: ["work.html", "team.html"],
    blockquote: ["about.html"],
    form: ["contact.html"],
    label: ["contact.html"],
    video: ["work.html"],
    time: ["events.html", "event.html"],
    dl: ["event.html"],
  };
  const absentes = echoue("A15") ? (profil.echecs.includes("A1") ? ["blockquote", "video"] : ["blockquote"]) : [];
  const contenusAttendus = Object.entries(PAGES_BALISES).map(([balise, pages]) => ({
    balise,
    pages: absentes.includes(balise) ? [] : pages,
  }));

  const javascript = echoue("M4")
    ? {
        fichiers: 1,
        lignes: 42,
        motifs: [
          {
            motif: "Menu ouvert par classList.toggle",
            occurrence: occ("js/menu.js", 4, 3, "bouton.addEventListener(\"click\", () => menu.classList.toggle(\"ouvert\"));", "classList.toggle(\"ouvert\")"),
            alternative: {
              titre: "Un popover, sans JavaScript",
              code: "<button popovertarget=\"menu\">Menu</button>\n<nav id=\"menu\" popover>…</nav>",
            },
          },
          {
            motif: "Affichage piloté par element.style",
            occurrence: occ("js/menu.js", 11, 5, "panneau.style.display = \"block\";", "style.display"),
            alternative: {
              titre: "Une classe ou un état CSS",
              code: ".panneau:popover-open { display: block; }",
            },
          },
        ],
      }
    : profil.bem > 80
      ? { fichiers: 1, lignes: 6, motifs: [] }
      : { fichiers: 0, lignes: 0, motifs: [] };

  const TOUTES_CLASSES = ["ancienne-carte", "test", "bloc-vide", "titre2", "hero--old", "nav__lien--actif-old"];
  const m5 = critere("M5").verdict;
  const classesInutilisees = {
    total: 48,
    classes: m5 === "non-respecte" ? TOUTES_CLASSES : m5 === "partiel" ? TOUTES_CLASSES.slice(0, 3) : TOUTES_CLASSES.slice(0, 1),
  };

  const HORS_CONVENTION = ["boutonRouge", "carteTitre", "grand-titre-jaune", "menuMobile", "bloc2", "photoEquipe", "lien-footer", "Hero"];
  const bem = {
    ratio: profil.bem,
    points: profil.bem >= 70 ? 5 : profil.bem >= 50 ? 3 : 0,
    totalClasses: 48,
    horsConvention: HORS_CONVENTION.slice(0, Math.max(1, Math.round(((100 - profil.bem) / 100) * HORS_CONVENTION.length))),
  };

  return {
    graphique: { palette, espacements, typographie: { famille: "Space Grotesk", tailles }, maquette: genererMaquette(critere("G11")) },
    accessibilite: {
      lighthouse,
      ...(critere("A12").verdict === "non-mesurable" ? {} : { contrastes }),
      contenusAttendus,
    },
    methodologie: { javascript, classesInutilisees, bem },
  };
};

// --- Maquette Figma (G11) : un écran par page, et l'écran du menu ouvert sans page ---

const ECRANS = {
  "index.html": "Home Mobile",
  "works.html": "Works Mobile",
  "work.html": "Works Single Mobile",
  "about.html": "About Mobile",
  "team.html": "Team Mobile",
  "events.html": "Event List Mobile",
  "event.html": "Event Single Mobile",
  "contact.html": "Contact Mobile",
};

const genererMaquette = (g11) => {
  if (g11.verdict === "non-mesurable") return undefined;
  const fidele = g11.verdict === "respecte";
  const nomCapture = (fichier, cote) => `captures/${createHash("sha1").update(fichier).digest("hex").slice(0, 12)}-${cote}.svg`;
  return {
    url: "https://www.figma.com/design/exemple",
    version: { id: "2412836743985412581", date: "2027-01-06T16:42:00Z" },
    ecrans: [
      ...PAGES.map(([fichier], i) => {
        const total = 18 + ((i * 7) % 23);
        const absents = Math.round(total * (fidele ? 0.1 : 0.25));
        const ecarts = Math.round((total - absents) * (fidele ? 0.08 : 0.35));
        const justifies = fidele && i % 3 === 0 ? 2 : 0;
        return {
          nom: ECRANS[fichier],
          fichier,
          largeur: 393,
          textes: { total, conformes: total - absents - ecarts, justifies, ecarts, absents },
          captures: { maquette: nomCapture(fichier, "maquette"), site: nomCapture(fichier, "site") },
        };
      }),
      { nom: "Hamburger Mobile", fichier: null, largeur: null, textes: null, captures: { maquette: null, site: null } },
    ],
    pagesSansEcran: [],
    couleursHorsMaquette: fidele ? [] : ["#d4145a", "#3a3a3a", "#f0f0f0"],
  };
};

// --- Site en ligne (lot 4) : accord avec les alertes de chaque profil ---

const genererEnLigne = (slug, sha) => {
  const url = `https://mmi-montbeliard.github.io/sae105-2026-${slug}/`;
  const base = { url, verifieLe: "2027-01-16T09:05:00+01:00", pages: { total: 8, enErreur: 0 }, ressources: { total: 41, enErreur: 0, nonVerifiees: 0 }, erreurs: [] };
  if (slug === "etu-02") {
    return { ...base, repond: false, raison: "L'accueil répond 404", pages: { total: 0, enErreur: 0 }, ressources: { total: 0, enErreur: 0, nonVerifiees: 0 }, deploiement: null };
  }
  const deploiement =
    slug === "etu-03"
      ? { sha: "4c1d2e9b7a0f3e5d6c8b9a1f2e3d4c5b6a7f8e9d", date: "2027-01-17T09:12:00Z", versionEvaluee: false }
      : { sha, date: "2027-01-15T18:40:00Z", versionEvaluee: true };
  if (slug !== "etu-04") return { ...base, repond: true, deploiement };
  return {
    ...base,
    repond: true,
    pages: { total: 8, enErreur: 1 },
    ressources: { total: 41, enErreur: 1, nonVerifiees: 0 },
    erreurs: [
      { type: "page", chemin: "Contact.html", url: `${url}Contact.html`, statut: 404, cause: "casse", citePar: [{ page: "index.html", ligne: 18 }, { page: "about.html", ligne: 18 }] },
      { type: "ressource", chemin: "/assets/fonts/titre.woff2", url: "https://mmi-montbeliard.github.io/assets/fonts/titre.woff2", statut: 404, cause: "chemin-racine", citePar: [{ page: "css/style.css", ligne: 4 }] },
    ],
    deploiement,
  };
};

// --- Historique Git : sessions de travail et commits ---

const DATE_RENDU = "2027-01-15T23:59:00+01:00";

// Une session : [jour, heure de début, nombre de commits, lignes moyennes par commit]
const SESSIONS = {
  "etu-01": [
    ["2026-12-26", "14:10", 3, 60], ["2026-12-29", "10:05", 4, 45], ["2027-01-02", "16:30", 3, 50],
    ["2027-01-05", "09:20", 5, 40], ["2027-01-07", "14:00", 4, 35], ["2027-01-09", "10:40", 3, 30],
    ["2027-01-12", "18:15", 4, 40], ["2027-01-14", "20:00", 7, 55], ["2027-01-15", "13:30", 8, 45],
  ],
  "etu-02": [
    ["2026-12-18", "09:00", 3, 70], ["2026-12-22", "14:30", 4, 40], ["2026-12-30", "10:15", 3, 35],
    ["2027-01-04", "15:00", 5, 45], ["2027-01-08", "09:30", 4, 30], ["2027-01-11", "17:00", 3, 25],
    ["2027-01-13", "10:00", 3, 20],
  ],
  "etu-03": [
    ["2026-12-21", "10:00", 3, 50], ["2026-12-23", "14:00", 4, 40], ["2026-12-28", "09:30", 4, 35],
    ["2026-12-31", "10:00", 3, 30], ["2027-01-03", "15:30", 5, 40], ["2027-01-06", "09:00", 4, 35],
    ["2027-01-08", "14:00", 4, 30], ["2027-01-10", "10:30", 3, 25], ["2027-01-12", "16:00", 3, 20],
    ["2027-01-14", "11:00", 2, 15],
  ],
  "etu-04": [
    ["2027-01-03", "21:00", 2, 120], ["2027-01-14", "19:30", 10, 70], ["2027-01-15", "08:45", 12, 60],
  ],
};

const MESSAGES = [
  "Structure HTML de la page d'accueil", "Ajout des pages réalisations et projet", "Variables de couleur dans :root",
  "Échelle d'espacement", "Menu en popover", "Formulaire de contact étiqueté", "Images converties en WebP",
  "Polices auto-hébergées en woff2", "Page équipe et cartes", "Page événements avec time datetime",
  "Correction des erreurs W3C", "États :hover et :focus-visible", "Textes alternatifs des images",
  "Plan des titres corrigé", "README complété", "NOTES.md : journal de la semaine",
];
const GENERIQUES = ["update", "fix", "wip", "."];

// Générateur pseudo-aléatoire déterministe (une graine par projet)
const aleatoire = (graine) => {
  let etat = [...graine].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
  return () => ((etat = (etat * 1664525 + 1013904223) >>> 0) / 2 ** 32);
};

// Une date à l'heure de Paris (hiver), au format ISO avec décalage
const isoParis = (ms) => new Date(ms + 3600e3).toISOString().replace(/\.\d{3}Z$/, "+01:00");

const genererHistorique = (slug, profil) => {
  const hasard = aleatoire(slug);
  const tauxGenerique = profil.recommandations.includes("M11") || profil.echecs.includes("M11") ? 0.18 : 0.04;
  const commits = [];
  let numero = 0;
  for (const [jour, heure, nombre, lignes] of SESSIONS[slug]) {
    let t = new Date(`${jour}T${heure}:00+01:00`).getTime();
    for (let i = 0; i < nombre; i++) {
      const total = numero === 0 ? 420 : Math.max(2, Math.round(lignes * (0.5 + hasard())));
      const suppressions = Math.round(total * 0.2 * hasard());
      const generique = hasard() < tauxGenerique;
      const date = isoParis(t);
      commits.push({
        sha: (numero * 2654435761 + slug.length * 97).toString(16).padStart(8, "0").slice(-7) + "a",
        auteur: profil.nom,
        dateAuteur: date,
        dateCommit: date,
        message: generique ? GENERIQUES[Math.floor(hasard() * GENERIQUES.length)] : MESSAGES[numero % MESSAGES.length],
        ajouts: total - suppressions,
        suppressions,
        fichiers: 1 + Math.floor(hasard() * 4),
        drapeaux: generique ? ["message-generique"] : [],
      });
      numero++;
      t += (12 + Math.floor(hasard() * 28)) * 60e3;
    }
  }

  // Deux commits d'un autre auteur (alerte de Lemoine Clara)
  if (profil.alertes.some((a) => a.type === "autre-auteur")) {
    for (const index of [9, 10]) {
      commits[index].auteur = "t.marchal";
      commits[index].drapeaux.push("autre-auteur");
    }
  }
  // Historique réécrit : une date d'auteur très antérieure à la date du commit
  if (profil.alertes.some((a) => a.type === "historique-reecrit")) {
    const c = commits[4];
    c.dateAuteur = isoParis(new Date(c.dateCommit).getTime() - 9 * 864e5);
    c.drapeaux.push("dates-divergentes");
  }

  // Sessions : une nouvelle session après plus de 2 h sans commit
  const sessions = [];
  for (const c of commits) {
    const t = new Date(c.dateCommit).getTime();
    const derniere = sessions.at(-1);
    if (derniere && t - new Date(derniere.fin).getTime() <= 2 * 3600e3) {
      derniere.fin = c.dateCommit;
      derniere.commits++;
    } else {
      sessions.push({ debut: c.dateCommit, fin: c.dateCommit, commits: 1 });
    }
  }

  const lignes = (c) => c.ajouts + c.suppressions;
  const totalLignes = commits.reduce((s, c) => s + lignes(c), 0);
  const limite48h = new Date(DATE_RENDU).getTime() - 48 * 3600e3;
  const lignes48h = commits
    .filter((c) => new Date(c.dateCommit).getTime() > limite48h)
    .reduce((s, c) => s + lignes(c), 0);
  const premier = new Date(commits[0].dateCommit).getTime();
  const dernier = new Date(commits.at(-1).dateCommit).getTime();

  const tags = [];
  if (slug !== "etu-04") tags.push({ nom: "html-v1", sha: commits[Math.floor(commits.length / 2)].sha, date: commits[Math.floor(commits.length / 2)].dateCommit });
  if (["etu-02", "etu-03"].includes(slug)) tags.push({ nom: "v1", sha: commits.at(-1).sha, date: commits.at(-1).dateCommit });

  return {
    dateRendu: DATE_RENDU,
    seuils: { sessionsMin: 6, joursMin: 4, partDernieres48hMax: 0.5 },
    indicateurs: {
      commits: commits.length,
      sessions: sessions.length,
      joursActifs: new Set(commits.map((c) => c.dateCommit.slice(0, 10))).size,
      dureeProjetJours: Math.round(((dernier - premier) / 864e5) * 10) / 10,
      dureeEstimeeMinutes: sessions.reduce(
        (s, x) => s + (new Date(x.fin).getTime() - new Date(x.debut).getTime()) / 60e3 + 30,
        0
      ),
      partDernieres48h: Math.round((lignes48h / totalLignes) * 100) / 100,
      plusGrosCommit: Math.max(...commits.map(lignes)),
      commitsAutreAuteur: commits.filter((c) => c.drapeaux.includes("autre-auteur")).length,
    },
    sessions,
    commits,
    tags,
  };
};

const genererResultat = (slug, profil, index) => {
  const criteres = catalogue.criteres.map((modele) => {
    const { id } = modele;
    let verdict = "respecte";
    if (modele.methode === "manuel") verdict = "a-juger";
    if (profil.echecs.includes(id) || profil.recommandations.includes(id)) verdict = "non-respecte";
    if (profil.partiels.includes(id)) verdict = "partiel";
    if (profil.nonMesurables[id]) verdict = "non-mesurable";
    if (modele.statut === "I" && verdict === "respecte") verdict = "respecte";

    let points = null;
    if (modele.statut === "C") {
      const max = pointsMax[id];
      const obtenus =
        verdict === "respecte" ? max : verdict === "partiel" ? Math.round(max / 2) : verdict === "non-respecte" ? 0 : null;
      points = { obtenus, max };
    }
    let valeur = valeurPour(modele, verdict);
    if (id === "M7") {
      valeur = profil.bem;
      verdict = profil.bem >= 50 ? "respecte" : "non-respecte";
      points = { obtenus: profil.bem >= 70 ? 5 : profil.bem >= 50 ? 3 : 0, max: 5 };
    }
    if (id === "E15") valeur = verdict === "non-mesurable" ? null : 82;

    const occurrences =
      verdict === "non-respecte" || verdict === "partiel"
        ? OCCURRENCES[id] ?? []
        : verdict === "a-juger"
          ? ELEMENTS_A_JUGER[id] ?? []
          : [];
    const { _commentaire, ...reste } = modele;
    return {
      ...reste,
      verdict,
      valeur,
      seuil: modele.seuil,
      points,
      ...(verdict === "non-mesurable" ? { raison: profil.nonMesurables[id] } : {}),
      occurrences,
      totalOccurrences: occurrences.length,
    };
  });

  const parAxe = Object.fromEntries(
    catalogue.axes.map((axe) => {
      const contraintes = criteres.filter((c) => c.axe === axe.id && c.statut === "C");
      return [
        axe.id,
        {
          obtenus: contraintes.reduce((s, c) => s + (c.points.obtenus ?? 0), 0),
          max: contraintes
            .filter((c) => c.verdict !== "non-mesurable")
            .reduce((s, c) => s + c.points.max, 0),
        },
      ];
    })
  );
  const base = Object.values(parAxe).reduce((s, a) => s + a.obtenus, 0);
  const max = Object.values(parAxe).reduce((s, a) => s + a.max, 0);
  const aJuger = criteres
    .filter((c) => c.verdict === "a-juger" && c.points)
    .reduce((s, c) => s + c.points.max, 0);
  const bonus = criteres.find((c) => c.id === "M7").points.obtenus;
  const totale = Math.min(100, base + bonus);

  return {
    version: 2,
    source: {
      depot: `mmi-montbeliard/sae105-2026-${slug}`,
      ref: index % 2 ? "v1" : "main",
      sha: (slug + "a4f9c2e1b07d3").slice(-7).padEnd(7, "0") + "e8d1c2b",
      raison: index % 2 ? "tag v1" : "dernier commit avant la date de rendu",
      analyseLe: `2027-01-1${6 + index}T09:${String(10 + index * 7).padStart(2, "0")}:00+01:00`,
    },
    projet: { slug, nom: profil.nom, groupe: profil.groupe },
    liens: {
      site: `https://mmi-montbeliard.github.io/sae105-2026-${slug}/`,
      depot: `https://github.com/mmi-montbeliard/sae105-2026-${slug}`,
      figma: index === 1 ? null : `https://www.figma.com/design/exemple-${slug}`,
    },
    note: {
      base,
      max,
      bonus,
      totale,
      lettre: lettre((base / Math.max(max - aJuger, 1)) * 100),
      aJuger,
      parAxe,
    },
    criteres,
    pages: genererPages(criteres, profil),
    ressources: genererRessources(criteres, profil),
    blocs: genererBlocs(criteres, profil),
    historique: genererHistorique(slug, profil),
    enLigne: genererEnLigne(slug, (slug + "a4f9c2e1b07d3").slice(-7).padEnd(7, "0") + "e8d1c2b"),
    alertes: profil.alertes,
    nonMesurable: [...new Set(Object.values(profil.nonMesurables))].map((raison) => ({
      etape: "Lighthouse et mesures en navigateur",
      raison,
    })),
  };
};

fs.writeFileSync(
  path.join(dossier, "promo.json"),
  JSON.stringify(
    { promo: "SAÉ 105 · 2026-2027 (données fictives)", dateRendu: "2027-01-15T23:59:00+01:00", projets: PROMO },
    null,
    2
  ) + "\n"
);

// --- Vignettes fictives : un aplat coloré et le format, en SVG ---

const TEINTES = { svg: "#1a1a1a", avif: "#f5c518", webp: "#8a6d00", jpg: "#b45309", png: "#5c5c5c" };

const ecrireVignettes = (slug, resultat) => {
  const dossierVignettes = path.join(dossier, "vignettes", slug);
  fs.rmSync(dossierVignettes, { recursive: true, force: true });
  fs.mkdirSync(dossierVignettes, { recursive: true });
  resultat.ressources.images.forEach((image, i) => {
    // Une image sur dix reste sans vignette : le fichier manquait lors de l'analyse
    if (image.fichier.includes("instagram")) {
      image.vignette = null;
      return;
    }
    // Même règle de nommage que le backend (services/source/vignettes.js)
    const nom = `${createHash("sha1").update(image.fichier).digest("hex").slice(0, 12)}.svg`;
    const fond = TEINTES[image.format] ?? "#475569";
    const texte = ["#f5c518", "#fffdf7"].includes(fond) ? "#1a1a1a" : "#ffffff";
    fs.writeFileSync(
      path.join(dossierVignettes, nom),
      `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">` +
        `<rect width="96" height="96" fill="${fond}"/>` +
        `<circle cx="${30 + (i * 13) % 40}" cy="38" r="14" fill="${texte}" opacity="0.35"/>` +
        `<path d="M0 96 L34 58 L56 78 L72 64 L96 90 V96 Z" fill="${texte}" opacity="0.25"/>` +
        `<text x="8" y="88" font-family="monospace" font-size="12" fill="${texte}">${image.format}</text>` +
        `</svg>\n`
    );
    image.vignette = `vignettes/${nom}`;
  });
};

// --- Captures fictives de G11 : un écran schématique, le site légèrement décalé s'il s'écarte ---

const ecrireCaptures = (slug, resultat) => {
  const dossierCaptures = path.join(dossier, "captures", slug);
  fs.rmSync(dossierCaptures, { recursive: true, force: true });
  const maquette = resultat.blocs.graphique.maquette;
  if (!maquette) return;
  fs.mkdirSync(dossierCaptures, { recursive: true });
  const fidele = maquette.couleursHorsMaquette.length === 0;
  for (const ecran of maquette.ecrans.filter((e) => e.fichier)) {
    for (const cote of ["maquette", "site"]) {
      const ecart = cote === "site" && !fidele;
      const accent = ecart ? "#d4145a" : "#1a1a1a";
      fs.writeFileSync(
        path.join(dossier, path.dirname(ecran.captures[cote]), slug, path.basename(ecran.captures[cote])),
        `<svg xmlns="http://www.w3.org/2000/svg" width="393" height="900" viewBox="0 0 393 900">` +
          `<rect width="393" height="900" fill="#fffdf7"/>` +
          `<rect width="393" height="64" fill="${accent}"/>` +
          `<rect x="24" y="${ecart ? 104 : 96}" width="${ecart ? 300 : 260}" height="${ecart ? 28 : 36}" rx="4" fill="#1a1a1a"/>` +
          `<rect x="24" y="160" width="345" height="220" rx="8" fill="#f5c518"/>` +
          [0, 1, 2, 3, 4].map((l) => `<rect x="24" y="${410 + l * 24}" width="${345 - (l % 2) * 80}" height="10" rx="5" fill="#5c5c5c"/>`).join("") +
          `<rect x="24" y="560" width="160" height="48" rx="24" fill="${accent}"/>` +
          `<text x="24" y="860" font-family="monospace" font-size="14" fill="#5c5c5c">${ecran.nom} · ${cote}</text>` +
          `</svg>\n`
      );
    }
  }
};

Object.entries(PROFILS).forEach(([slug, profil], index) => {
  const resultat = genererResultat(slug, profil, index);
  ecrireVignettes(slug, resultat);
  ecrireCaptures(slug, resultat);
  // Le critère M10 porte le nombre de sessions de la timeline
  resultat.criteres.find((c) => c.id === "M10").valeur = resultat.historique.indicateurs.sessions;
  fs.writeFileSync(path.join(dossier, `${slug}.json`), JSON.stringify(resultat, null, 2) + "\n");
});

console.log(`${Object.keys(PROFILS).length} résultats et 1 promo écrits dans ${dossier}`);

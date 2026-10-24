/**
 * Génère les données fictives de donnees-fictives/ à partir du catalogue des critères.
 * Noms inventés, écrits « Nom Prénom » (règle du cahier des charges). Le résultat est déterministe.
 *
 * Usage : node scripts/genererDonneesFictives.js
 */
import fs from "node:fs";
import path from "node:path";

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
    echecs: ["G2", "G3", "E2", "E7", "E10", "A3", "A5", "A10", "A12", "M1", "M3", "M4", "M5"],
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
    alertes: [],
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
      { type: "pages-404", message: "Pages en erreur 404", details: "/Contact.html (casse), /assets/fonts/titre.woff2" },
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
        controles[cle] = { verdict: "non-respecte", detail: detailEchec };
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

Object.entries(PROFILS).forEach(([slug, profil], index) => {
  fs.writeFileSync(
    path.join(dossier, `${slug}.json`),
    JSON.stringify(genererResultat(slug, profil, index), null, 2) + "\n"
  );
});

console.log(`${Object.keys(PROFILS).length} résultats et 1 promo écrits dans ${dossier}`);

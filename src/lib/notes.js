/**
 * Mode local : les notes de l'enseignant appliquées au résultat de l'analyse, au build.
 *
 * - Une contrainte « à juger » reçoit des points ; son verdict en découle. Si l'outil en propose
 *   (pointsProposes : Q2 d'après Q3 à Q11), en donner d'autres demande une justification.
 * - Un autre critère peut recevoir un verdict qui remplace celui de l'outil, avec une justification.
 * - Un critère avec une échelle (proposé par l'IA) reçoit un niveau de cette échelle ; s'il diffère
 *   de la proposition de l'IA, avec une justification. Son verdict en découle, sans points.
 * La note est recalculée comme le fait l'analyse (services/analyse/notation.js du backend).
 */

/** Verdict d'un niveau : le plus haut est respecté, le plus bas non respecté, les autres partiels */
const verdictDuNiveau = (echelle, niveau) => {
  const rang = echelle.indexOf(niveau);
  return rang === echelle.length - 1 ? "respecte" : rang === 0 ? "non-respecte" : "partiel";
};

/** Points d'une contrainte d'après son verdict, comme dans l'analyse */
const POINTS_VERDICT = { respecte: (max) => max, partiel: (max) => Math.round(max / 2), "non-respecte": () => 0 };

const aJugerEnPoints = (c) => c.verdict === "a-juger" && c.statut === "C" && c.points;

/**
 * Ce qui ne va pas dans des notes, face au résultat : une phrase par problème
 * @returns {string[]}
 */
export const verifierNotes = (notes, resultat) =>
  Object.entries(notes.criteres).flatMap(([id, n]) => {
    const c = resultat.criteres.find((x) => x.id === id);
    if (!c) return [`${id} : critère inconnu`];
    if (c.echelle) {
      if (n.points != null || n.verdict) return [`${id} : ce critère se juge par un niveau de l'échelle (${c.echelle.join(" < ")})`];
      if (n.niveau == null) return [];
      if (!c.echelle.includes(n.niveau)) return [`${id} : « ${n.niveau} » n'est pas un niveau de l'échelle (${c.echelle.join(" < ")})`];
      if (c.proposition && n.niveau !== c.proposition.niveau && !n.commentaire?.trim()) return [`${id} : un niveau différent de la proposition de l'IA demande une justification`];
      return [];
    }
    if (n.niveau != null) return [`${id} : ce critère n'a pas d'échelle de niveaux`];
    if (aJugerEnPoints(c)) {
      if (n.verdict) return [`${id} : une contrainte à juger se note en points`];
      if (n.points != null && (n.points < 0 || n.points > c.points.max)) return [`${id} : de 0 à ${c.points.max} points`];
      if (n.points != null && c.pointsProposes && n.points !== c.pointsProposes.valeur && !n.commentaire?.trim()) {
        return [`${id} : des points différents de la proposition (${String(c.pointsProposes.valeur).replace(".", ",")}) demandent une justification`];
      }
      return [];
    }
    if (n.points != null) return [`${id} : ce critère se juge par un verdict, pas en points`];
    if (n.verdict && c.verdict !== "a-juger" && !n.commentaire?.trim()) return [`${id} : un verdict corrigé demande une justification`];
    return [];
  });

/** La note recalculée, avec les mêmes règles que l'analyse */
const renoter = (criteres, ancienne) => {
  const parAxe = Object.fromEntries(
    Object.keys(ancienne.parAxe).map((axe) => {
      const contraintes = criteres.filter((c) => c.axe === axe && c.statut === "C");
      return [
        axe,
        {
          obtenus: contraintes.reduce((s, c) => s + (c.points?.obtenus ?? 0), 0),
          max: contraintes.filter((c) => c.verdict !== "non-mesurable").reduce((s, c) => s + c.points.max, 0),
        },
      ];
    })
  );
  const base = Object.values(parAxe).reduce((s, a) => s + a.obtenus, 0);
  const max = Object.values(parAxe).reduce((s, a) => s + a.max, 0);
  const aJuger = criteres.filter((c) => c.verdict === "a-juger" && c.points).reduce((s, c) => s + c.points.max, 0);
  const pourcentage = (base / Math.max(max - aJuger, 1)) * 100;
  // Rien n'est encore jugé : pas de lettre
  const lettre = max - aJuger <= 0 ? "—" : ancienne.lettres
    ? Object.entries(ancienne.lettres).sort((a, b) => b[1] - a[1]).find(([, seuil]) => pourcentage >= seuil)?.[0] ?? ancienne.lettre
    : ancienne.lettre;
  return { ...ancienne, base, max, totale: Math.min(ancienne.total ?? 100, base + ancienne.bonus), lettre, aJuger, parAxe };
};

/**
 * @param {object} resultat - Résultat v2 validé
 * @param {{ commentaire: string|null, criteres: object }} notes
 * @returns {object} - Le résultat avec les verdicts, points et commentaires de l'enseignant
 */
export const appliquerNotes = (resultat, notes) => {
  if (Object.keys(notes.criteres).length === 0) return { ...resultat, commentaire: notes.commentaire };
  const criteres = resultat.criteres.map((c) => {
    const n = notes.criteres[c.id];
    if (!n) return c;
    const enseignant = { verdictOutil: c.verdict, points: null, commentaire: n.commentaire ?? null, le: n.le };
    if (c.echelle) {
      if (n.niveau == null) return { ...c, enseignant };
      return { ...c, verdict: verdictDuNiveau(c.echelle, n.niveau), detailValeur: `niveau retenu : ${n.niveau}`, enseignant: { ...enseignant, niveau: n.niveau } };
    }
    if (aJugerEnPoints(c)) {
      if (n.points == null) return { ...c, enseignant };
      const verdict = n.points === c.points.max ? "respecte" : n.points === 0 ? "non-respecte" : "partiel";
      return { ...c, verdict, points: { obtenus: n.points, max: c.points.max }, enseignant: { ...enseignant, points: n.points } };
    }
    if (!n.verdict) return { ...c, enseignant };
    const points = c.statut === "C" && c.points ? { obtenus: POINTS_VERDICT[n.verdict](c.points.max), max: c.points.max } : c.points;
    return { ...c, verdict: n.verdict, points, enseignant };
  });
  return { ...resultat, criteres, note: renoter(criteres, resultat.note), commentaire: notes.commentaire };
};

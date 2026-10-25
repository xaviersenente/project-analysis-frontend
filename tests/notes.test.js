/**
 * Mode local : les notes de l'enseignant (data/notes/<slug>.json) appliquées au résultat de l'analyse.
 * Lancement : npm test
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { appliquerNotes, verifierNotes } from "../src/lib/notes.js";

const resultat = JSON.parse(fs.readFileSync(new URL("../donnees-fictives/etu-01.json", import.meta.url), "utf-8"));
const critere = (r, id) => r.criteres.find((c) => c.id === id);
const LE = "2027-01-20T10:00:00+01:00";

test("sans notes, le résultat est inchangé", () => {
  assert.deepEqual(appliquerNotes(resultat, { commentaire: null, criteres: {} }), { ...resultat, commentaire: null });
});

test("un critère à juger reçoit ses points : verdict, points et note recalculés", () => {
  const r = appliquerNotes(resultat, { commentaire: null, criteres: { G10: { points: 2, commentaire: "Hiérarchie claire, rythme inégal.", le: LE } } });
  const g10 = critere(r, "G10");
  assert.equal(g10.verdict, "partiel");
  assert.deepEqual(g10.points, { obtenus: 2, max: 3 });
  assert.deepEqual(g10.enseignant, { verdictOutil: "a-juger", points: 2, commentaire: "Hiérarchie claire, rythme inégal.", le: LE });
  assert.equal(r.note.aJuger, resultat.note.aJuger - 3);
  assert.equal(r.note.base, resultat.note.base + 2);
  assert.equal(r.note.parAxe.graphique.obtenus, resultat.note.parAxe.graphique.obtenus + 2);
  assert.equal(r.note.totale, resultat.note.totale + 2);
});

test("toutes les valeurs extrêmes : 0 point → non respecté, le maximum → respecté", () => {
  const zero = appliquerNotes(resultat, { commentaire: null, criteres: { G10: { points: 0, commentaire: null, le: LE } } });
  assert.equal(critere(zero, "G10").verdict, "non-respecte");
  const plein = appliquerNotes(resultat, { commentaire: null, criteres: { G10: { points: 3, commentaire: null, le: LE } } });
  assert.equal(critere(plein, "G10").verdict, "respecte");
});

test("un verdict automatique corrigé, avec sa justification : les points suivent", () => {
  const r = appliquerNotes(resultat, { commentaire: null, criteres: { G11: { verdict: "respecte", commentaire: "Écarts voulus, validés à la soutenance.", le: LE } } });
  const g11 = critere(r, "G11");
  assert.equal(g11.verdict, "respecte");
  assert.deepEqual(g11.points, { obtenus: 2, max: 2 });
  assert.equal(g11.enseignant.verdictOutil, "non-respecte");
  assert.equal(g11.enseignant.points, null);
  assert.equal(r.note.base, resultat.note.base + 2);
});

test("la lettre est recalculée avec le barème du résultat", () => {
  const avecBareme = { ...resultat, note: { ...resultat.note, lettres: { "A+": 95, A: 90, B: 80, C: 70, D: 60, E: 50, F: 0 } } };
  const r = appliquerNotes(avecBareme, { commentaire: null, criteres: { G10: { points: 3, commentaire: null, le: LE } } });
  const pourcentage = (r.note.base / Math.max(r.note.max - r.note.aJuger, 1)) * 100;
  const attendue = Object.entries(avecBareme.note.lettres).sort((a, b) => b[1] - a[1]).find(([, s]) => pourcentage >= s)[0];
  assert.equal(r.note.lettre, attendue);
});

test("une recommandation à juger reçoit un verdict, sans points", () => {
  const r = appliquerNotes(resultat, { commentaire: null, criteres: { A6: { verdict: "respecte", commentaire: null, le: LE } } });
  assert.equal(critere(r, "A6").verdict, "respecte");
  assert.equal(critere(r, "A6").points, null);
  assert.equal(r.note.base, resultat.note.base);
});

test("le commentaire général est publié avec le résultat", () => {
  const r = appliquerNotes(resultat, { commentaire: "Beau travail sur la maquette.", criteres: {} });
  assert.equal(r.commentaire, "Beau travail sur la maquette.");
});

test("vérification : points hors barème, verdict corrigé sans justification, critère inconnu", () => {
  assert.deepEqual(verifierNotes({ commentaire: null, criteres: { G10: { points: 2, commentaire: null, le: LE } } }, resultat), []);
  assert.deepEqual(verifierNotes({ commentaire: null, criteres: { G10: { points: 4, commentaire: null, le: LE } } }, resultat), ["G10 : de 0 à 3 points"]);
  assert.deepEqual(verifierNotes({ commentaire: null, criteres: { G11: { verdict: "respecte", commentaire: "", le: LE } } }, resultat), ["G11 : un verdict corrigé demande une justification"]);
  assert.deepEqual(verifierNotes({ commentaire: null, criteres: { Z9: { verdict: "respecte", commentaire: "x", le: LE } } }, resultat), ["Z9 : critère inconnu"]);
  assert.deepEqual(verifierNotes({ commentaire: null, criteres: { G10: { verdict: "respecte", commentaire: "x", le: LE } } }, resultat), ["G10 : une contrainte à juger se note en points"]);
});

test("au chargement, les notes du dossier notes/ s'appliquent ; des notes invalides arrêtent le build", async () => {
  const os = await import("node:os");
  const path = await import("node:path");
  const { chargerResultats, cheminNotes } = await import("../src/lib/donnees.js");
  const dossier = fs.mkdtempSync(path.join(os.tmpdir(), "notes-"));
  try {
    fs.writeFileSync(path.join(dossier, "etu-01.json"), JSON.stringify(resultat));
    const promo = { projets: [{ slug: "etu-01", nom: resultat.projet.nom, groupe: resultat.projet.groupe }] };
    fs.mkdirSync(path.join(dossier, "notes"));
    fs.writeFileSync(cheminNotes(dossier, "etu-01"), JSON.stringify({ commentaire: "Bien.", criteres: { G10: { points: 3, commentaire: null, le: LE } } }));
    const charge = chargerResultats(dossier, promo).get("etu-01");
    assert.equal(critere(charge, "G10").verdict, "respecte");
    assert.equal(charge.commentaire, "Bien.");

    fs.writeFileSync(cheminNotes(dossier, "etu-01"), JSON.stringify({ commentaire: null, criteres: { G10: { points: 9, commentaire: null, le: LE } } }));
    assert.throws(() => chargerResultats(dossier, promo), /G10 : de 0 à 3 points/);
  } finally {
    fs.rmSync(dossier, { recursive: true, force: true });
  }
});

test("enregistrement : une modification par critère, effacement, commentaire général", async () => {
  const { modifierNotes } = await import("../integrations/notes.mjs");
  let notes = { commentaire: null, criteres: {} };
  notes = modifierNotes(notes, { critere: "G10", note: { points: 2, commentaire: "  Bien.  " } }, LE);
  assert.deepEqual(notes.criteres.G10, { points: 2, commentaire: "Bien.", le: LE });
  notes = modifierNotes(notes, { critere: "G11", note: { verdict: "respecte", commentaire: "Voulu." } }, LE);
  notes = modifierNotes(notes, { critere: "G10", note: null }, LE);
  assert.deepEqual(Object.keys(notes.criteres), ["G11"]);
  notes = modifierNotes(notes, { commentaire: "  " }, LE);
  assert.equal(notes.commentaire, null);
});

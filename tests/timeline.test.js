/**
 * Tests de la frise des commits : échelle de temps, rayons, graduations, durées
 * Lancement : npm test
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { echelleTemps, rayonCommit, graduationsJours, indexJour, minutesDuJour } from "../src/lib/timeline.js";
import { duree } from "../src/lib/format.js";

test("échelle de temps : début à gauche, fin à droite, linéaire entre les deux", () => {
  const x = echelleTemps("2027-01-01T00:00:00+01:00", "2027-01-11T00:00:00+01:00", 0, 1000);
  assert.equal(x("2027-01-01T00:00:00+01:00"), 0);
  assert.equal(x("2027-01-11T00:00:00+01:00"), 1000);
  assert.equal(x("2027-01-06T00:00:00+01:00"), 500);
});

test("rayon d'un commit : proportionnel à la racine des lignes, borné", () => {
  assert.equal(rayonCommit(0, 400), 3);
  assert.equal(rayonCommit(400, 400), 12);
  assert.ok(rayonCommit(100, 400) > 3 && rayonCommit(100, 400) < 12);
  // Le rayon suit la surface, pas le diamètre : 4 fois plus de lignes, 2 fois le rayon utile
  const utile = (n) => rayonCommit(n, 400) - 3;
  assert.equal(Math.round(utile(400) / utile(100)), 2);
});

test("graduations : un repère par jour, à minuit heure de Paris", () => {
  const jours = graduationsJours("2027-01-13T15:20:00+01:00", "2027-01-15T23:59:00+01:00");
  assert.deepEqual(
    jours.map((j) => j.libelle),
    ["13 janv.", "14 janv.", "15 janv."]
  );
  assert.equal(new Date(jours[1].date).toISOString(), "2027-01-13T23:00:00.000Z");
});

test("colonne du jour et heure dans la journée, à l'heure de Paris", () => {
  const jours = graduationsJours("2027-01-13T15:20:00+01:00", "2027-01-15T23:59:00+01:00");
  assert.equal(indexJour("2027-01-13T15:20:00+01:00", jours), 0);
  // 23 h 30 le 14 à Paris : encore le 14, même si c'est déjà le 14 à 22 h 30 UTC
  assert.equal(indexJour("2027-01-14T23:30:00+01:00", jours), 1);
  assert.equal(minutesDuJour("2027-01-14T23:30:00+01:00"), 23 * 60 + 30);
  assert.equal(minutesDuJour("2027-01-15T08:45:00+01:00"), 8 * 60 + 45);
});

test("heure d'été : minuit et heure du jour restent justes (+02:00)", () => {
  const jours = graduationsJours("2026-10-20T18:22:47Z", "2026-10-21T06:51:18Z");
  assert.deepEqual(jours.map((j) => j.libelle), ["20 oct.", "21 oct."]);
  // Minuit à Paris le 21 octobre (été) : 22 h UTC la veille
  assert.equal(new Date(jours[1].date).toISOString(), "2026-10-20T22:00:00.000Z");
  // 18 h 22 UTC le 20 octobre = 20 h 22 à Paris
  assert.equal(minutesDuJour("2026-10-20T18:22:47Z"), 20 * 60 + 22 + 47 / 60);
  assert.equal(indexJour("2026-10-20T22:30:00Z", jours), 1);
});

test("le passage à l'heure d'hiver (25 octobre 2026) ne décale pas les jours suivants", () => {
  const jours = graduationsJours("2026-10-24T20:00:00Z", "2026-10-27T10:00:00Z");
  assert.deepEqual(jours.map((j) => j.libelle), ["24 oct.", "25 oct.", "26 oct.", "27 oct."]);
  assert.equal(new Date(jours[2].date).toISOString(), "2026-10-25T23:00:00.000Z");
});

test("durées en heures et minutes", () => {
  assert.equal(duree(45), "45 min");
  assert.equal(duree(90), "1 h 30");
  assert.equal(duree(14 * 60), "14 h");
});

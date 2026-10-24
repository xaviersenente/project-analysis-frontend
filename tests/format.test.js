/**
 * Tests des formats français
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { nombre, date, valeurCritere, seuilCritere, points } from "../src/lib/format.js";

// Intl sépare les milliers par une espace fine insécable
const espaces = (texte) => texte.replace(/[  ]/g, " ");

test("nombres : virgule décimale et espace pour les milliers", () => {
  assert.equal(espaces(nombre(1234.5)), "1 234,5");
  assert.equal(nombre(null), "—");
});

test("date d'analyse en toutes lettres, heure de Paris", () => {
  assert.equal(espaces(date("2027-01-16T09:10:00+01:00")), "16 janvier 2027 à 09:10");
});

test("valeur et seuil d'un critère", () => {
  const critere = { valeur: 7, seuil: { operateur: "≤", nombre: 5, unite: "%" } };
  assert.equal(valeurCritere(critere), "7 %");
  assert.equal(seuilCritere(critere), "≤ 5 %");
  assert.equal(seuilCritere({ seuil: null, detailSeuil: "sur chaque page" }), "sur chaque page");
  assert.equal(valeurCritere({ valeur: 3, seuil: { operateur: "=", nombre: 0, unite: "erreur" } }), "3 erreurs");
  assert.equal(valeurCritere({ valeur: null, seuil: null }), "—");
  // Les unités abrégées restent invariables
  assert.equal(valeurCritere({ valeur: 126, seuil: { operateur: "≤", nombre: 180, unite: "px" } }), "126 px");
});

test("points au singulier et au pluriel", () => {
  assert.equal(points(1), "1 pt");
  assert.equal(points(3), "3 pts");
});

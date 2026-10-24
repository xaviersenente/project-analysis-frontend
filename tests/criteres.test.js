/**
 * Tests de la liste des critères : extraits surlignés et filtres
 * Lancement : npm test
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { decouperExtrait, correspondAuFiltre, OCCURRENCES_VISIBLES } from "../src/lib/criteres.js";

test("extrait : la partie fautive est isolée", () => {
  assert.deepEqual(decouperExtrait(".carte { color: #7b7b7b; }", [16, 23]), {
    avant: ".carte { color: ",
    fautif: "#7b7b7b",
    apres: "; }",
  });
});

test("extrait : sans surlignage, ou avec des bornes hors de l'extrait, tout reste normal", () => {
  assert.deepEqual(decouperExtrait("<p>", null), { avant: "<p>", fautif: "", apres: "" });
  assert.deepEqual(decouperExtrait("<p>", [2, 40]), { avant: "<p>", fautif: "", apres: "" });
  assert.deepEqual(decouperExtrait("<p>", [3, 1]), { avant: "<p>", fautif: "", apres: "" });
});

test("au-delà de 5 occurrences, les suivantes sont repliées", () => {
  assert.equal(OCCURRENCES_VISIBLES, 5);
});

const ligne = (verdict, statut, texte = "G2 Les couleurs passent par les variables") => ({
  verdict,
  statut,
  texte,
});

test("filtre Tous : tout s'affiche", () => {
  const filtres = { vue: "tous", masquerRecommandations: false, recherche: "" };
  assert.ok(correspondAuFiltre(ligne("respecte", "C"), filtres));
  assert.ok(correspondAuFiltre(ligne("non-respecte", "R"), filtres));
});

test("filtre Non respectés : les échecs et les partiels, pas les non mesurables", () => {
  const filtres = { vue: "non-respectes", masquerRecommandations: false, recherche: "" };
  assert.ok(correspondAuFiltre(ligne("non-respecte", "C"), filtres));
  assert.ok(correspondAuFiltre(ligne("partiel", "C"), filtres));
  assert.ok(!correspondAuFiltre(ligne("respecte", "C"), filtres));
  assert.ok(!correspondAuFiltre(ligne("non-mesurable", "C"), filtres));
  // Un bonus non obtenu n'est pas un échec
  assert.ok(!correspondAuFiltre(ligne("non-respecte", "B"), filtres));
});

test("filtre À juger", () => {
  const filtres = { vue: "a-juger", masquerRecommandations: false, recherche: "" };
  assert.ok(correspondAuFiltre(ligne("a-juger", "C"), filtres));
  assert.ok(!correspondAuFiltre(ligne("non-respecte", "C"), filtres));
});

test("masquer les recommandations", () => {
  const filtres = { vue: "tous", masquerRecommandations: true, recherche: "" };
  assert.ok(!correspondAuFiltre(ligne("non-respecte", "R"), filtres));
  assert.ok(correspondAuFiltre(ligne("non-respecte", "C"), filtres));
  assert.ok(correspondAuFiltre(ligne("respecte", "I"), filtres));
});

test("recherche : identifiant ou libellé, sans accents ni casse", () => {
  const filtres = (recherche) => ({ vue: "tous", masquerRecommandations: false, recherche });
  assert.ok(correspondAuFiltre(ligne("respecte", "C"), filtres("g2")));
  assert.ok(correspondAuFiltre(ligne("respecte", "C"), filtres("COULEURS")));
  assert.ok(correspondAuFiltre(ligne("respecte", "C", "A13 Lighthouse Accessibilité"), filtres("accessibilite")));
  assert.ok(!correspondAuFiltre(ligne("respecte", "C"), filtres("contraste")));
});

/**
 * Tests des blocs d'axe : palette, contraste, couleurs claires
 * Lancement : npm test
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { grouperPalette, estClaire, largeurRelative } from "../src/lib/blocs.js";
import { rapport } from "../src/lib/format.js";

test("palette regroupée par rôle, dans l'ordre surface, texte, accent, bordure, autre", () => {
  const groupes = grouperPalette([
    { variable: "--jaune", valeur: "#f5c518", role: "autre" },
    { variable: "--texte", valeur: "#111", role: "texte" },
    { variable: "--surface", valeur: "#fff", role: "surface" },
    { variable: "--surface-alt", valeur: "#f4f4f4", role: "surface" },
  ]);
  assert.deepEqual(
    groupes.map((g) => [g.role, g.couleurs.length]),
    [
      ["surface", 2],
      ["texte", 1],
      ["autre", 1],
    ]
  );
});

test("couleur claire : une pastille blanche a besoin d'une bordure", () => {
  assert.equal(estClaire("#ffffff"), true);
  assert.equal(estClaire("#fff"), true);
  assert.equal(estClaire("#f4f4f4"), true);
  assert.equal(estClaire("#111111"), false);
  assert.equal(estClaire("#1d4ed8"), false);
  // Une valeur non hexadécimale (var(), oklch…) est traitée comme claire, par prudence
  assert.equal(estClaire("oklch(70% 0.1 200)"), true);
});

test("rapport de contraste au format français", () => {
  assert.equal(rapport(3.14), "3,1:1");
  assert.equal(rapport(4.5), "4,5:1");
});

test("largeur relative d'une barre d'échelle", () => {
  assert.equal(largeurRelative(16, 64), "25%");
  assert.equal(largeurRelative(0, 64), "0%");
  assert.equal(largeurRelative(10, 0), "0%");
});

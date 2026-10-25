/**
 * Tests des blocs d'axe : palette, contraste, couleurs claires
 * Lancement : npm test
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { grouperPalette, estClaire, largeurRelative, resoudreCouleur, famillesPolices, cssPolices } from "../src/lib/blocs.js";
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

test("variables de variables : la couleur est retrouvée en suivant la chaîne", () => {
  const palette = [
    { variable: "--white", valeur: "#fff", role: "autre" },
    { variable: "--surface", valeur: "var(--white)", role: "surface" },
    { variable: "--fond-carte", valeur: "var(--surface)", role: "surface" },
    { variable: "--ombre", valeur: "rgb(0 0 0 / 0.2)", role: "autre" },
  ];
  assert.equal(resoudreCouleur("var(--white)", palette), "#fff");
  assert.equal(resoudreCouleur("var(--fond-carte)", palette), "#fff");
  assert.equal(resoudreCouleur("#1d4ed8", palette), "#1d4ed8");
  // Variable inconnue : la valeur de repli, sinon rien
  assert.equal(resoudreCouleur("var(--absente, #333)", palette), "#333");
  assert.equal(resoudreCouleur("var(--absente)", palette), null);
  // Boucle : jamais de récursion sans fin
  assert.equal(resoudreCouleur("var(--a)", [{ variable: "--a", valeur: "var(--b)" }, { variable: "--b", valeur: "var(--a)" }]), null);
  // Chaque entrée groupée porte sa couleur résolue
  const [surface] = grouperPalette(palette).filter((g) => g.role === "surface");
  assert.deepEqual(surface.couleurs.map((c) => c.couleur), ["#fff", "#fff"]);
});

test("polices : regroupées par famille, graisses dans l'ordre, chargées depuis leur copie", () => {
  const polices = [
    { fichier: "fonts/inter-600.woff2", famille: "Inter", graisse: "600", copie: "polices/b.woff2" },
    { fichier: "fonts/playfair.woff2", famille: "Playfair Display", graisse: "700", copie: "polices/c.woff2" },
    { fichier: "fonts/inter-200.woff2", famille: "Inter", graisse: "200", copie: "polices/a.woff2" },
    { fichier: "fonts/variable.woff2", famille: "Variable", graisse: "100 900", copie: null },
    { fichier: "fonts/orpheline.woff2", famille: "inconnue", graisse: "400", copie: "polices/d.woff2" },
  ];
  const familles = famillesPolices(polices);
  assert.deepEqual(familles.map((f) => f.famille), ["Inter", "Playfair Display", "Variable"]);
  assert.deepEqual(familles[0].graisses.map((g) => g.graisse), ["200", "600"]);
  assert.equal(familles[0].nom, "WebScope Inter");
  const css = cssPolices(polices);
  assert.match(css, /font-family: "WebScope Inter"; src: url\("polices\/a\.woff2"\); font-weight: 200;/);
  assert.equal(css.split("@font-face").length - 1, 3);
  assert.doesNotMatch(css, /Variable|inconnue/);
});

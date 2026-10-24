/**
 * Tests du calcul de la synthèse : compteurs, priorités, badges, moyennes
 * Lancement : npm test
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  compterVerdicts,
  priorites,
  badgesParAxe,
  moyennesPromo,
} from "../src/lib/synthese.js";

const critere = (id, axe, statut, verdict, points = null) => ({
  id,
  axe,
  statut,
  verdict,
  points,
  libelle: id,
  piste: `Piste ${id}`,
});

const criteres = [
  critere("A1", "accessibilite", "C", "respecte", { obtenus: 3, max: 3 }),
  critere("A3", "accessibilite", "C", "non-respecte", { obtenus: 0, max: 3 }),
  critere("A5", "accessibilite", "C", "partiel", { obtenus: 1, max: 2 }),
  critere("A6", "accessibilite", "R", "non-respecte"),
  critere("A13", "accessibilite", "C", "non-mesurable", { obtenus: null, max: 2 }),
  critere("G10", "graphique", "C", "a-juger", { obtenus: null, max: 4 }),
  critere("G1", "graphique", "C", "non-respecte", { obtenus: 0, max: 4 }),
  critere("M4", "methodologie", "C", "non-respecte", { obtenus: 0, max: 1 }),
  critere("M7", "methodologie", "B", "non-respecte", { obtenus: 0, max: 5 }),
  critere("E15", "ergonomie", "I", "respecte"),
];

test("compteurs : contraintes non respectées, recommandations à suivre, critères à juger", () => {
  assert.deepEqual(compterVerdicts(criteres), {
    contraintesNonRespectees: 4, // A3, A5 (partiel), G1, M4
    recommandations: 1, // A6
    aJuger: 1, // G10
  });
});

test("un bonus non obtenu n'est jamais compté comme un échec", () => {
  const ids = priorites(criteres).map((c) => c.id);
  assert.ok(!ids.includes("M7"));
});

test("priorités : les contraintes qui coûtent le plus de points d'abord, cinq au plus", () => {
  const liste = priorites(criteres);
  assert.deepEqual(
    liste.map((c) => [c.id, c.pointsPerdus]),
    [
      ["G1", 4],
      ["A3", 3],
      ["A5", 1],
      ["M4", 1],
    ]
  );
  assert.ok(priorites(criteres, 2).length === 2);
});

test("priorités : un critère non mesurable ou à juger n'y figure pas", () => {
  const ids = priorites(criteres).map((c) => c.id);
  assert.ok(!ids.includes("A13"));
  assert.ok(!ids.includes("G10"));
});

test("badges : nombre de contraintes non respectées par axe", () => {
  assert.deepEqual(badgesParAxe(criteres), {
    graphique: 1,
    ergonomie: 0,
    accessibilite: 2,
    methodologie: 1,
  });
});

test("moyennes de la promo : par axe et note totale, sur les projets analysés", () => {
  const resultat = (totale, a) => ({
    note: {
      totale,
      max: 100,
      parAxe: {
        graphique: { obtenus: a, max: 20 },
        ergonomie: { obtenus: 20, max: 25 },
        accessibilite: { obtenus: 24, max: 30 },
        methodologie: { obtenus: 15, max: 25 },
      },
    },
  });
  const moyennes = moyennesPromo([resultat(70, 10), resultat(80, 16)]);
  assert.equal(moyennes.totale, 75);
  // Par axe : une proportion, insensible au maximum propre à chaque projet
  assert.equal(moyennes.parAxe.graphique, 0.65);
  assert.equal(moyennes.parAxe.accessibilite, 0.8);
  assert.equal(moyennesPromo([]), null);
  // Un projet entièrement non mesurable (dépôt inaccessible) ne tire pas la moyenne vers 0
  const vide = { note: { totale: 0, max: 0, parAxe: resultat(0, 0).note.parAxe } };
  assert.equal(moyennesPromo([resultat(70, 10), vide]).totale, 70);
});

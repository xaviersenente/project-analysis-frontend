/**
 * Les données lues au build respectent le schéma v2
 * Lancement : npm test
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { chargerPromo, chargerResultats } from "../src/lib/donnees.js";

const DOSSIER = new URL("../donnees-fictives/s1-sae/", import.meta.url).pathname;

test("le fichier de promo fictif est valide", () => {
  const promo = chargerPromo(DOSSIER);
  assert.ok(promo.projets.length >= 3);
});

test("chaque résultat fictif est valide et correspond à un projet de la promo", () => {
  const promo = chargerPromo(DOSSIER);
  const resultats = chargerResultats(DOSSIER, promo);
  // Au moins un projet n'est pas encore analysé
  assert.ok(resultats.size < promo.projets.length);
  for (const [slug, resultat] of resultats) {
    assert.equal(resultat.projet.slug, slug);
  }
});

test("chaque critère porte ses occurrences quand il n'est pas respecté", () => {
  const promo = chargerPromo(DOSSIER);
  for (const resultat of chargerResultats(DOSSIER, promo).values()) {
    for (const c of resultat.criteres) {
      if (c.verdict === "non-respecte" && c.methode !== "manuel") {
        assert.ok(c.totalOccurrences >= c.occurrences.length, c.id);
      }
    }
  }
});

test("un résultat invalide fait échouer le build avec un message clair", () => {
  assert.throws(
    () => chargerResultats(DOSSIER, { projets: [{ slug: "../promo" }] }),
    /Identifiant de projet invalide/
  );
});

test("les portfolios fictifs (s3-sae) sont valides : site parcouru, soutenance, propositions de l'IA", () => {
  const dossier = new URL("../donnees-fictives/s3-sae/", import.meta.url).pathname;
  const promo = chargerPromo(dossier);
  const resultats = chargerResultats(dossier, promo);
  assert.ok(resultats.size < promo.projets.length);
  for (const r of resultats.values()) {
    assert.equal(r.grille.profil, "portfolio");
    assert.ok(r.parcours.pages.length > 0 && r.soutenance.tirages.length > 0 && r.historique.commits.length > 0);
  }
  const ed2 = resultats.get("pf-01").criteres.find((c) => c.id === "ED2");
  assert.equal(ed2.proposition.niveau, "partielles");
  assert.equal(ed2.enseignant.niveau, "partielles");
});

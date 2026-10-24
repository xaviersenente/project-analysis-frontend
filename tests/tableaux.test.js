/**
 * Tests du tri des tableaux et de l'arborescence du dépôt
 * Lancement : npm test
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { comparer, construireArbre } from "../src/lib/tableaux.js";

const trier = (valeurs, sens) => [...valeurs].sort((a, b) => comparer(a, b, sens));

test("tri des nombres, croissant et décroissant", () => {
  assert.deepEqual(trier([312, 48, 150], "croissant"), [48, 150, 312]);
  assert.deepEqual(trier([312, 48, 150], "decroissant"), [312, 150, 48]);
});

test("tri des textes à la française : accents et casse ignorés, chiffres dans l'ordre", () => {
  assert.deepEqual(trier(["équipe.webp", "Logo.svg", "affiche.webp"], "croissant"), [
    "affiche.webp",
    "équipe.webp",
    "Logo.svg",
  ]);
  assert.deepEqual(trier(["img10.webp", "img2.webp"], "croissant"), ["img2.webp", "img10.webp"]);
});

test("une valeur absente est toujours rangée à la fin", () => {
  assert.deepEqual(trier([null, 20, 5], "croissant"), [5, 20, null]);
  assert.deepEqual(trier([null, 20, 5], "decroissant"), [20, 5, null]);
});

test("arborescence : dossiers d'abord, puis fichiers, par ordre alphabétique", () => {
  const arbre = construireArbre([
    { chemin: "index.html", problemes: [] },
    { chemin: "css/style.css", problemes: [] },
    { chemin: "assets/img/Photo Équipe.JPG", problemes: ["majuscule", "espace", "accent"] },
    { chemin: "about.html", problemes: [] },
    { chemin: "assets/fonts/titre.woff2", problemes: [] },
  ]);
  assert.deepEqual(
    arbre.map((n) => n.nom),
    ["assets", "css", "about.html", "index.html"]
  );
  const assets = arbre[0];
  assert.deepEqual(assets.enfants.map((n) => n.nom), ["fonts", "img"]);
  const photo = assets.enfants[1].enfants[0];
  assert.equal(photo.nom, "Photo Équipe.JPG");
  assert.deepEqual(photo.problemes, ["majuscule", "espace", "accent"]);
});

test("arborescence : un dossier signale le nombre de noms fautifs qu'il contient", () => {
  const arbre = construireArbre([
    { chemin: "assets/img/A.JPG", problemes: ["majuscule"] },
    { chemin: "assets/img/b.webp", problemes: [] },
    { chemin: "assets/Mon Fichier.txt", problemes: ["majuscule", "espace"] },
  ]);
  assert.equal(arbre[0].fautifs, 2);
  assert.equal(arbre[0].enfants[0].fautifs, 1);
});

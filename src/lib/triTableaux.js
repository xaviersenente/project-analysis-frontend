/**
 * Tri des tableaux marqués data-triable (navigateur) : un clic sur l'en-tête trie,
 * un second inverse. Chaque cellule porte sa valeur de tri dans data-valeur.
 */
import { comparer } from "./tableaux.js";

export const activerTri = () => {
  for (const table of document.querySelectorAll("table[data-triable]:not([data-tri-actif])")) {
    table.dataset.triActif = "";
    const corps = table.tBodies[0];
    const entetes = [...table.querySelectorAll("thead th[aria-sort]")];

    table.querySelectorAll("thead button[data-colonne]").forEach((bouton) => {
      bouton.addEventListener("click", () => {
        const th = bouton.closest("th");
        const sens = th.getAttribute("aria-sort") === "ascending" ? "decroissant" : "croissant";
        const colonne = Number(bouton.dataset.colonne);
        const nombre = bouton.hasAttribute("data-nombre");
        const valeur = (ligne) => {
          const brute = ligne.cells[colonne]?.dataset.valeur ?? "";
          return nombre && brute !== "" ? Number(brute) : brute;
        };
        corps.append(...[...corps.rows].sort((a, b) => comparer(valeur(a), valeur(b), sens)));

        for (const autre of entetes) {
          autre.setAttribute("aria-sort", "none");
          autre.querySelector(".indicateur").textContent = "↕";
        }
        th.setAttribute("aria-sort", sens === "croissant" ? "ascending" : "descending");
        th.querySelector(".indicateur").textContent = sens === "croissant" ? "↑" : "↓";
      });
    });
  }
};

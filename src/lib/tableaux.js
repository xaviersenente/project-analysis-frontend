/**
 * Tri des tableaux (navigateur) et arborescence du dépôt (build)
 */

const collation = new Intl.Collator("fr", { sensitivity: "base", numeric: true });

/**
 * Compare deux valeurs de cellule ; une valeur absente va toujours à la fin
 * @param {string|number|null} a
 * @param {string|number|null} b
 * @param {"croissant" | "decroissant"} sens
 */
export const comparer = (a, b, sens) => {
  const absentA = a === null || a === undefined || a === "";
  const absentB = b === null || b === undefined || b === "";
  if (absentA || absentB) return absentA === absentB ? 0 : absentA ? 1 : -1;
  const ordre =
    typeof a === "number" && typeof b === "number" ? a - b : collation.compare(String(a), String(b));
  return sens === "decroissant" ? -ordre : ordre;
};

/**
 * Construit l'arbre des fichiers à partir de chemins à plat
 * @param {Array<{ chemin: string, problemes: string[] }>} entrees
 * @returns {Array<{ nom: string, chemin: string, dossier: boolean, problemes: string[], fautifs: number, enfants: Array }>}
 */
export const construireArbre = (entrees) => {
  const racine = { enfants: new Map() };
  for (const { chemin, problemes } of entrees) {
    const parties = chemin.split("/");
    let noeud = racine;
    parties.forEach((nom, index) => {
      const estFichier = index === parties.length - 1;
      if (!noeud.enfants.has(nom)) {
        noeud.enfants.set(nom, {
          nom,
          chemin: parties.slice(0, index + 1).join("/"),
          dossier: !estFichier,
          problemes: estFichier ? problemes : [],
          enfants: new Map(),
        });
      }
      noeud = noeud.enfants.get(nom);
    });
  }

  const finaliser = (noeud) => {
    const enfants = [...noeud.enfants.values()]
      .map(finaliser)
      .sort((a, b) => Number(b.dossier) - Number(a.dossier) || collation.compare(a.nom, b.nom));
    const fautifs = enfants.reduce(
      (total, e) => total + (e.dossier ? e.fautifs : e.problemes.length > 0 ? 1 : 0),
      0
    );
    return { ...noeud, enfants, fautifs };
  };

  return finaliser(racine).enfants;
};

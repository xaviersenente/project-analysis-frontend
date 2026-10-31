/**
 * Sections d'analyse de la page d'un projet, selon le profil de sa grille (resultat.grille.profil).
 * Les axes viennent de la grille ; ces sections-ci, de ce que le profil sait mesurer.
 */
const SECTIONS = {
  // Site HTML/CSS lu dans le dépôt (SAÉ 105)
  sae105: [
    { id: "par-page", libelle: "Vue par page" },
    { id: "timeline", libelle: "Timeline" },
    { id: "ressources", libelle: "Ressources" },
  ],
  // Site en ligne parcouru (portfolio S3)
  portfolio: [{ id: "site", libelle: "Site parcouru" }],
};

/** Un résultat sans profil (antérieur aux grilles par SAÉ) est de la SAÉ 105 */
export const sectionsAnalyse = (profil) => SECTIONS[profil] ?? SECTIONS.sae105;

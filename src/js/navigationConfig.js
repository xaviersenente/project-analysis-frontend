/**
 * Configuration de la navigation pour le dashboard
 * Définit les sections et les liens de navigation pour HTML et CSS
 */
export const NAV_SECTIONS = [
  {
    title: "HTML",
    variant: "html",
    icon: "html",
    links: [
      { section: "html", label: "Introduction" },
      { section: "scores", label: "Scores" },
      { section: "files", label: "Fichiers" },
      { section: "tags", label: "Balises" },
      { section: "structure", label: "Structure" },
      { section: "images", label: "Images" },
    ],
  },
  {
    title: "CSS",
    variant: "css",
    icon: "css",
    links: [
      { section: "css", label: "Introduction" },
      { section: "css-scores", label: "Scores" },
      { section: "css-stats", label: "Métriques" },
      { section: "css-variables", label: "Variables" },
      { section: "css-colors", label: "Couleurs" },
      { section: "typography", label: "Typographie" },
      { section: "css-organization", label: "Organisation" },
      { section: "classes", label: "Classes" },
      { section: "css-selectors", label: "Sélecteurs" },
      { section: "css-properties", label: "Propriétés" },
      { section: "css-rules", label: "Règles" },
      { section: "css-units", label: "Unités" },
    ],
  },
];

/**
 * Liste de toutes les sections pour la détection du scroll
 */
export const ALL_SECTIONS = NAV_SECTIONS.flatMap((navSection) =>
  navSection.links.map((link) => link.section)
);

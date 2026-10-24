/**
 * Les quatre axes d'évaluation, dans l'ordre d'affichage
 * (pondération : CRITERES-SAE105-2026.md)
 */
export const AXES = [
  {
    id: "graphique",
    nom: "Graphique",
    points: 20,
    description: "Le système graphique mesurable : palette, échelles, polices et unités.",
  },
  {
    id: "ergonomie",
    nom: "Ergonomie",
    points: 25,
    description: "L'usage, le poids des pages et la navigation sur mobile.",
  },
  {
    id: "accessibilite",
    nom: "Accessibilité",
    points: 30,
    description: "La structure, les alternatives textuelles, le focus et le contraste.",
  },
  {
    id: "methodologie",
    nom: "Méthodologie",
    points: 25,
    description: "La qualité du code et du dépôt, dont la régularité du travail.",
  },
];

/** Classes de couleur d'axe, écrites en entier pour que Tailwind les génère */
export const COULEUR_AXE = {
  graphique: { pastille: "bg-axe-graphique", lisere: "border-axe-graphique" },
  ergonomie: { pastille: "bg-axe-ergonomie", lisere: "border-axe-ergonomie" },
  accessibilite: { pastille: "bg-axe-accessibilite", lisere: "border-axe-accessibilite" },
  methodologie: { pastille: "bg-axe-methodologie", lisere: "border-axe-methodologie" },
};

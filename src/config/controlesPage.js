/**
 * Colonnes de la vue par page : chaque contrôle renvoie au critère qu'il vérifie
 */
export const COLONNES_PAGE = [
  { cle: "lang", libelle: "lang", critere: "A1" },
  { cle: "titleUnique", libelle: "title unique", critere: "A2" },
  { cle: "descriptionUnique", libelle: "description unique", critere: "A2" },
  { cle: "reperes", libelle: "Repères", critere: "A3" },
  { cle: "h1Unique", libelle: "Un seul h1", critere: "A4" },
  { cle: "titresSansSaut", libelle: "Titres sans saut", critere: "A4" },
  { cle: "menuPopover", libelle: "Menu popover", critere: "E1" },
  { cle: "ariaCurrent", libelle: "aria-current", critere: "E2" },
  { cle: "w3c", libelle: "Erreurs W3C", critere: "M1" },
  { cle: "lighthouseA11y", libelle: "Lighthouse Acc.", critere: "A13" },
];

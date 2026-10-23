import { GAP_THRESHOLDS } from "./constants";

// Constantes pour les tailles
const BYTE_UNITS = {
  B: 1,
  Ko: 1024,
  Mo: 1024 * 1024,
  Go: 1024 * 1024 * 1024,
};

/**
 * Méthode pour extraire le nom du fichier depuis l'URL
 * @param {string} urlString - L'URL dont on veut extraire le nom de fichier
 * @returns {string} Le nom du fichier ou "Fichier invalide" en cas d'erreur
 */
export const getFileName = (urlString) => {
  try {
    const url = new URL(urlString);
    return url.pathname.split("/").pop();
  } catch (error) {
    // Gestion des cas où l'URL n'est pas valide
    return "Fichier invalide";
  }
};

/**
 * Fonction pour formater les tailles (en octets, Ko, Mo ou Go)
 * @param {number} size - Taille en octets
 * @param {number} decimals - Nombre de décimales (défaut: 2)
 * @returns {string} La taille formatée avec l'unité appropriée
 */
export const formatSize = (size, decimals = 2) => {
  if (!size || size === 0) return `0${String.fromCharCode(160)}o`;

  const absSize = Math.abs(size);
  const nbsp = String.fromCharCode(160); // Espace insécable

  if (absSize < BYTE_UNITS.Ko) {
    return `${size}${nbsp}o`;
  }
  if (absSize < BYTE_UNITS.Mo) {
    return `${(size / BYTE_UNITS.Ko).toFixed(decimals)}${nbsp}Ko`;
  }
  if (absSize < BYTE_UNITS.Go) {
    return `${(size / BYTE_UNITS.Mo).toFixed(decimals)}${nbsp}Mo`;
  }
  return `${(size / BYTE_UNITS.Go).toFixed(decimals)}${nbsp}Go`;
};

/**
 * Calcule le pourcentage d'écart entre le nombre total et unique
 * @param {number} total - Nombre total de sélecteurs
 * @param {number} unique - Nombre de sélecteurs uniques
 * @returns {string} Le pourcentage d'écart avec une décimale
 */
export const gap = (total, unique) => {
  if (total === 0) return "0.0"; // Évite une division par zéro
  const percentage = ((total - unique) / total) * 100;
  return percentage.toFixed(1); // Arrondi à une décimale
};

/**
 * Détermine la classe CSS appropriée en fonction de la valeur d'écart
 * @param {number|string} gapValue - Valeur de l'écart (peut être un nombre ou une chaîne)
 * @returns {string} La classe CSS correspondante
 */
export const getGapClass = (gapValue) => {
  const numValue =
    typeof gapValue === "string" ? parseFloat(gapValue) : gapValue;

  if (numValue <= GAP_THRESHOLDS.excellent.max) {
    return GAP_THRESHOLDS.excellent.class;
  }
  if (numValue <= GAP_THRESHOLDS.good.max) {
    return GAP_THRESHOLDS.good.class;
  }
  if (numValue <= GAP_THRESHOLDS.warning.max) {
    return GAP_THRESHOLDS.warning.class;
  }
  return GAP_THRESHOLDS.critical.class;
};

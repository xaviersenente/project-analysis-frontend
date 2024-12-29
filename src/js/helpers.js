// Méthode pour extraire le nom du fichier depuis l'URL
export const getFileName = (urlString) => {
  try {
    const url = new URL(urlString);
    return url.pathname.split("/").pop();
  } catch (error) {
    // Gestion des cas où l'URL n'est pas valide
    return "Fichier invalide";
  }
};

// Fonction pour formater les tailles (en Ko ou Mo)
export const formatSize = (size) => {
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)}${String.fromCharCode(160)}Ko`;
  }
  return `${(size / (1024 * 1024)).toFixed(2)}${String.fromCharCode(160)}Mo`;
};

/**
 * Calcule le pourcentage d'écart entre le nombre total et unique,
 *
 * @param {number} total - Nombre total de sélecteurs.
 * @param {number} unique - Nombre de sélecteurs uniques.
 */
export const gap = (total, unique) => {
  if (total === 0) return "0.0"; // Évite une division par zéro
  const percentage = ((total - unique) / total) * 100;
  return percentage.toFixed(1); // Arrondi à une décimale
};

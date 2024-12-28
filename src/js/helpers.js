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

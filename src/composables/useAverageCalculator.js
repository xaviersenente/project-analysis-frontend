import { computed } from "vue";

/**
 * Composable pour calculer les moyennes des scores Lighthouse
 * @param {Object} projectData - Données du projet contenant les pages
 * @returns {Object} Moyennes calculées pour chaque métrique Lighthouse
 */
export function useAverageCalculator(projectData) {
  /**
   * Calcule la moyenne d'une métrique spécifique
   * @param {string} key - Clé de la métrique (performance, accessibility, etc.)
   * @returns {number|null} Moyenne calculée avec 2 décimales, null si rien n'est mesuré
   */
  const getAverage = (key) => {
    // Seules les pages mesurées comptent (F4)
    const pages = (projectData.value?.pages || []).filter(
      (page) => typeof page.lighthouseReport?.[key] === "number"
    );
    if (pages.length === 0) return null;

    const total = pages.reduce((sum, page) => sum + page.lighthouseReport[key], 0);
    return parseFloat((total / pages.length).toFixed(2));
  };

  /**
   * Calcule toutes les moyennes des métriques Lighthouse
   */
  const averages = computed(() => ({
    performance: getAverage("performance"),
    accessibility: getAverage("accessibility"),
    bestPractices: getAverage("bestPractices"),
    seo: getAverage("seo"),
  }));

  return {
    averages,
    getAverage,
  };
}

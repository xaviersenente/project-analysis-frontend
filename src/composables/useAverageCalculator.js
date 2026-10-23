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
   * @returns {number} Moyenne calculée avec 2 décimales
   */
  const getAverage = (key) => {
    if (
      !projectData.value?.pages ||
      !Array.isArray(projectData.value.pages) ||
      projectData.value.pages.length === 0
    ) {
      return 0;
    }

    const total = projectData.value.pages.reduce(
      (sum, page) => sum + (page.lighthouseReport?.[key] || 0),
      0
    );
    return parseFloat((total / projectData.value.pages.length).toFixed(2));
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

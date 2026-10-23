import { ref, computed, onMounted } from "vue";
import { getApiBaseUrl } from "../js/constants";

/**
 * Composable pour gérer le chargement et l'état des données du projet
 * @returns {Object} État et méthodes pour gérer les données du projet
 */
export function useProjectData() {
  const API_BASE_URL = getApiBaseUrl();

  const projects = ref([]);
  const selectedProject = ref(null);
  const projectData = ref(null);
  const classStats = ref(null);
  const fonts = ref([]);
  const loading = ref(false);

  /**
   * Prépare les options pour le composant CustomSelect
   */
  const projectsOptions = computed(() =>
    projects.value.map((project) => ({ value: project, label: project }))
  );

  /**
   * Récupère les statistiques de classe depuis l'API
   */
  const fetchClassStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/stats/class`);
      classStats.value = await response.json();
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques :", error);
    }
  };

  /**
   * Récupère la liste des projets depuis l'API
   */
  const fetchProjects = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/scan/projects`);
      projects.value = await response.json();

      if (projects.value.length > 0) {
        selectedProject.value = {
          value: projects.value[0],
          label: projects.value[0],
        };
        await fetchProjectData();
      }
    } catch (error) {
      console.error("Erreur lors du chargement des projets :", error);
    }
  };

  /**
   * Récupère les données d'un projet spécifique
   */
  const fetchProjectData = async () => {
    if (!selectedProject.value) return;

    loading.value = true;
    try {
      const response = await fetch(
        `${API_BASE_URL}/scan/project/${selectedProject.value.value}`
      );
      projectData.value = await response.json();
      extractFontsFromImport();
    } catch (error) {
      console.error("Erreur lors du chargement du projet :", error);
    } finally {
      loading.value = false;
    }
  };

  /**
   * Extrait les polices depuis @import et les charge dynamiquement
   */
  const extractFontsFromImport = () => {
    fonts.value = [];
    const importObj =
      projectData.value?.cssAnalysisResult?.atrules?.import?.unique || {};
    const importUrl = Object.keys(importObj)[0] || "";

    if (importUrl) {
      const url = importUrl.match(/url\("(.+?)"\)/)?.[1];

      if (url) {
        loadGoogleFonts(url);

        const fontFamilies = [...url.matchAll(/family=([^&]+)/g)].map(
          (match) => match[1]
        );

        fonts.value = fontFamilies.map((family) =>
          family.split(":")[0].replace(/\+/g, " ")
        );
      }
    }
  };

  /**
   * Charge les polices Google Fonts dans le document
   * @param {string} url - URL des polices Google Fonts
   */
  const loadGoogleFonts = (url) => {
    const existingLink = document.querySelector(`link[data-dynamic-fonts]`);
    if (existingLink) {
      existingLink.href = url;
    } else {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = url;
      link.setAttribute("data-dynamic-fonts", "true");
      document.head.appendChild(link);
    }
  };

  // Initialisation au montage du composant
  onMounted(() => {
    fetchProjects();
    fetchClassStats();
  });

  return {
    projects,
    selectedProject,
    projectData,
    classStats,
    fonts,
    loading,
    projectsOptions,
    fetchProjectData,
  };
}

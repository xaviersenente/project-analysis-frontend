import { ref, computed, onMounted } from "vue";
import { getApiBaseUrl } from "../js/constants";

const CLE_JETON = "webscope-jeton";

/**
 * Lecture et écriture du jeton dans le sessionStorage (peut être indisponible)
 */
const lireJeton = () => {
  try {
    return sessionStorage.getItem(CLE_JETON) || "";
  } catch {
    return "";
  }
};

const ecrireJeton = (valeur) => {
  try {
    if (valeur) sessionStorage.setItem(CLE_JETON, valeur);
    else sessionStorage.removeItem(CLE_JETON);
  } catch {
    // Le jeton reste en mémoire pour cette page
  }
};

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
  const jeton = ref("");
  const jetonRequis = ref(false);
  const jetonRefuse = ref(false);

  /**
   * Appel de l'API avec le jeton (S2) ; un 401 redemande le jeton
   */
  const apiFetch = async (chemin) => {
    const response = await fetch(`${API_BASE_URL}${chemin}`, {
      headers: { Authorization: `Bearer ${jeton.value}` },
    });
    if (response.status === 401) {
      if (jeton.value) jetonRefuse.value = true;
      jeton.value = "";
      ecrireJeton("");
      jetonRequis.value = true;
      throw new Error("Jeton refusé");
    }
    if (!response.ok) throw new Error(`Erreur ${response.status}`);
    return response.json();
  };

  /**
   * Enregistre le jeton saisi puis charge les données
   * @param {string} valeur - Jeton fourni par l'enseignant
   */
  const enregistrerJeton = (valeur) => {
    jeton.value = valeur.trim();
    ecrireJeton(jeton.value);
    jetonRequis.value = false;
    jetonRefuse.value = false;
    chargerDonnees();
  };

  /**
   * Prépare les options pour le composant CustomSelect
   */
  const projectsOptions = computed(() => projects.value.map(toOption));

  /**
   * Un projet de la promo devient une option : le slug en valeur, le nom et le groupe en libellé
   */
  const toOption = ({ slug, nom, groupe, analyse }) => ({
    value: slug,
    nom,
    label: [nom, groupe].filter(Boolean).join(" · ") + (analyse ? "" : " (non analysé)"),
  });

  /**
   * Récupère les statistiques de classe depuis l'API
   */
  const fetchClassStats = async () => {
    try {
      classStats.value = await apiFetch("/stats/class");
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques :", error);
    }
  };

  /**
   * Récupère la liste des projets depuis l'API
   */
  const fetchProjects = async () => {
    try {
      projects.value = await apiFetch("/scan/projects");

      const premier = projects.value.find((project) => project.analyse);
      if (premier) {
        selectedProject.value = toOption(premier);
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
      projectData.value = await apiFetch(
        `/scan/project/${encodeURIComponent(selectedProject.value.value)}`
      );
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

  const chargerDonnees = () => {
    fetchProjects();
    fetchClassStats();
  };

  // Initialisation au montage du composant : sans jeton, on le demande d'abord
  onMounted(() => {
    jeton.value = lireJeton();
    if (jeton.value) chargerDonnees();
    else jetonRequis.value = true;
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
    jetonRequis,
    jetonRefuse,
    enregistrerJeton,
  };
}

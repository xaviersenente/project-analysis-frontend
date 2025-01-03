<template>
  <div
    class="fixed top-0 left-0 w-full p-4 bg-white flex flex-wrap justify-between gap-4 z-10 md:p-8"
  >
    <div class="flex gap-8 items-center">
      <p class="font-semibold text-2xl">WebScope</p>
      <a href="#html"><HtmlIcon class="w-10 h-10" /></a>
      <a href="#css"><CssIcon class="w-10 h-10" /></a>
    </div>
    <CustomSelect
      v-model:selectedOption="selectedProject"
      :options="projectsOptions"
      @update:selectedOption="fetchProjectData"
    />
  </div>
  <div class="mx-auto p-4 lg:p-12 mt-32 lg:mt-28 max-w-[1920px]">
    <div v-if="projectData">
      <div v-if="loading" class="text-center">Chargement...</div>

      <div v-else class="grid gap-8 grid-cols-12">
        <div
          class="col-span-12 flex flex-col gap-2 lg:flex-row lg:items-end lg:gap-8"
        >
          <h1 class="text-3xl font-bold lg:text-5xl">
            {{ projectData.pages[0].title }}
          </h1>
          <h2 class="text-xl">
            Projet réalisé par {{ selectedProject.value }}
          </h2>
        </div>
        <Block
          id="html"
          class="col-span-12 lg:col-span-6 xl:col-span-4 scroll-mt-28"
          variant="html"
        >
          <div class="bg-white rounded-lg p-4 flex gap-4 items-center mb-8">
            <HtmlIcon class="w-14 h-14 lg:w-16 lg:h-16" />
            <h2 class="text-3xl font-bold text-orange-600 lg:text-4xl">
              Code HTML
            </h2>
          </div>
          <p>
            L'analyse du code HTML porte sur l'ensemble des pages en Français
            uniquement.
          </p>
        </Block>

        <BlockScores :projectData="projectData" />

        <BlockTags :projectData="projectData" />

        <BlockStructure :projectData="projectData" />

        <BlockImages :projectData="projectData" />

        <BlockFilesHtml :files="projectData.pages" />

        <Block
          id="css"
          class="col-span-12 lg:col-span-6 xl:col-span-4 scroll-mt-24"
          variant="css"
        >
          <div class="bg-white rounded-lg p-4 flex gap-4 items-center mb-8">
            <CssIcon class="w-14 h-14 lg:w-16 lg:h-16" />
            <h2 class="text-3xl font-bold text-blue-600 lg:text-4xl">
              Code CSS
            </h2>
          </div>
          <p>
            L'analyse du code CSS porte sur l'ensemble des fichiers CSS hormis
            le fichier <code>normalize.css</code>, s'il a été utilisé.
          </p>
        </Block>

        <BlockCssStats :projectData="projectData" />

        <BlockCssColor :projectData="projectData" />

        <BlockTypography
          :cssAnalysisResult="projectData.cssAnalysisResult.values"
          :fonts="fonts"
        />

        <BlockCssRules :projectData="projectData" />

        <BlockCssSelectors :projectData="projectData" />

        <BlockCssUnit :projectData="projectData" />

        <BlockCssProperties :projectData="projectData" />
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, computed } from "vue";
  import Block from "./Block.vue";
  import HtmlIcon from "../icons/Html.vue";
  import CssIcon from "../icons/Css.vue";
  import CustomSelect from "./CustomSelect.vue";
  import BlockCssColor from "./Blocks/BlockCssColor.vue";
  import BlockImages from "./Blocks/BlockImages.vue";
  import BlockScores from "./Blocks/BlockScores.vue";
  import BlockTags from "./Blocks/BlockTags.vue";
  import BlockFilesHtml from "./Blocks/BlockFilesHtml.vue";
  import BlockStructure from "./Blocks/BlockStructure.vue";
  import BlockCssStats from "./Blocks/BlockCssStats.vue";
  import BlockCssUnit from "./Blocks/BlockCssUnit.vue";
  import BlockCssSelectors from "./Blocks/BlockCssSelectors.vue";
  import BlockCssRules from "./Blocks/BlockCssRules.vue";
  import BlockCssProperties from "./Blocks/BlockCssProperties.vue";
  import BlockTypography from "./Blocks/BlockTypography.vue";

  // Récupère l'URL de base depuis les variables d'environnement
  // const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
  const API_BASE_URL = "http://localhost:3000";
  // const API_BASE_URL = "https://project-analysis-backend.onrender.com";

  const projects = ref([]);
  const selectedProject = ref(null);
  const projectData = ref(null);
  const fonts = ref([]);
  const loading = ref(false);

  // Prépare les options pour CustomSelect
  const projectsOptions = computed(() =>
    projects.value.map((project) => ({ value: project, label: project }))
  );

  // Récupère les projets depuis l'API
  const fetchProjects = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/scan/projects`);
      projects.value = await response.json();

      // Sélectionne le premier projet par défaut
      if (projects.value.length > 0) {
        selectedProject.value = {
          value: projects.value[0],
          label: projects.value[0],
        };
        fetchProjectData(); // Charge les données du premier projet
      }
    } catch (error) {
      console.error("Erreur lors du chargement des projets :", error);
    }
  };

  const fetchProjectData = async () => {
    if (!selectedProject.value) return;
    // loading.value = true;
    const response = await fetch(
      `${API_BASE_URL}/scan/project/${selectedProject.value.value}`
    );
    projectData.value = await response.json();
    // loading.value = false;
    // Extrait les polices de @import
    extractFontsFromImport();
  };

  onMounted(fetchProjects);

  // Fonction pour extraire les polices depuis @import et les charger dynamiquement
  const extractFontsFromImport = () => {
    // Réinitialise fonts à chaque appel pour éviter les anciennes données
    fonts.value = [];
    const importObj =
      projectData.value?.cssAnalysisResult?.atrules?.import?.unique || {};
    const importUrl = Object.keys(importObj)[0] || "";
    // console.log("Import URL:", importUrl); // Vérifie si l'URL est bien présente

    if (importUrl) {
      const url = importUrl.match(/url\("(.+?)"\)/)?.[1];
      // console.log("Extracted URL:", url); // Vérifie l'URL extraite

      if (url) {
        loadGoogleFonts(url);

        // Utiliser une expression régulière pour capturer toutes les valeurs de family
        const fontFamilies = [...url.matchAll(/family=([^&]+)/g)].map(
          (match) => match[1]
        );
        // console.log("All Font Families:", fontFamilies); // Affiche toutes les familles récupérées

        // Extraire uniquement le nom des polices
        fonts.value = fontFamilies.map((family) =>
          family.split(":")[0].replace(/\+/g, " ")
        ); // Nettoie et sépare les familles
        // console.log("Fonts:", fonts.value); // Vérifie la liste des polices nettoyées
      }
    }
  };

  // // Ajoute dynamiquement une balise <link> au head pour charger les polices
  const loadGoogleFonts = (url) => {
    const existingLink = document.querySelector(`link[data-dynamic-fonts]`);
    if (existingLink) {
      existingLink.href = url; // Met à jour si une balise existe déjà
    } else {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = url;
      link.setAttribute("data-dynamic-fonts", "true"); // Ajoute un attribut pour identification
      document.head.appendChild(link);
    }
  };
</script>

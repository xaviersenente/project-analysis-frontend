<template>
  <div
    class="fixed top-0 left-0 w-full p-4 bg-white flex flex-wrap justify-between gap-4 z-10 md:p-8"
  >
    <div class="flex gap-8 items-center">
      <p class="font-semibold md:text-2xl">Analyse HTML/CSS</p>
      <a href="#html"><HtmlIcon class="w-10 h-10" /></a>
      <a href="#css"><CssIcon class="w-10 h-10" /></a>
    </div>
    <CustomSelect
      v-model:selectedOption="selectedProject"
      :options="projectsOptions"
      @update:selectedOption="fetchProjectData"
    />
  </div>
  <div class="mx-auto p-4 lg:p-12 mt-32 lg:mt-28">
    <div v-if="projectData">
      <div v-if="loading" class="text-center">Chargement...</div>

      <div v-else class="grid gap-8 grid-cols-12">
        <div class="col-span-12 flex flex-col gap-8 lg:flex-row lg:items-end">
          <h1 class="text-5xl font-bold">{{ projectData.pages[0].title }}</h1>
          <h2 class="text-xl">
            Projet réalisé par {{ selectedProject.value }}
          </h2>
        </div>
        <Block
          id="html"
          class="col-span-12 lg:col-span-6 xl:col-span-4 scroll-mt-28"
          variant="html"
        >
          <div class="bg-white rounded-lg p-3 flex gap-8 items-center mb-8">
            <HtmlIcon class="w-14 h-14 lg:w-20 lg:h-20" />
            <h2 class="text-3xl font-bold text-orange-600 lg:text-5xl">
              Code HTML
            </h2>
          </div>
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
          <div class="bg-white rounded-lg p-3 flex gap-8 items-center mb-8">
            <CssIcon class="w-14 h-14 lg:w-20 lg:h-20" />
            <h2 class="text-3xl font-bold text-blue-600 lg:text-5xl">
              Code CSS
            </h2>
          </div>
        </Block>

        <BlockCssStats :projectData="projectData" />

        <BlockCssColor :projectData="projectData" />

        <Block title="Typographie" class="col-span-12 2xl:col-span-8">
          <div class="grid gap-8 items-start lg:grid-cols-3">
            <div>
              <div class="flex gap-4 justify-between mb-4">
                <h4 class="text-lg">Font-family</h4>
                <div class="flex gap-4">
                  <div>
                    <div class="text-xs uppercase">Total</div>
                    <div class="text-xl font-bold">
                      {{
                        projectData.cssAnalysisResult.values?.fontFamilies
                          ?.total
                      }}
                    </div>
                  </div>
                  <div>
                    <div class="text-xs uppercase">Unique</div>
                    <div class="text-xl font-bold">
                      {{
                        projectData.cssAnalysisResult.values?.fontFamilies
                          ?.totalUnique
                      }}
                    </div>
                  </div>
                </div>
              </div>

              <table
                class="min-w-full table-auto border-collapse text-left text-sm"
              >
                <thead>
                  <tr class="bg-gray-100 *:px-4 *:py-2">
                    <th>Valeur</th>
                    <th>Nb</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(count, font) in projectData.cssAnalysisResult
                      ?.values?.fontFamilies?.unique"
                    :key="font"
                    class="hover:bg-gray-50 transition-colors *:px-4 *:py-2 *:border-b"
                  >
                    <td class="font-mono">{{ font }}</td>
                    <td class="font-mono">{{ count }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <div class="flex gap-4 justify-between mb-4">
                <h4 class="text-lg">Font-size</h4>
                <div class="flex gap-4">
                  <div>
                    <div class="text-xs uppercase">Total</div>
                    <div class="text-xl font-bold">
                      {{
                        projectData.cssAnalysisResult.values?.fontSizes?.total
                      }}
                    </div>
                  </div>
                  <div>
                    <div class="text-xs uppercase">Unique</div>
                    <div class="text-xl font-bold">
                      {{
                        projectData.cssAnalysisResult.values?.fontSizes
                          ?.totalUnique
                      }}
                    </div>
                  </div>
                </div>
              </div>
              <table
                class="min-w-full table-auto border-collapse text-left text-sm"
              >
                <thead>
                  <tr class="bg-gray-100 *:px-4 *:py-2">
                    <th>Valeur</th>
                    <th>Nb</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(count, font) in projectData.cssAnalysisResult
                      ?.values?.fontSizes?.unique"
                    :key="font"
                    class="hover:bg-gray-50 transition-colors *:px-4 *:py-2 *:border-b"
                  >
                    <td class="font-mono">{{ font }}</td>
                    <td class="font-mono">{{ count }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <h3 class="text-lg mb-4">Google Fonts</h3>
              <ul v-if="fonts.length > 0">
                <li v-for="font in fonts" :key="font" class="mt-4">
                  <p
                    class="text-slate-500 border-b border-b-slate-300 pb-1 mb-1"
                  >
                    {{ font }}
                  </p>
                  <p class="text-4xl" :style="{ fontFamily: font }">
                    Hamburgevons
                  </p>
                </li>
              </ul>
              <p v-else>Aucune Google fonte</p>
            </div>
          </div>
        </Block>
        <!-- 
        <Block title="Variables" class="col-span-12 lg:col-span-4">
          Nombre de variables :
          {{ projectData.cssAnalysisResult.properties.custom.total }}
          <div class="flex flex-wrap gap-2">
            <div
              v-for="(count, font) in projectData.cssAnalysisResult.properties
                .custom.unique"
              :key="font"
            >
              <Code :tag="font" />
            </div>
          </div>
        </Block> -->

        <BlockCssRules :projectData="projectData" />

        <BlockCssSelectors :projectData="projectData" />

        <BlockCssUnit :projectData="projectData" />

        <!-- <Block title="Éléments graphiques" class="col-span-12 lg:col-span-6">
          <ul>
            <li>Nombre de @media</li>
            <li>
              Nb de sélecteurs vs unique :
              {{ projectData.cssAnalysisResult.selectors.total }} /
              {{ projectData.cssAnalysisResult.selectors.totalUnique }}
            </li>
            <li>
              Nombre de sélecteur avec spécificité 0,0,1 (sélecteur de type) =>
              si possible liste des sélecteurs
            </li>
            <li>
              Nombre de Font-size :
              {{ projectData.cssAnalysisResult.values.fontSizes.totalUnique }}
            </li>
          </ul>
        </Block> -->
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, computed } from "vue";
  import { getFileName } from "../js/helpers";
  // import chroma from "chroma-js";
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

  // Récupère l'URL de base depuis les variables d'environnement
  //const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
  const API_BASE_URL = "https://project-analysis-backend.onrender.com";

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

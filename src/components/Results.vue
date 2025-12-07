<template>
  <!-- Header principal -->
  <div
    class="fixed top-0 left-0 w-full p-4 bg-white flex flex-wrap justify-between gap-8 z-20 md:p-8 shadow-sm">
    <div class="flex gap-8 items-center">
      <p class="font-semibold text-2xl">WebScope</p>
      <!-- Bouton hamburger mobile (séparé du menu) -->
      <button
        class="lg:hidden"
        @click="toggleMobileNav"
        aria-label="Toggle navigation">
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            v-if="!mobileNavOpen"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16" />
          <path
            v-else
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div class="hidden lg:flex gap-8 items-center">
        <a href="#html"><HtmlIcon class="w-10 h-10" /></a>
        <a href="#css"><CssIcon class="w-10 h-10" /></a>
      </div>
    </div>
    <CustomSelect
      v-model:selectedOption="selectedProject"
      :options="projectsOptions"
      @update:selectedOption="fetchProjectData" />
  </div>

  <div class="flex mt-32 lg:mt-28">
    <!-- Overlay mobile (backdrop) -->
    <div
      v-if="mobileNavOpen"
      class="lg:hidden fixed inset-0 bg-black/50 z-30"
      @click="toggleMobileNav"></div>

    <!-- Menu de navigation unifié (Desktop + Mobile) -->
    <aside
      :class="[
        'fixed overflow-y-auto z-40',
        // Desktop: sidebar fixe, toujours visible, sans fond ni bordure
        'lg:left-0 lg:top-32 lg:w-56 lg:h-[calc(100vh-8rem)] lg:p-6 lg:block lg:bg-transparent',
        // Mobile: overlay avec slide, visible seulement si mobileNavOpen
        'bg-white top-0 left-0 h-full w-72 shadow-xl transform transition-transform duration-300',
        // Gestion de la visibilité
        mobileNavOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      ]">
      <!-- Header mobile (titre + bouton fermer) -->
      <div class="lg:hidden p-6 pb-0">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold">Navigation</h2>
          <button @click="toggleMobileNav" aria-label="Close navigation">
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Contenu du menu (partagé desktop/mobile) -->
      <nav
        :class="[
          'lg:space-y-6',
          mobileNavOpen ? 'space-y-3' : 'space-y-6',
          'lg:p-0',
          mobileNavOpen ? 'p-6 pt-0' : 'p-6',
        ]">
        <template
          v-for="(navSection, index) in navSections"
          :key="navSection.title">
          <div class="border-t border-gray-300" v-if="index > 0"></div>

          <div>
            <h3
              :class="[
                'text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2',
                mobileNavOpen ? 'mb-2' : 'mb-3',
              ]">
              <HtmlIcon
                v-if="navSection.icon === 'html'"
                :class="mobileNavOpen ? 'w-4 h-4' : 'w-6 h-6'" />
              <CssIcon
                v-else-if="navSection.icon === 'css'"
                :class="mobileNavOpen ? 'w-4 h-4' : 'w-6 h-6'" />
              {{ navSection.title }}
            </h3>
            <ul :class="mobileNavOpen ? 'space-y-1' : 'space-y-2'">
              <NavLink
                v-for="link in navSection.links"
                v-show="!link.condition || link.condition()"
                :key="link.section"
                :section="link.section"
                :label="link.label"
                :variant="navSection.variant"
                v-bind="navLinkProps"
                @navigate="handleNavigate" />
            </ul>
          </div>
        </template>
      </nav>
    </aside>

    <!-- Contenu principal avec marge pour la navigation -->
    <main class="flex-1 lg:ml-52 p-4 lg:p-12 max-w-[1920px] relative">
      <!-- Bouton retour en haut -->
      <button
        v-if="showScrollTop"
        @click="scrollToTop"
        class="fixed bottom-8 right-8 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition-all duration-300 z-10"
        aria-label="Retour en haut">
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>

      <div v-if="projectData">
        <div v-if="loading" class="text-center">Chargement...</div>

        <div v-else class="grid gap-8 grid-cols-12 items-start">
          <div
            class="col-span-12 flex flex-col gap-2 lg:flex-row lg:items-end lg:gap-8">
            <h1 class="text-3xl font-bold lg:text-5xl">
              {{ projectData.pages[0].title }}
            </h1>
            <h2 class="text-xl">
              Projet réalisé par {{ selectedProject.value }}
            </h2>
          </div>

          <Block
            id="html"
            class="col-span-12 lg:col-span-6 xl:col-span-4 scroll-mt-28 self-stretch"
            variant="html">
            <div class="bg-white rounded-lg p-4 flex gap-8 items-center mb-8">
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

          <BlockScores
            id="scores"
            :projectData="projectData"
            class="col-span-12 lg:col-span-6 xl:col-span-8 scroll-mt-28" />

          <BlockFilesHtml
            id="files"
            :files="projectData.pages"
            class="col-span-12 scroll-mt-28" />

          <BlockTags
            id="tags"
            :projectData="projectData"
            class="col-span-12 xl:col-span-6 2xl:col-span-4 scroll-mt-28" />

          <BlockStructure
            id="structure"
            :projectData="projectData"
            class="col-span-12 xl:col-span-6 2xl:col-span-4 scroll-mt-28" />

          <BlockImages
            id="images"
            :projectData="projectData"
            class="col-span-12 2xl:col-span-4 scroll-mt-28" />

          <Block
            id="css"
            class="col-span-12 lg:col-span-6 xl:col-span-4 scroll-mt-28 self-stretch"
            variant="css">
            <div class="bg-white rounded-lg p-4 flex gap-8 items-center mb-8">
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

          <BlockScoresCss
            id="css-scores"
            :projectData="projectData"
            :customProperties="projectData.cssAnalysisResult.customProperties"
            :imports="projectData.cssAnalysisResult.imports"
            :classAnalysis="projectData.classAnalysis"
            class="col-span-12 lg:col-span-6 xl:col-span-8 scroll-mt-28" />

          <BlockCssStats
            id="css-stats"
            :cssAnalysisResult="projectData.cssAnalysisResult"
            class="col-span-12 scroll-mt-28" />

          <BlockCssVariables
            id="css-variables"
            :projectData="projectData.cssAnalysisResult.customProperties"
            class="col-span-12 scroll-mt-28" />

          <BlockCssColor
            id="css-colors"
            :projectData="projectData.cssAnalysisResult.values.colors"
            class="col-span-12 scroll-mt-28" />

          <BlockTypography
            id="typography"
            :typography="projectData.cssAnalysisResult.typography"
            class="col-span-12 scroll-mt-28" />

          <BlockCssOrganization
            id="css-organization"
            :imports="projectData.cssAnalysisResult.imports"
            class="col-span-12 scroll-mt-28" />

          <BlockClasses
            v-if="projectData.classAnalysis"
            id="classes"
            :classAnalysis="projectData.classAnalysis"
            class="col-span-12 scroll-mt-28" />

          <BlockCssSelectors
            id="css-selectors"
            :selectors="projectData.cssAnalysisResult.selectors"
            class="col-span-12 scroll-mt-28" />

          <BlockCssProperties
            id="css-properties"
            :properties="projectData.cssAnalysisResult.properties"
            class="col-span-12 scroll-mt-28" />

          <BlockCssRules
            id="css-rules"
            :rules="projectData.cssAnalysisResult.rules"
            class="col-span-12 lg:col-span-7 scroll-mt-28" />

          <BlockCssUnit
            id="css-units"
            :units="projectData.cssAnalysisResult.values.units"
            class="col-span-12 lg:col-span-5 scroll-mt-28" />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from "vue";
import Block from "./Block.vue";
import HtmlIcon from "../icons/Html.vue";
import CssIcon from "../icons/Css.vue";
import CustomSelect from "./CustomSelect.vue";
import NavLink from "./NavLink.vue";
import BlockCssColor from "./Blocks/BlockCssColor.vue";
import BlockImages from "./Blocks/BlockImages.vue";
import BlockScores from "./Blocks/BlockScoresHtml.vue";
import BlockTags from "./Blocks/BlockTags.vue";
import BlockFilesHtml from "./Blocks/BlockFilesHtml.vue";
import BlockStructure from "./Blocks/BlockStructure.vue";
import BlockCssStats from "./Blocks/BlockCssStats.vue";
import BlockCssVariables from "./Blocks/BlockCssVariables.vue";
import BlockCssUnit from "./Blocks/BlockCssUnit.vue";
import BlockCssSelectors from "./Blocks/BlockCssSelectors.vue";
import BlockCssRules from "./Blocks/BlockCssRules.vue";
import BlockCssProperties from "./Blocks/BlockCssProperties.vue";
import BlockTypography from "./Blocks/BlockTypography.vue";
import BlockScoresCss from "./Blocks/BlockScoresCss.vue";
import BlockCssOrganization from "./Blocks/BlockCssOrganization.vue";
import BlockClasses from "./Blocks/BlockClasses.vue";

// Récupère l'URL de base depuis les variables d'environnement
// En production sur Render, on utilise toujours l'URL de production
const API_BASE_URL = import.meta.env.PROD
  ? "https://project-analysis-backend.onrender.com"
  : import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

console.log("API_BASE_URL:", API_BASE_URL);
console.log("Environment MODE:", import.meta.env.MODE);
console.log("Environment PROD:", import.meta.env.PROD);
console.log("Environment DEV:", import.meta.env.DEV);

const projects = ref([]);
const selectedProject = ref(null);
const projectData = ref(null);
const fonts = ref([]);
const loading = ref(false);
const activeSection = ref(null);
const mobileNavOpen = ref(false);
const showScrollTop = ref(false);

// Prépare les options pour CustomSelect
const projectsOptions = computed(() =>
  projects.value.map((project) => ({ value: project, label: project }))
);

// Structure de navigation
const navSections = [
  {
    title: "HTML",
    variant: "html",
    icon: "html",
    links: [
      { section: "html", label: "Introduction" },
      { section: "scores", label: "Scores" },
      { section: "files", label: "Fichiers" },
      { section: "tags", label: "Balises" },
      { section: "structure", label: "Structure" },
      { section: "images", label: "Images" },
    ],
  },
  {
    title: "CSS",
    variant: "css",
    icon: "css",
    links: [
      { section: "css", label: "Introduction" },
      { section: "css-scores", label: "Scores" },
      { section: "css-stats", label: "Métriques" },
      { section: "css-variables", label: "Variables" },
      { section: "css-colors", label: "Couleurs" },
      { section: "typography", label: "Typographie" },
      { section: "css-organization", label: "Organisation" },
      { section: "classes", label: "Classes" },
      { section: "css-selectors", label: "Sélecteurs" },
      { section: "css-properties", label: "Propriétés" },
      { section: "css-rules", label: "Règles" },
      { section: "css-units", label: "Unités" },
    ],
  },
];

// Props communes pour NavLink
const navLinkProps = computed(() => ({
  activeSection: activeSection.value,
  mobile: mobileNavOpen.value,
}));

const handleNavigate = computed(() =>
  mobileNavOpen.value ? handleMobileNavClick : setActiveSection
);

// Gestion de la navigation mobile
const toggleMobileNav = () => {
  mobileNavOpen.value = !mobileNavOpen.value;
};

const handleMobileNavClick = (section) => {
  setActiveSection(section);
  toggleMobileNav();
};

// Définit la section active
const setActiveSection = (section) => {
  activeSection.value = section;
};

// Gestion du scroll pour le bouton retour en haut
const handleScroll = () => {
  showScrollTop.value = window.scrollY > 500;

  // Détection de la section visible
  const sections = [
    "html",
    "scores",
    "files",
    "tags",
    "structure",
    "images",
    "css",
    "css-stats",
    "css-colors",
    "css-variables",
    "typography",
    "css-selectors",
    "css-rules",
    "css-properties",
    "css-units",
    "classes",
  ];

  for (const section of sections) {
    const element = document.getElementById(section);
    if (element) {
      const rect = element.getBoundingClientRect();
      if (rect.top <= 150 && rect.bottom >= 150) {
        activeSection.value = section;
        break;
      }
    }
  }
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

// Récupère les projets depuis l'API
const fetchProjects = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/scan/projects`);
    projects.value = await response.json();

    if (projects.value.length > 0) {
      selectedProject.value = {
        value: projects.value[0],
        label: projects.value[0],
      };
      fetchProjectData();
    }
  } catch (error) {
    console.error("Erreur lors du chargement des projets :", error);
  }
};

const fetchProjectData = async () => {
  if (!selectedProject.value) return;
  const response = await fetch(
    `${API_BASE_URL}/scan/project/${selectedProject.value.value}`
  );
  projectData.value = await response.json();
  extractFontsFromImport();
};

onMounted(() => {
  fetchProjects();
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

// Fonction pour extraire les polices depuis @import et les charger dynamiquement
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
</script>

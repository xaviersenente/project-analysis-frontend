<template>
  <Block
    title="Variables CSS"
    desc="Panorama des métriques CSS : lignes, règles, sélecteurs, déclarations, variables personnalisées et usage des identifiants."
    class="col-span-12 lg:col-span-6 xl:col-span-8">
    <div class="grid grid-cols-3 gap-8">
      <Section
        title="Total"
        subtitle="(Déclarées / Utilisées)"
        :value="projectData.cssAnalysisResult.customProperties.totalDeclared"
        :additionalValue="
          projectData.cssAnalysisResult.customProperties.totalUsed
        ">
        <div class="text-xs uppercase text-gray-400">Écart</div>
        <span :class="getGapClass(gapSelector)">{{ gapSelector }}%</span>
      </Section>

      <Section
        title="Non déclarées"
        :value="
          projectData.cssAnalysisResult.customProperties.totalUndeclared
        " />
    </div>

    <!-- Liste des variables par catégorie -->
    <div class="mt-8 space-y-6">
      <div
        v-for="(category, categoryName) in filteredCategories"
        :key="categoryName"
        class="border-t border-gray-200 pt-4">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-semibold text-gray-700 uppercase">
            {{ getCategoryLabel(categoryName) }}
          </h3>
          <span class="text-xs text-gray-500">
            {{ category.length }} variable{{ category.length > 1 ? "s" : "" }}
          </span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          <div
            v-for="variable in category"
            :key="variable.name"
            class="flex items-center justify-between bg-gray-50 rounded px-3 py-2">
            <div class="flex-1 min-w-0">
              <div
                class="font-mono text-xs text-gray-700 truncate"
                :title="variable.name">
                {{ variable.name }}
              </div>
              <div
                class="text-xs text-gray-500 truncate"
                :title="variable.value">
                {{ variable.value }}
              </div>
            </div>
            <span
              class="ml-2 px-2 py-0.5 bg-gray-200 text-gray-600 rounded-full text-xs font-semibold flex-shrink-0"
              :class="getUsageClass(variable.usageCount)">
              {{ variable.usageCount }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </Block>
</template>

<script setup>
import { computed } from "vue";
import { gap } from "../../js/helpers";
import Block from "../Block.vue";
import Section from "../Section.vue";

const props = defineProps({
  projectData: Object,
});

const gapSelector = computed(() =>
  gap(
    props.projectData.cssAnalysisResult.customProperties.totalDeclared,
    props.projectData.cssAnalysisResult.customProperties.totalUsed
  )
);

// Fonction pour déterminer la classe en fonction de la valeur d'écart
const getGapClass = (gapValue) => {
  if (gapValue <= 10) return "text-green-600";
  if (gapValue <= 25) return "text-yellow-500";
  if (gapValue <= 40) return "text-orange-500";
  return "text-red-500";
};

// Récupération des catégories détaillées
const detailedCategorization = computed(() => {
  return (
    props.projectData.cssAnalysisResult.customProperties
      ?.detailedCategorization || {}
  );
});

// Filtrer les catégories non vides
const filteredCategories = computed(() => {
  const categories = {};
  Object.entries(detailedCategorization.value).forEach(([key, value]) => {
    if (Array.isArray(value) && value.length > 0) {
      categories[key] = value;
    }
  });
  return categories;
});

// Labels des catégories en français
const getCategoryLabel = (categoryName) => {
  const labels = {
    color: "Couleurs",
    typography: "Typographie",
    spacing: "Espacements",
    layout: "Layout",
    zIndex: "Z-Index",
    radius: "Rayons",
    other: "Autres",
  };
  return labels[categoryName] || categoryName;
};

// Classe conditionnelle selon le nombre d'utilisations
const getUsageClass = (count) => {
  if (count === 0) return "bg-red-100 text-red-700";
  if (count <= 3) return "bg-yellow-100 text-yellow-700";
  return "bg-green-100 text-green-700";
};
</script>

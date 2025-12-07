<template>
  <Block
    title="Organisation CSS"
    desc="Architecture des fichiers CSS, imports.">
    <template v-slot:header>
      <div class="flex gap-8">
        <div>
          <div class="text-xs uppercase">Fichiers</div>
          <div class="text-xl font-bold">{{ importsData.total }}</div>
        </div>
        <div>
          <div class="text-xs uppercase">Classes</div>
          <div class="text-xl font-bold">{{ organization.totalClasses }}</div>
        </div>
        <div>
          <div class="text-xs uppercase">Taille totale</div>
          <div class="text-xl font-bold">{{ formatSize(totalSize) }}</div>
        </div>
      </div>
    </template>

    <!-- Métriques par catégorie -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
      <Section
        v-for="(count, category) in organization.categories"
        rightText="Poids"
        :key="category"
        :title="getCategoryLabel(category)"
        :value="count"
        :titleClass="getCategoryColor(category)"
        :rightValue="formatSize(getCategorySize(category))">
      </Section>
    </div>

    <!-- Détails des fichiers -->
    <DistributionDetails
      class="mt-6 text-sm"
      summary="Voir les détails des fichiers importés">
      <div class="overflow-x-auto">
        <table class="min-w-full table-auto text-xs">
          <thead>
            <tr class="border-b border-gray-200">
              <th class="text-left py-2 px-3 font-semibold">Fichier</th>
              <th class="text-left py-2 px-3 font-semibold">Catégorie</th>
              <th class="text-right py-2 px-3 font-semibold">Classes</th>
              <th class="text-right py-2 px-3 font-semibold">Taille</th>
              <th class="text-center py-2 px-3 font-semibold">Statut</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(file, index) in sortedFiles"
              :key="index"
              class="border-b border-gray-100 hover:bg-gray-50">
              <td class="py-2 px-3 max-w-32 truncate">
                <code class="text-xs bg-gray-100 px-1 rounded max-w-32">{{
                  file.path
                }}</code>
              </td>
              <td class="py-2 px-3">
                <span
                  class="inline-block px-2 py-0.5 rounded text-xs font-medium"
                  :class="getCategoryBadgeClass(file.category)">
                  {{ file.category }}
                </span>
              </td>
              <td class="py-2 px-3 text-right font-mono">
                {{ file.classCount }}
              </td>
              <td class="py-2 px-3 text-right font-mono">
                {{ file.fileSize ? formatSize(file.fileSize) : "-" }}
              </td>
              <td class="py-2 px-3 text-center">
                <span
                  v-if="file.isValid"
                  class="inline-flex items-center justify-center w-5 h-5 text-green-600">
                  ✓
                </span>
                <span
                  v-else
                  class="inline-flex items-center justify-center w-5 h-5 text-red-600">
                  ✗
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </DistributionDetails>

    <!-- Recommandations -->
    <Infos
      v-if="scoreBreakdown || scoreImprovements.length > 0"
      :twoColumns="true">
      <template #summary>
        <ul class="list-disc list-inside">
          <li v-for="(item, key) in scoreBreakdown" :key="key">
            {{ item.details }}
          </li>
        </ul>
      </template>

      <template v-if="scoreImprovements.lenght > 0" #recommendations>
        <ul class="list-disc list-inside">
          <li v-for="(improvement, idx) in scoreImprovements" :key="idx">
            {{ improvement }}
          </li>
        </ul>
      </template>
    </Infos>
  </Block>
</template>

<script setup>
import { computed } from "vue";
import Block from "../Block.vue";
import Section from "../Section.vue";
import DistributionDetails from "../DistributionDetails.vue";
import Infos from "../Infos.vue";
import { formatSize } from "../../js/helpers.js";

const props = defineProps({
  imports: {
    type: Object,
    required: true,
  },
});

// Données des imports
const importsData = computed(() => props.imports);

const organization = computed(() => importsData.value.organization);

// Taille totale de tous les fichiers CSS
const totalSize = computed(() => {
  return importsData.value.imports.reduce(
    (sum, file) => sum + (file.fileSize || 0),
    0
  );
});

// Taille par catégorie
const getCategorySize = (category) => {
  return importsData.value.imports
    .filter((file) => file.category === category)
    .reduce((sum, file) => sum + (file.fileSize || 0), 0);
};

// Fichiers triés par catégorie puis par nombre de classes
const sortedFiles = computed(() => {
  return [...importsData.value.imports].sort((a, b) => {
    // Tri par catégorie d'abord
    const categoryOrder = {
      fonts: 1,
      vendor: 2,
      utils: 3,
      base: 4,
      layout: 5,
      custom: 6,
    };
    const catDiff =
      (categoryOrder[a.category] || 99) - (categoryOrder[b.category] || 99);
    if (catDiff !== 0) return catDiff;

    // Puis par nombre de classes (décroissant)
    return b.classCount - a.classCount;
  });
});

// Helpers pour les labels et couleurs
const getCategoryLabel = (category) => {
  const labels = {
    fonts: "Fonts",
    vendor: "Vendor",
    utils: "Utils",
    base: "Base",
    layout: "Layout",
    custom: "Custom",
  };
  return labels[category] || category;
};

const getCategoryColor = (category) => {
  const colors = {
    fonts: "text-purple-600",
    vendor: "text-gray-600",
    utils: "text-blue-600",
    base: "text-green-600",
    layout: "text-orange-600",
    custom: "text-pink-600",
  };
  return colors[category] || "text-gray-600";
};

const getCategoryBadgeClass = (category) => {
  const classes = {
    fonts: "bg-purple-100 text-purple-700",
    vendor: "bg-gray-100 text-gray-700",
    utils: "bg-blue-100 text-blue-700",
    base: "bg-green-100 text-green-700",
    layout: "bg-orange-100 text-orange-700",
    custom: "bg-pink-100 text-pink-700",
  };
  return classes[category] || "bg-gray-100 text-gray-700";
};

const getPercent = (value, total) => {
  return total > 0 ? Math.round((value / total) * 100) : 0;
};

// Score
const scoreBreakdown = computed(() => importsData.value.score?.breakdown || {});
const scoreImprovements = computed(
  () => importsData.value.score?.improvements || []
);

const formatScoreName = (key) => {
  const names = {
    validity: "Validité",
    organization: "Organisation",
    performance: "Performance",
    naming: "Nommage",
    bestPractices: "Bonnes pratiques",
  };
  return names[key] || key;
};

// Exposer le score pour utilisation externe
defineExpose({
  organizationScore,
});
</script>

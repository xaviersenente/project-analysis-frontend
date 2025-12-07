<template>
  <Block
    title="Sélecteurs"
    desc="Répartition des sélecteurs par niveau de spécificité.">
    <template v-slot:header>
      <div class="flex gap-8">
        <div>
          <div class="text-xs uppercase">Total</div>
          <div class="text-xl font-bold">{{ selectors.total }}</div>
        </div>
        <div>
          <div class="text-xs uppercase">Unique</div>
          <div class="text-xl font-bold">{{ selectors.totalUnique }}</div>
        </div>
      </div>
    </template>
    <div class="space-y-6">
      <div class="grid grid-cols-2 gap-8 md:grid-cols-4">
        <Section
          v-for="range in SPECIFICITY_RANGES"
          suffix="%"
          :key="range.key"
          :title="range.label"
          :titleClass="getTitleClass(range.key)"
          :value="specificityStats[range.key]" />
      </div>

      <DistributionDetails
        class="text-sm"
        summary="Voir la distribution complète">
        <div class="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div v-for="range in SPECIFICITY_RANGES" :key="range.key">
            <h5
              class="text-xs font-semibold mb-2 uppercase tracking-wide"
              :class="`text-${getColorClass(range.key)}`">
              {{ range.label }}
            </h5>
            <div class="space-y-1.5">
              <PropertyBar
                v-for="(item, index) in getCategoryList(range.key)"
                :key="index"
                :label="item.selector"
                :count="item.count"
                :maxCount="maxSelectorCount"
                :percent="item.percent"
                :barColor="range.color" />
            </div>
          </div>
        </div>
      </DistributionDetails>

      <Infos
        v-if="isSpecificityAboveThreshold || hasIdOrHigherSpecificity"
        class="flex flex-col gap-2">
        <p v-if="isSpecificityAboveThreshold">
          Le faible nombre de spécificité <code>0,0,1</code> indique que vous
          n'avez pas déclaré suffisamment de styles généraux (<code>body</code>,
          <code>h1</code>, <code>h2</code>, <code>p</code>, <code>a</code> …)
        </p>
        <p v-if="hasIdOrHigherSpecificity">
          Le niveau de spécificité critique indique que vous avez utilisé des ID
          dans vos css, ce qui est déconseillé.
        </p>
      </Infos>
    </div>
  </Block>
</template>

<script setup>
import Block from "../Block.vue";
import DistributionDetails from "../DistributionDetails.vue";
import PropertyBar from "../PropertyBar.vue";
import Section from "../Section.vue";
import Infos from "../Infos.vue";
import { computed } from "vue";

// Props attendues depuis le parent
const props = defineProps({
  selectors: Object,
});

// Données de base
const selectors = computed(() => props.selectors || {});

const specificityData = computed(() => selectors.value?.specificity || {});

const total = computed(() => specificityData.value.total || 0);

// Catégories de spécificité
const SPECIFICITY_RANGES = [
  { key: "low", min: 0, max: 10, label: "Basse (0-10)", color: "bg-green-500" },
  {
    key: "medium",
    min: 11,
    max: 30,
    label: "Moyenne (11-30)",
    color: "bg-blue-500",
  },
  {
    key: "high",
    min: 31,
    max: 60,
    label: "Haute (31-60)",
    color: "bg-orange-500",
  },
  {
    key: "critical",
    min: 61,
    max: Infinity,
    label: "Critique (>60)",
    color: "bg-red-500",
  },
];

// Fonctions utilitaires
const calculateSpecificitySum = (key) => {
  const [id, classes, elements] = key.split(",").map(Number);
  return (id ?? 0) * 100 + (classes ?? 0) * 10 + (elements ?? 0);
};

const countInRange = (min, max) => {
  try {
    let count = 0;
    Object.entries(specificityData.value.unique || {}).forEach(([key, val]) => {
      const sum = calculateSpecificitySum(key);
      if (sum >= min && sum <= max) count += val;
    });
    return total.value > 0 ? Math.round((count / total.value) * 100) : 0;
  } catch (e) {
    console.error("Erreur countInRange:", e);
    return 0;
  }
};

// Trier et catégoriser les sélecteurs par spécificité
const sortedSelectors = computed(() => {
  try {
    const unique = specificityData.value.unique || {};
    return Object.entries(unique)
      .map(([selector, count]) => ({
        selector,
        count,
        sum: calculateSpecificitySum(selector),
        percent: total.value > 0 ? Math.round((count / total.value) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);
  } catch (e) {
    console.error("Erreur sortedSelectors:", e);
    return [];
  }
});

// Calcul des pourcentages par catégorie
const specificityStats = computed(() => {
  const stats = {};
  SPECIFICITY_RANGES.forEach((range) => {
    stats[range.key] = countInRange(range.min, range.max);
  });
  return stats;
});

const lowSpecificity = computed(() => specificityStats.value.low);
const mediumSpecificity = computed(() => specificityStats.value.medium);
const highSpecificity = computed(() => specificityStats.value.high);
const criticalSpecificity = computed(() => specificityStats.value.critical);

// Filtrer les sélecteurs par catégorie
const getListByCategory = (min, max) =>
  sortedSelectors.value.filter((s) => s.sum >= min && s.sum <= max);

const lowSpecificityList = computed(() =>
  getListByCategory(SPECIFICITY_RANGES[0].min, SPECIFICITY_RANGES[0].max)
);

const mediumSpecificityList = computed(() =>
  getListByCategory(SPECIFICITY_RANGES[1].min, SPECIFICITY_RANGES[1].max)
);

const highSpecificityList = computed(() =>
  getListByCategory(SPECIFICITY_RANGES[2].min, SPECIFICITY_RANGES[2].max)
);

const criticalSpecificityList = computed(() =>
  getListByCategory(SPECIFICITY_RANGES[3].min, SPECIFICITY_RANGES[3].max)
);

// Valeur maximale pour normaliser les barres
const maxSelectorCount = computed(() => {
  if (sortedSelectors.value.length === 0) return 1;
  return Math.max(...sortedSelectors.value.map((s) => s.count));
});

// Validations et avertissements
const isSpecificityAboveThreshold = computed(() => {
  const specificity = specificityData.value.unique || {};
  return (specificity["0,0,1"] ?? 0) < 5;
});

const hasIdOrHigherSpecificity = computed(() => {
  return Object.keys(specificityData.value.unique || {}).some((key) => {
    const [idPart] = key.split(",").map(Number);
    return (idPart ?? 0) >= 1;
  });
});

// Fonctions helper pour le template
const getTitleClass = (key) => {
  const colorMap = {
    low: "text-green-600",
    medium: "text-blue-500",
    high: "text-orange-500",
    critical: "text-red-500",
  };
  return colorMap[key] || "";
};

const getColorClass = (key) => {
  const colorMap = {
    low: "green-600",
    medium: "blue-600",
    high: "orange-600",
    critical: "red-600",
  };
  return colorMap[key] || "";
};

const getCategoryList = (key) => {
  const lists = {
    low: lowSpecificityList.value,
    medium: mediumSpecificityList.value,
    high: highSpecificityList.value,
    critical: criticalSpecificityList.value,
  };
  return lists[key] || [];
};
</script>

<template>
  <Block
    title="Propriétés"
    desc="Fréquences d'utilisation des propriétés CSS par catégorie."
    class="col-span-12 lg:col-span-8">
    <template v-slot:header>
      <div class="flex gap-4">
        <div>
          <div class="text-xs uppercase">Total</div>
          <div class="text-xl font-bold">
            {{ props.projectData.cssAnalysisResult.properties.total }}
          </div>
        </div>
        <div>
          <div class="text-xs uppercase">Unique</div>
          <div class="text-xl font-bold">
            {{ props.projectData.cssAnalysisResult.properties.totalUnique }}
          </div>
        </div>
      </div>
    </template>
    <div class="space-y-6">
      <div class="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <Section
          title="Layout"
          size="sm"
          textClass="text-blue-500"
          :value="layoutCount" />
        <Section
          title="Visuel"
          size="sm"
          textClass="text-purple-600"
          :value="visualCount" />
        <Section
          title="Typo"
          size="sm"
          textClass="text-pink-600"
          :value="typoCount" />
        <Section
          title="Autre"
          size="sm"
          textClass="text-gray-600"
          :value="otherCount" />
      </div>

      <DistributionDetails
        class="text-sm"
        summary="Voir la distribution complète">
        <div class="grid grid-cols-2 gap-4 xl:grid-cols-4">
          <!-- Layout -->
          <div>
            <h5
              class="text-xs font-semibold text-blue-600 mb-2 uppercase tracking-wide">
              Layout
            </h5>
            <div class="space-y-2">
              <PropertyBar
                v-for="(item, index) in layoutProperties"
                :key="index"
                :label="item.prop"
                :count="item.count"
                :maxCount="maxPropertyCount"
                :percent="item.percent"
                :barColor="getBarColor(item.prop)" />
            </div>
          </div>
          <!-- Visual -->
          <div>
            <h5
              class="text-xs font-semibold text-purple-600 mb-2 uppercase tracking-wide">
              Visuel
            </h5>
            <div class="space-y-2">
              <PropertyBar
                v-for="(item, index) in visualProperties"
                :key="index"
                :label="item.prop"
                :count="item.count"
                :maxCount="maxPropertyCount"
                :percent="item.percent"
                :barColor="getBarColor(item.prop)" />
            </div>
          </div>
          <!-- Typo -->
          <div>
            <h5
              class="text-xs font-semibold text-pink-600 mb-2 uppercase tracking-wide">
              Typographie
            </h5>
            <div class="space-y-2">
              <PropertyBar
                v-for="(item, index) in typoProperties"
                :key="index"
                :label="item.prop"
                :count="item.count"
                :maxCount="maxPropertyCount"
                :percent="item.percent"
                :barColor="getBarColor(item.prop)" />
            </div>
          </div>
          <!-- Other -->
          <div>
            <h5
              class="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
              Autre
            </h5>
            <div class="space-y-2">
              <PropertyBar
                v-for="(item, index) in otherProperties"
                :key="index"
                :label="item.prop"
                :count="item.count"
                :maxCount="maxPropertyCount"
                :percent="item.percent"
                :barColor="getBarColor(item.prop)" />
            </div>
          </div>
        </div>
      </DistributionDetails>
    </div>
  </Block>
</template>

<script setup>
import { computed } from "vue";
import Block from "../Block.vue";
import Section from "../Section.vue";
import DistributionDetails from "../DistributionDetails.vue";
import PropertyBar from "../PropertyBar.vue";

const props = defineProps({
  projectData: Object,
});

const layoutProps = [
  "display",
  "flex",
  "flex-direction",
  "flex-wrap",
  "justify-content",
  "align-items",
  "align-content",
  "grid",
  "grid-template",
  "grid-column",
  "grid-row",
  "gap",
  "position",
  "top",
  "right",
  "bottom",
  "left",
  "width",
  "height",
  "margin",
  "padding",
  "float",
  "clear",
];

const visualProps = [
  "background",
  "background-color",
  "background-image",
  "border",
  "border-radius",
  "box-shadow",
  "opacity",
  "transform",
  "transition",
  "animation",
  "filter",
  "color",
];

const typoProps = [
  "font",
  "font-family",
  "font-size",
  "font-weight",
  "font-style",
  "line-height",
  "letter-spacing",
  "text-align",
  "text-decoration",
  "text-transform",
  "white-space",
];

const propertiesData = computed(
  () => props.projectData.cssAnalysisResult.properties
);

const total = computed(() => propertiesData.value.total);

const getCategory = (prop) => {
  if (layoutProps.some((p) => prop.startsWith(p))) return "layout";
  if (visualProps.some((p) => prop.startsWith(p))) return "visual";
  if (typoProps.some((p) => prop.startsWith(p))) return "typo";
  return "other";
};

const layoutCount = computed(() => {
  let count = 0;
  Object.entries(propertiesData.value.unique).forEach(([prop, val]) => {
    if (getCategory(prop) === "layout") count += val;
  });
  return count;
});

const visualCount = computed(() => {
  let count = 0;
  Object.entries(propertiesData.value.unique).forEach(([prop, val]) => {
    if (getCategory(prop) === "visual") count += val;
  });
  return count;
});

const typoCount = computed(() => {
  let count = 0;
  Object.entries(propertiesData.value.unique).forEach(([prop, val]) => {
    if (getCategory(prop) === "typo") count += val;
  });
  return count;
});

const otherCount = computed(() => {
  return total.value - layoutCount.value - visualCount.value - typoCount.value;
});

const topProperties = computed(() => {
  const props = Object.entries(propertiesData.value.unique)
    .map(([prop, count]) => ({
      prop,
      count,
      percent: total.value > 0 ? Math.round((count / total.value) * 100) : 0,
      category: getCategory(prop), // Ajouter la catégorie pour le tri
    }))
    .sort((a, b) => {
      // Tri par catégorie d'abord, puis par count décroissant
      const categoryOrder = { layout: 0, visual: 1, typo: 2, other: 3 };
      if (categoryOrder[a.category] !== categoryOrder[b.category]) {
        return categoryOrder[a.category] - categoryOrder[b.category];
      }
      return b.count - a.count;
    })
    .slice(0, 60);
  return props;
});

// Filtrer par catégorie
const layoutProperties = computed(() =>
  topProperties.value.filter((p) => p.category === "layout").slice(0, 15)
);

const visualProperties = computed(() =>
  topProperties.value.filter((p) => p.category === "visual").slice(0, 15)
);

const typoProperties = computed(() =>
  topProperties.value.filter((p) => p.category === "typo").slice(0, 15)
);

const otherProperties = computed(() =>
  topProperties.value.filter((p) => p.category === "other").slice(0, 15)
);

// Valeur maximale pour normaliser les barres
const maxPropertyCount = computed(() => {
  if (topProperties.value.length === 0) return 1;
  return Math.max(...topProperties.value.map((p) => p.count));
});

const getBarColor = (prop) => {
  const category = getCategory(prop);
  if (category === "layout") return "bg-blue-500";
  if (category === "visual") return "bg-purple-500";
  if (category === "typo") return "bg-pink-500";
  return "bg-gray-500";
};
</script>

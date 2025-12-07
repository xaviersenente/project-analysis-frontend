<template>
  <Block
    title="Propriétés"
    desc="Fréquences d'utilisation des propriétés CSS par catégorie.">
    <template v-slot:header>
      <div class="flex gap-8">
        <div>
          <div class="text-xs uppercase">Total</div>
          <div class="text-xl font-bold">{{ properties.total }}</div>
        </div>
        <div>
          <div class="text-xs uppercase">Unique</div>
          <div class="text-xl font-bold">{{ properties.totalUnique }}</div>
        </div>
      </div>
    </template>
    <div class="space-y-6">
      <div class="grid grid-cols-2 gap-8 xl:grid-cols-4">
        <Section
          v-for="category in CATEGORIES"
          :key="category.key"
          :title="category.label"
          :titleClass="category.titleClass"
          :value="categoryCounts[category.key]" />
      </div>

      <DistributionDetails
        class="text-sm"
        summary="Voir la distribution complète">
        <div class="grid grid-cols-2 gap-8 xl:grid-cols-4">
          <div v-for="category in CATEGORIES" :key="category.key">
            <h5
              class="text-xs font-semibold mb-2 uppercase tracking-wide"
              :class="category.headerClass">
              {{ category.label }}
            </h5>
            <div class="space-y-2">
              <PropertyBar
                v-for="(item, index) in getCategoryProperties(category.key)"
                :key="index"
                :label="item.prop"
                :count="item.count"
                :maxCount="maxPropertyCount"
                :percent="item.percent"
                :barColor="category.barColor" />
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
  properties: Object,
});

// Catégories de propriétés
const CATEGORIES = [
  {
    key: "layout",
    label: "Layout",
    titleClass: "text-blue-500",
    headerClass: "text-blue-600",
    barColor: "bg-blue-500",
    props: [
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
    ],
  },
  {
    key: "visual",
    label: "Visuel",
    titleClass: "text-purple-600",
    headerClass: "text-purple-600",
    barColor: "bg-purple-500",
    props: [
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
    ],
  },
  {
    key: "typo",
    label: "Typographie",
    titleClass: "text-pink-600",
    headerClass: "text-pink-600",
    barColor: "bg-pink-500",
    props: [
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
    ],
  },
  {
    key: "other",
    label: "Autre",
    titleClass: "text-gray-600",
    headerClass: "text-gray-600",
    barColor: "bg-gray-500",
    props: [],
  },
];

const properties = computed(() => props.properties || {});
const total = computed(() => properties.value.total || 0);

// Déterminer la catégorie d'une propriété
const getCategory = (prop) => {
  return (
    CATEGORIES.find((cat) => cat.props.some((p) => prop.startsWith(p)))?.key ||
    "other"
  );
};

// Transformer et trier les propriétés par catégorie
const sortedProperties = computed(() => {
  try {
    const unique = properties.value.unique || {};
    return Object.entries(unique)
      .map(([prop, count]) => ({
        prop,
        count,
        percent: total.value > 0 ? Math.round((count / total.value) * 100) : 0,
        category: getCategory(prop),
      }))
      .sort((a, b) => {
        const categoryOrder = { layout: 0, visual: 1, typo: 2, other: 3 };
        if (categoryOrder[a.category] !== categoryOrder[b.category]) {
          return categoryOrder[a.category] - categoryOrder[b.category];
        }
        return b.count - a.count;
      });
  } catch (e) {
    console.error("Erreur sortedProperties:", e);
    return [];
  }
});

// Compter les propriétés par catégorie
const categoryCounts = computed(() => {
  const counts = {};
  CATEGORIES.forEach((cat) => {
    counts[cat.key] = sortedProperties.value
      .filter((p) => p.category === cat.key)
      .reduce((sum, p) => sum + p.count, 0);
  });
  return counts;
});

// Récupérer les propriétés d'une catégorie
const getCategoryProperties = (categoryKey) =>
  sortedProperties.value.filter((p) => p.category === categoryKey).slice(0, 15);

// Valeur maximale pour normaliser les barres
const maxPropertyCount = computed(() => {
  if (sortedProperties.value.length === 0) return 1;
  return Math.max(...sortedProperties.value.map((p) => p.count));
});
</script>

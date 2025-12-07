<template>
  <Block title="Unités" desc="Répartition entre unités relatives et absolues.">
    <template v-slot:header>
      <div class="flex gap-8">
        <div>
          <div class="text-xs uppercase">Total</div>
          <div class="text-xl font-bold">
            {{ units.total }}
          </div>
        </div>
        <div>
          <div class="text-xs uppercase">Unique</div>
          <div class="text-xl font-bold">
            {{ units.totalUnique }}
          </div>
        </div>
      </div>
    </template>

    <div class="space-y-6">
      <div class="grid grid-cols-2 gap-8">
        <Section
          v-for="category in UNIT_CATEGORIES"
          suffix="%"
          size="sm"
          :key="category.key"
          :title="category.label"
          :titleClass="category.titleClass"
          :value="unitStats[category.key]" />
      </div>

      <DistributionDetails
        v-if="sortedUnits.length > 0"
        class="text-sm"
        summary="Top 10 des unités utilisées">
        <div class="grid grid-cols-2 gap-8">
          <div v-for="category in UNIT_CATEGORIES" :key="category.key">
            <h5
              class="text-xs font-semibold mb-2 uppercase tracking-wide"
              :class="category.headerClass">
              {{ category.label }}
            </h5>
            <div class="space-y-1.5">
              <PropertyBar
                v-for="(item, index) in getCategoryUnits(category.key)"
                :key="index"
                :label="item.unit"
                :count="item.count"
                :maxCount="maxUnitCount"
                :percent="item.percent"
                :barColor="category.barColor" />
            </div>
          </div>
        </div>
      </DistributionDetails>

      <Infos v-if="units.unique?.rem < 3">
        <p>
          Il semble que ayez peu voir pas utilisé l'unité <code>rem</code>,
          notamment pour définir les tailles de texte.
        </p>
      </Infos>
    </div>
  </Block>
</template>

<script setup>
import Block from "../Block.vue";
import Infos from "../Infos.vue";
import Section from "../Section.vue";
import DistributionDetails from "../DistributionDetails.vue";
import PropertyBar from "../PropertyBar.vue";
import { computed } from "vue";

const props = defineProps({
  units: Object,
});

const RELATIVE_UNITS = [
  "rem",
  "em",
  "%",
  "vw",
  "vh",
  "vmin",
  "vmax",
  "svw",
  "lvw",
  "dvw",
  "svh",
  "lvh",
  "dvh",
  "ch",
  "ex",
  "fr",
];

const UNIT_CATEGORIES = [
  {
    key: "relative",
    label: "Relatives",
    titleClass: "text-green-600",
    headerClass: "text-green-600",
    barColor: "bg-green-500",
  },
  {
    key: "absolute",
    label: "Absolues",
    titleClass: "text-orange-600",
    headerClass: "text-orange-600",
    barColor: "bg-orange-500",
  },
];

const units = computed(() => props.units || {});
const total = computed(() => units.value?.total || 0);

// Données triées pour PropertyBar
const sortedUnits = computed(() => {
  try {
    const unique = units.value?.unique || {};
    return Object.entries(unique)
      .filter(([unit]) => unit !== "s")
      .map(([unit, count]) => ({
        unit,
        count,
        percent: total.value > 0 ? Math.round((count / total.value) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);
  } catch (e) {
    console.error("Erreur sortedUnits:", e);
    return [];
  }
});

// Calculer les pourcentages par catégorie
const unitStats = computed(() => {
  const stats = {};
  UNIT_CATEGORIES.forEach((cat) => {
    const count = sortedUnits.value
      .filter((u) => {
        const isRelative = RELATIVE_UNITS.includes(u.unit);
        return cat.key === "relative" ? isRelative : !isRelative;
      })
      .reduce((sum, u) => sum + u.count, 0);
    stats[cat.key] =
      total.value > 0 ? Math.round((count / total.value) * 100) : 0;
  });
  return stats;
});

// Récupérer les unités par catégorie
const getCategoryUnits = (categoryKey) => {
  const isRelative = categoryKey === "relative";
  return sortedUnits.value
    .filter((u) => RELATIVE_UNITS.includes(u.unit) === isRelative)
    .slice(0, 10);
};

// Alias pour la compatibilité
const relativeUnitsList = computed(() => getCategoryUnits("relative"));
const absoluteUnitsList = computed(() => getCategoryUnits("absolute"));
const relativePercent = computed(() => unitStats.value.relative);
const absolutePercent = computed(() => unitStats.value.absolute);

// Valeur maximale pour normaliser les barres
const maxUnitCount = computed(() => {
  if (sortedUnits.value.length === 0) return 1;
  return Math.max(...sortedUnits.value.map((u) => u.count));
});
</script>

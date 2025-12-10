<template>
  <Block
    title="Règles"
    desc="Répartition des règles CSS (nombre de déclarations par règle).">
    <template v-slot:header>
      <div class="flex gap-8">
        <div>
          <div class="text-xs uppercase">Total</div>
          <div class="text-xl font-bold">{{ rules.total }}</div>
        </div>
        <div>
          <div class="text-xs uppercase">Vide</div>
          <div class="text-xl font-bold">{{ rules.empty?.total }}</div>
        </div>
      </div>
    </template>
    <div class="space-y-6">
      <div class="grid grid-cols-3 gap-8">
        <Section
          v-for="category in RULE_CATEGORIES"
          suffix="%"
          size="sm"
          :key="category.key"
          :title="category.label"
          :titleClass="category.titleClass"
          :value="ruleStats[category.key]" />
      </div>

      <DistributionDetails
        class="text-sm"
        summary="Voir la distribution complète">
        <div class="grid grid-cols-3 gap-8">
          <div v-for="category in RULE_CATEGORIES" :key="category.key">
            <h5
              class="text-xs font-semibold mb-2 uppercase tracking-wide"
              :class="category.headerClass">
              {{ category.label }}
            </h5>
            <div class="space-y-1.5">
              <PropertyBar
                v-for="(item, index) in getCategoryRules(category.key)"
                :key="index"
                :label="item.size"
                :count="item.count"
                :maxCount="maxRuleCount"
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
import DistributionDetails from "../DistributionDetails.vue";
import Section from "../Section.vue";
import PropertyBar from "../PropertyBar.vue";

const props = defineProps({
  rules: Object,
});

const RULE_CATEGORIES = [
  {
    key: "light",
    min: 1,
    max: 2,
    label: "Légères (1-2)",
    titleClass: "text-green-600",
    headerClass: "text-green-600",
    barColor: "bg-green-500",
  },
  {
    key: "normal",
    min: 3,
    max: 9,
    label: "Normales (3-9)",
    titleClass: "text-blue-500",
    headerClass: "text-blue-600",
    barColor: "bg-blue-500",
  },
  {
    key: "heavy",
    min: 10,
    max: Infinity,
    label: "Lourdes (10+)",
    titleClass: "text-orange-500",
    headerClass: "text-orange-600",
    barColor: "bg-orange-500",
  },
];

const rules = computed(() => props.rules || {});
const total = computed(() => rules.value.total || 0);

// Données triées pour PropertyBar
const sortedRules = computed(() => {
  try {
    const sizes = rules.value?.sizes?.unique || {};
    return Object.entries(sizes)
      .map(([size, count]) => ({
        size,
        count,
        sizeNum: parseInt(size, 10),
        percent: total.value > 0 ? Math.round((count / total.value) * 100) : 0,
      }))
      .filter((r) => !isNaN(r.sizeNum))
      .sort((a, b) => b.count - a.count);
  } catch (e) {
    console.error("Erreur sortedRules:", e);
    return [];
  }
});

// Calculer les statistiques par catégorie
const ruleStats = computed(() => {
  const stats = {};
  RULE_CATEGORIES.forEach((cat) => {
    const count = sortedRules.value
      .filter((r) => r.sizeNum >= cat.min && r.sizeNum <= cat.max)
      .reduce((sum, r) => sum + r.count, 0);
    stats[cat.key] =
      total.value > 0 ? Math.round((count / total.value) * 100) : 0;
  });
  return stats;
});

// Récupérer les règles par catégorie
const getCategoryRules = (categoryKey) => {
  const category = RULE_CATEGORIES.find((c) => c.key === categoryKey);
  if (!category) return [];
  return sortedRules.value.filter(
    (r) => r.sizeNum >= category.min && r.sizeNum <= category.max
  );
};

// Valeur maximale pour normaliser les barres
const maxRuleCount = computed(() => {
  if (sortedRules.value.length === 0) return 1;
  return Math.max(...sortedRules.value.map((r) => r.count));
});
</script>

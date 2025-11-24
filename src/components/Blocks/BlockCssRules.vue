<template>
  <Block
    title="Règles"
    desc="Répartition des règles CSS (nombre de déclarations par règle)."
    class="col-span-12 lg:col-span-4">
    <template v-slot:header>
      <div class="flex gap-4">
        <div>
          <div class="text-xs uppercase">Total</div>
          <div class="text-xl font-bold">
            {{ props.projectData.cssAnalysisResult.rules.total }}
          </div>
        </div>
        <div>
          <div class="text-xs uppercase">Vide</div>
          <div class="text-xl font-bold">
            {{ props.projectData.cssAnalysisResult.rules.empty.total }}
          </div>
        </div>
      </div>
    </template>
    <div class="space-y-6">
      <div class="grid grid-cols-3 gap-4">
        <Section
          title="Légères (1-2)"
          suffix="%"
          size="sm"
          textClass="text-green-600"
          :value="thinRules" />
        <Section
          title="Normales (3-9)"
          suffix="%"
          size="sm"
          textClass="text-blue-500"
          :value="normalRules" />
        <Section
          title="Lourdes (10+)"
          suffix="%"
          size="sm"
          textClass="text-orange-500"
          :value="heavyRules" />
      </div>

      <DistributionDetails
        class="text-sm"
        summary="Voir la distribution complète">
        <div class="grid grid-cols-3 gap-4">
          <!-- Légères -->
          <div>
            <h5
              class="text-xs font-semibold text-green-600 mb-2 uppercase tracking-wide">
              Légères (1-2)
            </h5>
            <div class="space-y-1.5">
              <PropertyBar
                v-for="(item, index) in lightRules"
                :key="index"
                :label="item.size"
                :count="item.count"
                :maxCount="maxRuleCount"
                :percent="item.percent"
                :barColor="'bg-green-500'" />
            </div>
          </div>
          <!-- Normales -->
          <div>
            <h5
              class="text-xs font-semibold text-blue-600 mb-2 uppercase tracking-wide">
              Normales (3-9)
            </h5>
            <div class="space-y-1.5">
              <PropertyBar
                v-for="(item, index) in normalRulesList"
                :key="index"
                :label="item.size"
                :count="item.count"
                :maxCount="maxRuleCount"
                :percent="item.percent"
                :barColor="'bg-blue-500'" />
            </div>
          </div>
          <!-- Lourdes -->
          <div>
            <h5
              class="text-xs font-semibold text-orange-600 mb-2 uppercase tracking-wide">
              Lourdes (10+)
            </h5>
            <div class="space-y-1.5">
              <PropertyBar
                v-for="(item, index) in heavyRulesList"
                :key="index"
                :label="item.size"
                :count="item.count"
                :maxCount="maxRuleCount"
                :percent="item.percent"
                :barColor="'bg-orange-500'" />
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
  projectData: Object,
});

const total = computed(() => props.projectData.cssAnalysisResult.rules.total);

const thinRules = computed(() => {
  const sizes = props.projectData.cssAnalysisResult.rules.sizes.unique;
  const thin = (sizes["1"] || 0) + (sizes["2"] || 0);
  return total.value > 0 ? Math.round((thin / total.value) * 100) : 0;
});

const normalRules = computed(() => {
  const sizes = props.projectData.cssAnalysisResult.rules.sizes.unique;
  let normal = 0;
  for (let i = 3; i <= 9; i++) {
    normal += sizes[i.toString()] || 0;
  }
  return total.value > 0 ? Math.round((normal / total.value) * 100) : 0;
});

const heavyRules = computed(() => {
  return 100 - thinRules.value - normalRules.value;
});

// Données triées pour PropertyBar
const sortedRules = computed(() => {
  const sizes = props.projectData.cssAnalysisResult.rules.sizes.unique;
  return Object.entries(sizes)
    .map(([size, count]) => ({
      size,
      count,
      percent: total.value > 0 ? Math.round((count / total.value) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);
});

// Séparer par catégorie
const lightRules = computed(() =>
  sortedRules.value.filter((r) => {
    const num = parseInt(r.size, 10);
    return !isNaN(num) && num <= 2;
  })
);

const normalRulesList = computed(() =>
  sortedRules.value.filter((r) => {
    const num = parseInt(r.size, 10);
    return !isNaN(num) && num >= 3 && num <= 9;
  })
);

const heavyRulesList = computed(() =>
  sortedRules.value.filter((r) => {
    const num = parseInt(r.size, 10);
    return !isNaN(num) && num >= 10;
  })
);

// Valeur maximale pour normaliser les barres
const maxRuleCount = computed(() => {
  if (sortedRules.value.length === 0) return 1;
  return Math.max(...sortedRules.value.map((r) => r.count));
});
</script>

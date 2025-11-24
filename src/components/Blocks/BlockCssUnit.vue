<template>
  <Block
    title="Unités"
    desc="Répartition entre unités relatives et absolues."
    class="col-span-12 lg:col-span-4">
    <template v-slot:header>
      <div class="flex gap-4">
        <div>
          <div class="text-xs uppercase">Total</div>
          <div class="text-xl font-bold">
            {{ props.projectData.cssAnalysisResult.values.units.total }}
          </div>
        </div>
        <div>
          <div class="text-xs uppercase">Unique</div>
          <div class="text-xl font-bold">
            {{ props.projectData.cssAnalysisResult.values.units.totalUnique }}
          </div>
        </div>
      </div>
    </template>

    <div class="space-y-6">
      <div class="grid grid-cols-2 gap-4">
        <Section
          title="Relatives"
          suffix="%"
          size="sm"
          textClass="text-green-600"
          :value="relativePercent" />
        <Section
          title="Absolues"
          suffix="%"
          size="sm"
          textClass="text-orange-600"
          :value="absolutePercent" />
      </div>

      <DistributionDetails
        v-if="topUnits.length > 0"
        class="text-sm"
        summary="Top 10 des unités utilisées">
        <div class="grid grid-cols-2 gap-4">
          <!-- Relatives -->
          <div>
            <h5
              class="text-xs font-semibold text-green-600 mb-2 uppercase tracking-wide">
              Relatives
            </h5>
            <div class="space-y-1.5">
              <PropertyBar
                v-for="(item, index) in relativeUnitsList"
                :key="index"
                :label="item.unit"
                :count="item.count"
                :maxCount="maxUnitCount"
                :percent="item.percent"
                :barColor="'bg-green-500'" />
            </div>
          </div>
          <!-- Absolues -->
          <div>
            <h5
              class="text-xs font-semibold text-orange-600 mb-2 uppercase tracking-wide">
              Absolues
            </h5>
            <div class="space-y-1.5">
              <PropertyBar
                v-for="(item, index) in absoluteUnitsList"
                :key="index"
                :label="item.unit"
                :count="item.count"
                :maxCount="maxUnitCount"
                :percent="item.percent"
                :barColor="'bg-orange-500'" />
            </div>
          </div>
        </div>
      </DistributionDetails>

      <Infos
        v-if="props.projectData.cssAnalysisResult.values.units.unique.rem < 3">
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
  projectData: Object,
});

const relativeUnits = [
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

const unitsData = computed(
  () => props.projectData?.cssAnalysisResult?.values?.units || {}
);

const total = computed(() => unitsData.value?.total || 0);

const relativePercent = computed(() => {
  try {
    if (total.value === 0) return 0;
    let count = 0;
    const unique = unitsData.value?.unique || {};
    Object.entries(unique).forEach(([unit, val]) => {
      if (relativeUnits.includes(unit)) count += val;
    });
    return Math.round((count / total.value) * 100);
  } catch (e) {
    console.error("Erreur relativePercent:", e);
    return 0;
  }
});

const absolutePercent = computed(() => {
  return 100 - relativePercent.value;
});

const topUnits = computed(() => {
  try {
    const unique = unitsData.value?.unique || {};
    const units = Object.entries(unique)
      .filter(([unit]) => unit !== "s") // Exclure l'unité "s"
      .map(([unit, count]) => ({
        unit,
        count,
        percent: total.value > 0 ? Math.round((count / total.value) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);
    return units;
  } catch (e) {
    console.error("Erreur topUnits:", e);
    return [];
  }
});

// Séparer les unités relatives et absolues
const relativeUnitsList = computed(() =>
  topUnits.value.filter((u) => relativeUnits.includes(u.unit)).slice(0, 10)
);

const absoluteUnitsList = computed(() =>
  topUnits.value.filter((u) => !relativeUnits.includes(u.unit)).slice(0, 10)
);

// Valeur maximale pour normaliser les barres
const maxUnitCount = computed(() => {
  if (topUnits.value.length === 0) return 1;
  return Math.max(...topUnits.value.map((u) => u.count));
});

const getBarColor = (unit) => {
  if (relativeUnits.includes(unit)) return "bg-green-600";
  return "bg-orange-500";
};
</script>

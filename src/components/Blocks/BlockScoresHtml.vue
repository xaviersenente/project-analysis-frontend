<template>
  <Block
    title="Scores"
    desc="Synthèse des scores de qualité : validation W3C et moyennes Lighthouse (performance, accessibilité, bonnes pratiques, SEO).">
    <div class="grid grid-cols-5 gap-8">
      <h3
        class="col-span-2 text-center row-start-1 border-b border-b-slate-300 text-xl font-bold p-3 uppercase text-slate-500 lg:col-span-1">
        W3C
      </h3>
      <div class="col-span-2 flex flex-col gap-8 items-center lg:col-span-1">
        <h4 class="text-sm">Validité</h4>
        <ProgressCircle :value="stats.errorScore / 100" />
      </div>
      <h3
        class="col-span-3 text-center row-start-1 border-b border-b-slate-300 text-xl font-bold p-3 uppercase text-slate-500 lg:col-span-4">
        LightHouse
      </h3>
      <div
        class="col-span-3 grid grid-cols-2 gap-8 *:flex *:flex-col *:gap-8 *:items-center lg:grid-cols-4 lg:col-span-4">
        <div>
          <h4 class="text-sm">Performance</h4>
          <ProgressCircle
            :value="stats.performanceAverage"
            class="opacity-50" />
        </div>
        <div>
          <h4 class="text-sm">Accessibilité</h4>
          <ProgressCircle :value="stats.accessibilityAverage" />
        </div>
        <div>
          <h4 class="text-sm">Méthodes</h4>
          <ProgressCircle :value="stats.bestPracticesAverage" />
        </div>
        <div>
          <h4 class="text-sm">SEO</h4>
          <ProgressCircle :value="stats.seoAverage" />
        </div>
      </div>
    </div>
  </Block>
</template>

<script setup>
import Block from "../Block.vue";
import ProgressCircle from "../ProgressCircle.vue";
import { computed } from "vue";

const props = defineProps({
  projectData: Object,
});

// Fonction pour calculer les moyennes de Lighthouse
const getAverage = (key) => {
  return computed(() => {
    if (
      Array.isArray(props.projectData?.pages) &&
      props.projectData.pages.length > 0
    ) {
      const total = props.projectData.pages.reduce(
        (sum, page) => sum + (page.lighthouseReport?.[key] || 0),
        0
      );
      return (total / props.projectData.pages.length).toFixed(2);
    }
    return 0;
  });
};

// Calcul des statistiques
const stats = computed(() => ({
  performanceAverage: getAverage("performance").value,
  accessibilityAverage: getAverage("accessibility").value,
  bestPracticesAverage: getAverage("bestPractices").value,
  seoAverage: getAverage("seo").value,
  errorScore: (() => {
    if (
      Array.isArray(props.projectData?.pages) &&
      props.projectData.pages.length > 0
    ) {
      const totalErrors = props.projectData.pages.reduce(
        (sum, page) => sum + (page.validationErrors?.length || 0),
        0
      );
      const averageErrors = totalErrors / props.projectData.pages.length;

      // Calcul du score sur 100
      const score = 100 - Math.min(averageErrors / 10, 1) * 100;
      return score.toFixed(0);
    }
    return "0";
  })(),
}));
</script>

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
        <ProgressCircle
          :value="stats.validationScore / 100"
          :averageValue="props.classStats?.stats?.validation?.mean / 100" />
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
            :averageValue="
              props.classStats?.stats?.lighthouse?.performance?.mean / 100
            "
            class="opacity-50" />
        </div>
        <div>
          <h4 class="text-sm">Accessibilité</h4>
          <ProgressCircle
            :value="stats.accessibilityAverage"
            :averageValue="
              props.classStats?.stats?.lighthouse?.accessibility?.mean / 100
            " />
        </div>
        <div>
          <h4 class="text-sm">Méthodes</h4>
          <ProgressCircle
            :value="stats.bestPracticesAverage"
            :averageValue="
              props.classStats?.stats?.lighthouse?.bestPractices?.mean / 100
            " />
        </div>
        <div>
          <h4 class="text-sm">SEO</h4>
          <ProgressCircle
            :value="stats.seoAverage"
            :averageValue="
              props.classStats?.stats?.lighthouse?.seo?.mean / 100
            " />
        </div>
      </div>
      <!-- <h3
        class="col-span-5 text-center border-b border-b-slate-300 text-xl font-bold p-3 uppercase text-slate-500 lg:col-span-2">
        Images
      </h3>
      <div class="col-span-5 flex justify-center lg:col-span-2">
        <ProgressCircle
          :value="imagesScore / 100"
          :averageValue="imagesAverage ?? undefined" />
      </div> -->
      <p class="col-span-5 text-xs text-slate-500 flex items-center gap-2">
        <span class="inline-block w-3 h-3 rounded-full bg-slate-400"></span>
        Le cercle et le score gris indiquent la moyenne de la classe.
      </p>
    </div>
  </Block>
</template>

<script setup>
import Block from "../Block.vue";
import ProgressCircle from "../ProgressCircle.vue";
import { computed } from "vue";

const props = defineProps({
  projectData: Object,
  classStats: Object,
});

const imagesScore = computed(
  () => props.projectData?.globalImagesAnalysis?.globalScore?.total || 0
);
const imagesAverage = computed(() => {
  const mean = props.classStats?.stats?.imagesScore?.mean;
  return typeof mean === "number" ? mean / 100 : null;
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
  validationScore: props.projectData?.validationScore?.total || 0,
}));
</script>

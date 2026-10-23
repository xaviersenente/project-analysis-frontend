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
          v-if="stats.validationScore !== null"
          :value="stats.validationScore / 100"
          :averageValue="classStatsData.validation?.mean / 100" />
        <p v-else class="text-sm text-slate-500">Non mesurable</p>
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
            v-if="stats.performanceAverage !== null"
            :value="stats.performanceAverage"
            :averageValue="classStatsData.lighthouse?.performance?.mean / 100"
            class="opacity-50" />
          <p v-else class="text-sm text-slate-500">Non mesurable</p>
        </div>
        <div>
          <h4 class="text-sm">Accessibilité</h4>
          <ProgressCircle
            v-if="stats.accessibilityAverage !== null"
            :value="stats.accessibilityAverage"
            :averageValue="
              classStatsData.lighthouse?.accessibility?.mean / 100
            " />
          <p v-else class="text-sm text-slate-500">Non mesurable</p>
        </div>
        <div>
          <h4 class="text-sm">Méthodes</h4>
          <ProgressCircle
            v-if="stats.bestPracticesAverage !== null"
            :value="stats.bestPracticesAverage"
            :averageValue="
              classStatsData.lighthouse?.bestPractices?.mean / 100
            " />
          <p v-else class="text-sm text-slate-500">Non mesurable</p>
        </div>
        <div>
          <h4 class="text-sm">SEO</h4>
          <ProgressCircle
            v-if="stats.seoAverage !== null"
            :value="stats.seoAverage"
            :averageValue="classStatsData.lighthouse?.seo?.mean / 100" />
          <p v-else class="text-sm text-slate-500">Non mesurable</p>
        </div>
      </div>

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

// Simplification de l'accès aux stats de classe
const classStatsData = computed(() => props.classStats?.stats || {});

// Fonction pour calculer les moyennes de Lighthouse, sur les pages mesurées seulement
const getAverage = (key) => {
  return computed(() => {
    const pages = (props.projectData?.pages || []).filter(
      (page) => typeof page.lighthouseReport?.[key] === "number"
    );
    if (pages.length === 0) return null;
    const total = pages.reduce(
      (sum, page) => sum + page.lighthouseReport[key],
      0
    );
    return Number((total / pages.length).toFixed(2));
  });
};

// Calcul des statistiques
const stats = computed(() => ({
  performanceAverage: getAverage("performance").value,
  accessibilityAverage: getAverage("accessibility").value,
  bestPracticesAverage: getAverage("bestPractices").value,
  seoAverage: getAverage("seo").value,
  validationScore: props.projectData?.validationScore?.total ?? null,
}));
</script>

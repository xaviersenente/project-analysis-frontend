<template>
  <Block
    title="Scores"
    desc="Synthèse des scores de qualité : Variables, typographie, organisation du code, méthodologie BEM.">
    <div class="grid grid-cols-2 gap-8 md:grid-cols-4">
      <div class="flex flex-col gap-8 items-center">
        <h4 class="text-sm">Variables</h4>
        <ProgressCircle
          :value="
            props.projectData.cssAnalysisResult.customProperties.score.total /
            100
          "
          :averageValue="props.classStats?.stats?.cssVariables?.mean / 100" />
      </div>
      <!-- <div class="flex flex-col gap-8 items-center">
        <h4 class="text-sm">Organisation</h4>
        <ProgressCircle :value="props.projectData / 100" />
      </div> -->
      <div class="flex flex-col gap-8 items-center">
        <h4 class="text-sm">Typographie</h4>
        <ProgressCircle
          :value="
            props.projectData.cssAnalysisResult.typography.score.total / 100
          "
          :averageValue="props.classStats?.stats?.cssTypography?.mean / 100" />
      </div>
      <div class="flex flex-col gap-8 items-center">
        <h4 class="text-sm">Imports CSS</h4>
        <ProgressCircle
          :value="props.projectData.cssAnalysisResult.imports.score.total / 100"
          :averageValue="props.classStats?.stats?.cssImports?.mean / 100" />
      </div>
      <div class="flex flex-col gap-8 items-center">
        <h4 class="text-sm">BEM</h4>
        <ProgressCircle
          :value="props.projectData.classAnalysis.score.bem.total / 100"
          :averageValue="props.classStats?.stats?.classAnalysis?.mean / 100" />
      </div>
      <p
        class="col-span-2 md:col-span-4 text-xs text-gray-500 flex items-center gap-2">
        <span class="inline-block w-3 h-3 rounded-full bg-gray-400"></span>
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
</script>

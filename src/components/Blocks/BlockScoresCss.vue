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
          " />
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
          " />
      </div>
      <div class="flex flex-col gap-8 items-center">
        <h4 class="text-sm">Imports CSS</h4>
        <ProgressCircle
          :value="
            props.projectData.cssAnalysisResult.imports.score.total / 100
          " />
      </div>
      <div class="flex flex-col gap-8 items-center">
        <h4 class="text-sm">BEM</h4>
        <ProgressCircle
          :value="props.projectData.classAnalysis.score.bem.total / 100" />
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
</script>

<template>
  <Block title="Couleurs" class="col-span-12 2xl:col-span-4">
    <template v-slot:header>
      <div class="flex gap-4">
        <div>
          <div class="text-xs uppercase">Total</div>
          <div class="text-xl font-bold">{{ stats.totalColors }}</div>
        </div>
        <div>
          <div class="text-xs uppercase">Unique</div>
          <div class="text-xl font-bold">{{ stats.uniqueColors }}</div>
        </div>
      </div>
    </template>

    <div class="flex flex-wrap gap-3 mt-4">
      <div
        v-for="(count, color) in stats.colors"
        :key="color"
        class="w-12 h-12 rounded shadow-md lg:w-16 lg:h-16"
        :style="{
          backgroundColor: isValidColor(color) ? color : 'transparent',
          border: !isValidColor(color) ? '1px solid #ccc' : '',
        }"
      >
        <span v-if="!isValidColor(color)">
          {{ color }}
        </span>
      </div>
    </div>
  </Block>
</template>

<script setup>
  import Block from "../Block.vue";
  import { computed } from "vue";

  const props = defineProps({
    projectData: Object,
  });

  // Extraire les statistiques des couleurs
  const stats = computed(() => {
    const cssAnalysis =
      props.projectData?.cssAnalysisResult?.values?.colors || {};
    return {
      totalColors: cssAnalysis.total || 0,
      uniqueColors: cssAnalysis.totalUnique || 0,
      colors: cssAnalysis.unique || {},
    };
  });

  // Fonction pour valider si la couleur est utilisable dans CSS
  const isValidColor = (color) => {
    const s = new Option().style;
    s.color = color;
    return s.color !== "";
  };
</script>

<template>
  <Block title="Unités" class="col-span-12 lg:col-span-4">
    <table class="min-w-full table-auto border-collapse text-left text-sm">
      <thead>
        <tr class="bg-gray-100 *:px-4 *:py-2">
          <th width="8%">Unités</th>
          <th width="8%">Nb</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(count, unit) in sortedUnits"
          :key="unit"
          class="hover:bg-gray-50 transition-colors *:px-4 *:py-2 *:border-b"
        >
          <td class="font-mono text-right">{{ unit }}</td>
          <td class="font-mono text-right">{{ count }}</td>
          <td>
            <meter
              :value="count"
              :max="maxCount"
              class="w-full appearance-none bg-white"
            ></meter>
          </td>
        </tr>
      </tbody>
    </table>
  </Block>
</template>

<script setup>
  import Block from "../Block.vue";
  import { computed } from "vue";

  // Props attendues depuis le parent
  const props = defineProps({
    projectData: Object,
  });

  // Trier les unités par valeur décroissante et exclure "s"
  const sortedUnits = computed(() => {
    return Object.entries(
      props.projectData.cssAnalysisResult.values.units.unique
    )
      .filter(([unit]) => unit !== "s") // Exclure l'unité "s"
      .sort(([, a], [, b]) => b - a) // Trier par valeur décroissante
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});
  });

  // Trouver la valeur maximale pour l'attribut `max` de `<meter>`
  const maxCount = computed(() => {
    return Math.max(
      ...Object.values(props.projectData.cssAnalysisResult.values.units.unique)
    );
  });
</script>

<style scoped>
  meter::-webkit-meter-bar {
    background: transparent; /* Required to get rid of the default background property */
  }
  meter::-webkit-meter-optimum-value {
    border-radius: 8px;
    background: rgb(
      37,
      99,
      235
    ); /* Required to get rid of the default background property */
  }
</style>

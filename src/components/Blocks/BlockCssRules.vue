<template>
  <Block title="Règles" class="col-span-12 lg:col-span-4">
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
    <table class="min-w-full table-auto border-collapse text-left text-sm">
      <thead>
        <tr class="bg-gray-100 *:px-4 *:py-2">
          <th width="10%">Taille</th>
          <th width="10%">Nb</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(count, unit) in sortedUnits"
          :key="unit"
          class="hover:bg-gray-50 transition-colors *:px-4 *:py-2 *:border-b"
        >
          <td>{{ unit }}</td>
          <td>{{ count }}</td>
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
      props.projectData.cssAnalysisResult.rules.sizes.unique
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
      ...Object.values(props.projectData.cssAnalysisResult.rules.sizes.unique)
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

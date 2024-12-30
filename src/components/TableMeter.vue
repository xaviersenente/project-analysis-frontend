<template>
  <table
    class="min-w-full table-auto border-collapse text-left text-xs lg:text-sm"
  >
    <thead>
      <tr class="bg-gray-100 text-right *:px-3 *:py-2">
        <th :width="columnWidth">{{ headerLabel }}</th>
        <th width="5%">{{ headerCount }}</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(count, unit, index) in limitedUnits"
        :key="unit"
        class="hover:bg-gray-50 transition-colors font-mono text-right *:px-3 *:py-1.5 *:border-b"
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
</template>

<script setup>
  import { computed } from "vue";

  const props = defineProps({
    data: {
      type: Object,
      required: true,
    },
    headerLabel: {
      type: String,
      default: "Taille",
    },
    headerCount: {
      type: String,
      default: "Nb",
    },
    columnWidth: {
      type: String,
      default: "10%", // Largeur par défaut des colonnes
    },
    maxRows: {
      type: Number,
      default: Infinity, // Par défaut, pas de limite
    },
  });

  // Trier les unités par valeur décroissante et exclure "s"
  const sortedUnits = computed(() => {
    return Object.entries(props.data)
      .filter(([unit]) => unit !== "s") // Exclure l'unité "s"
      .sort(([, a], [, b]) => b - a) // Trier par valeur décroissante
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});
  });

  // Trouver la valeur maximale pour l'attribut `max` de `<meter>`
  const maxCount = computed(() => {
    return Math.max(...Object.values(props.data));
  });

  // Limiter le nombre de lignes affichées
  const limitedUnits = computed(() => {
    return Object.entries(sortedUnits.value)
      .slice(0, props.maxRows)
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});
  });
</script>

<style scoped>
  meter::-webkit-meter-bar {
    background: transparent;
  }
  meter::-webkit-meter-optimum-value {
    border-radius: 8px;
    background: rgb(37, 99, 235);
  }
</style>

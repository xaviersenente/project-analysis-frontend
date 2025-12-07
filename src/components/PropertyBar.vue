<template>
  <div>
    <div class="flex justify-between text-xs mb-0.5">
      <span class="font-mono">{{ label }}</span>
      <span class="font-semibold"
        >{{ count }}
        <span v-if="percent" class="text-slate-500"
          >({{ displayPercent }}%)</span
        ></span
      >
    </div>
    <div class="w-full bg-gray-200 rounded h-1">
      <div
        :class="barColor"
        class="h-1 rounded"
        :style="{ width: barWidth + '%' }"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  label: String,
  count: Number,
  maxCount: Number, // nouvelle prop pour calcul relatif
  percent: Number, // conservé pour rétrocompatibilité d'affichage
  barColor: {
    type: String,
    default: "bg-gray-500",
  },
});

// Largeur de la barre normalisée (100% = maxCount)
const barWidth = computed(() => {
  if (props.maxCount && props.maxCount > 0) {
    return Math.min(100, (props.count / props.maxCount) * 100);
  }
  // fallback si maxCount non fourni : utilise percent
  return props.percent || 0;
});

// Pourcentage affiché (conserve percent si fourni)
const displayPercent = computed(() => props.percent || 0);
</script>

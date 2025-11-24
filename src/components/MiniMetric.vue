<template>
  <div class="flex flex-col items-center">
    <div class="relative w-20 h-20">
      <svg class="transform -rotate-90" viewBox="0 0 36 36">
        <circle
          cx="18"
          cy="18"
          r="15.915"
          fill="none"
          stroke="#e5e7eb"
          stroke-width="3" />
        <circle
          cx="18"
          cy="18"
          r="15.915"
          fill="none"
          :stroke="color || getColor()"
          stroke-width="3"
          :stroke-dasharray="`${percentage} ${100 - percentage}`"
          stroke-linecap="round" />
      </svg>
      <div
        class="absolute inset-0 flex items-center justify-center text-sm font-bold"
        :style="{ color: color || getColor() }">
        {{ Math.round(percentage) }}%
      </div>
    </div>
    <div class="mt-2 text-xs text-center font-medium text-gray-700">
      {{ label }}
    </div>
    <div class="text-xs font-semibold" :style="{ color: color || getColor() }">
      {{ getLabel() }}
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  label: String,
  value: Number,
  total: Number,
  color: String,
});

const percentage = computed(() => {
  if (!props.total || props.total === 0) return 0;
  return (props.value / props.total) * 100;
});

const getColor = () => {
  const p = percentage.value;
  if (p >= 80) return "#10b981";
  if (p >= 60) return "#f59e0b";
  return "#ef4444";
};

const getLabel = () => {
  const p = percentage.value;
  if (p >= 80) return "Excellent";
  if (p >= 60) return "Bon";
  return "À améliorer";
};
</script>

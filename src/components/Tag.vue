<template>
  <span :class="colorClass" class="px-2 py-1 rounded">
    {{ value * 100 }}
  </span>
</template>

<script setup>
  import { computed } from "vue";

  const props = defineProps({
    value: {
      type: Number,
      required: true,
      validator: (val) => val >= 0 && val <= 1,
    },
  });

  // Propriété calculée pour déterminer la classe CSS en fonction de la valeur
  const colorClass = computed(() => {
    if (props.value === 1) {
      return " text-green-700";
    } else if (props.value >= 0.8) {
      return " text-yellow-600";
    } else if (props.value >= 0.6) {
      return " text-orange-600";
    } else if (props.value > 0) {
      return " text-red-700";
    }
  });
</script>

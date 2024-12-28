<template>
  <span :class="colorClass" class="px-2 py-1 rounded border">
    {{ value }}
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
    if (props.value === 0) {
      return "border-green-600 text-green-700";
    } else if (props.value <= 5) {
      return "border-yellow-500 text-yellow-600";
    } else if (props.value <= 10) {
      return "border-orange-500 text-orange-600";
    } else if (props.value < 20) {
      return "border-red-500 text-red-700";
    } else {
      return "border-red-500 text-red-700";
    }
  });
</script>

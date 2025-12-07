<template>
  <div class="text-center p-3 rounded" :class="bgClass">
    <div class="text-2xl font-bold" :class="titleClass">
      {{ value }}{{ suffix }}
    </div>
    <div class="text-xs text-gray-600">{{ label }}</div>
  </div>
</template>

<script setup>
defineProps({
  value: [Number, String],
  label: String,
  bgClass: {
    type: String,
    default: "bg-gray-50",
  },
  titleClass: {
    type: String,
    default: "text-gray-600",
  },
  suffix: {
    type: String,
    default: "",
  },
});
</script>

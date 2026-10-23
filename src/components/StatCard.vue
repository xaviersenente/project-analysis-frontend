<template>
  <div class="text-center p-3 rounded" :class="bgClass">
    <div class="text-2xl font-bold" :class="titleClass">
      {{ value }}{{ suffix }}
    </div>
    <div class="text-xs text-slate-600">{{ label }}</div>
  </div>
</template>

<script setup>
defineProps({
  value: {
    type: [Number, String],
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  bgClass: {
    type: String,
    default: "bg-slate-50",
  },
  titleClass: {
    type: String,
    default: "text-slate-600",
  },
  suffix: {
    type: String,
    default: "",
  },
});
</script>

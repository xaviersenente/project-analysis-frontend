<script setup>
  defineProps({
    tag: {
      type: String,
      required: true,
    },
  });
</script>

<template>
  <span
    class="px-1.5 py-0.5 bg-red-50 text-red-800 rounded font-mono text-xs lg:text-sm lg:px-2"
    >{{ tag }}</span
  >
</template>

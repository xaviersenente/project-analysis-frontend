<script setup>
  defineProps({
    tag: {
      type: String,
      required: true,
    },
  });
</script>

<template>
  <span class="px-2 py-0.5 bg-red-50 text-red-800 rounded font-mono text-sm">{{
    tag
  }}</span>
</template>

<template>
  <div :class="['rounded-lg shadow-md overflow-hidden', variantClasses]">
    <div
      v-if="title"
      class="p-5 flex bg-slate-100 gap-8 justify-between items-center flex-wrap border-b border-b-slate-300 lg:px-8 lg:py-5">
      <div class="flex-1">
        <h3 v-if="title" class="text-lg font-semibold">
          {{ title }}
        </h3>
        <p v-if="desc" class="text-sm text-slate-400">{{ desc }}</p>
      </div>
      <slot name="header"></slot>
    </div>
    <div class="p-5 lg:p-8">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { VARIANT_COLORS } from "../js/constants";

const props = defineProps({
  title: String,
  desc: String,
  variant: {
    type: String,
    default: "default",
    validator: (value) => ["default", "html", "css"].includes(value),
  },
});

// Définition des classes en fonction du variant
const variantClasses = computed(() => {
  const colors = VARIANT_COLORS[props.variant];
  if (props.variant === "default") {
    return colors.bg;
  }
  return `${colors.bg} text-white`;
});
</script>

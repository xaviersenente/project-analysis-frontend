<template>
  <div :class="['rounded-lg shadow-md overflow-hidden', variantClasses]">
    <div
      v-if="title"
      class="p-5 bg-slate-900 text-slate-50 flex gap-4 justify-between items-center flex-wrap lg:px-8 lg:py-5">
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
const variantClasses = {
  default: "bg-white",
  html: "bg-orange-600 text-white",
  css: "bg-blue-600 text-white",
}[props.variant];
</script>

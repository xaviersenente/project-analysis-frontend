<template>
  <div :class="['p-5 rounded-lg lg:p-8', variantClasses]">
    <div class="flex gap-4 justify-between items-center flex-wrap mb-4">
      <h3 v-if="title" class="text-lg bg- font-semibold text-slate-500">
        {{ title }}
      </h3>
      <slot name="header"></slot>
    </div>

    <slot />
  </div>
</template>

<script setup>
  const props = defineProps({
    title: String,
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

<template>
  <div>
    <h5
      class="text-xs text-black uppercase border-b border-b-gray-300 pb-2 mb-2"
    >
      {{ title }}
      <span v-if="subtitle" class="text-gray-400">{{ subtitle }}</span>
    </h5>
    <div class="flex flex-wrap justify-between items-end gap-4">
      <p :class="sizeClasses">
        <span class="font-bold" :class="textSizeClass">{{ value }}</span>
        <span v-if="additionalValue" :class="additionalTextSizeClass">
          / {{ additionalValue }}</span
        >
      </p>
      <div><slot></slot></div>
    </div>
  </div>
</template>

<script setup>
  import { computed } from "vue";

  const props = defineProps({
    title: String,
    subtitle: String,
    value: [String, Number],
    additionalValue: [String, Number],
    size: {
      type: String,
      default: "default",
      validator: (value) => ["sm", "default"].includes(value),
    },
  });

  // Classe pour la taille principale
  const textSizeClass = computed(() =>
    props.size === "sm" ? "text-2xl lg:text-3xl" : "text-4xl lg:text-5xl"
  );

  // Classe pour la taille additionnelle
  const additionalTextSizeClass = computed(() =>
    props.size === "sm" ? "text-base" : "text-xl"
  );
</script>

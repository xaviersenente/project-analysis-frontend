<template>
  <div>
    <div class="border-b pb-2 mb-2" :class="borderClass">
      <h5 class="text-xs uppercase font-semibold" :class="textClass">
        {{ title }}
        <span v-if="subtitle" class="text-gray-400">{{ subtitle }}</span>
      </h5>
      <p v-if="definition" class="text-xs text-gray-500 mt-2 italic">
        {{ definition }}
      </p>
    </div>
    <div class="flex flex-wrap justify-between items-end gap-4">
      <p :class="sizeClasses">
        <span class="font-bold" :class="textSizeClass"
          >{{ value }}{{ suffix }}</span
        >
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
  definition: String,
  value: [String, Number],
  additionalValue: [String, Number],
  size: {
    type: String,
    default: "default",
    validator: (value) => ["sm", "default"].includes(value),
  },
  suffix: {
    type: String,
    default: "",
  },
  textClass: {
    type: String,
    default: "text-black",
  },
  borderClass: {
    type: String,
    default: "border-b-gray-300",
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

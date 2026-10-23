<template>
  <div>
    <div class="border-b pb-2 mb-2" :class="borderClass">
      <h5 class="text-xs uppercase font-semibold" :class="titleClass">
        {{ title }}
        <span v-if="subtitle" class="text-slate-400">{{ subtitle }}</span>
      </h5>
      <p v-if="definition" class="text-xs text-slate-500 mt-2 italic">
        {{ definition }}
      </p>
    </div>
    <div class="flex flex-wrap justify-between items-end gap-8">
      <p :class="textClass" v-if="value">
        <span class="font-bold" :class="textSizeClass"
          >{{ value }}{{ suffix }}</span
        >
        <span v-if="additionalValue" :class="additionalTextSizeClass">
          / {{ additionalValue }}</span
        >
      </p>
      <div v-if="rightValue">
        <div class="text-xs uppercase text-slate-400">{{ rightText }}</div>
        <div :class="rightClass">{{ rightValue }}</div>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: "",
  },
  definition: {
    type: String,
    default: "",
  },
  value: {
    type: [String, Number],
    default: null,
  },
  additionalValue: {
    type: [String, Number],
    default: null,
  },
  rightValue: {
    type: [String, Number],
    default: null,
  },
  rightClass: {
    type: String,
    default: "",
  },
  size: {
    type: String,
    default: "default",
    validator: (value) => ["sm", "default"].includes(value),
  },
  suffix: {
    type: String,
    default: "",
  },
  titleClass: {
    type: String,
    default: "text-black",
  },
  rightText: {
    type: String,
    default: "",
  },
  textClass: {
    type: String,
    default: "text-black",
  },
  borderClass: {
    type: String,
    default: "border-b-slate-300",
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

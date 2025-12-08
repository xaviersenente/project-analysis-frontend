<template>
  <svg viewBox="0 0 120 120" class="max-w-36 max-h-36">
    <!-- Cercle de fond -->
    <circle
      cx="60"
      cy="60"
      r="49"
      fill="none"
      stroke-width="20"
      class="stroke-gray-200" />
    <!-- Cercle de progression principal -->
    <circle
      cx="60"
      cy="60"
      r="52"
      fill="none"
      stroke="#4caf50"
      stroke-width="8"
      stroke-linecap="round"
      class="transition-all duration-1000 ease-in-out"
      :class="circleColor"
      :style="circleStyle" />
    <!-- Cercle de moyenne (si fourni) -->
    <circle
      v-if="averageValue !== null"
      cx="60"
      cy="60"
      r="44"
      fill="none"
      stroke-width="4"
      stroke-linecap="round"
      class="transition-all duration-1000 ease-in-out stroke-gray-400"
      :style="averageCircleStyle" />
    <!-- Texte affichant le pourcentage de l'étudiant -->
    <text
      x="60"
      :y="averageValue !== null ? '62' : '70'"
      text-anchor="middle"
      font-size="24"
      font-weight="bold"
      :class="textColor">
      {{ percentage }}
    </text>
    <!-- Texte affichant le pourcentage moyen (si fourni) -->
    <text
      v-if="averageValue !== null"
      x="60"
      y="78"
      text-anchor="middle"
      font-size="14"
      class="fill-gray-400">
      {{ averagePercentage }}
    </text>
  </svg>
</template>

<script setup>
import { computed } from "vue";

// Déclaration de la prop avec validation
const props = defineProps({
  value: {
    type: Number,
    required: true,
    validator: (val) => val >= 0 && val <= 1,
  },
  averageValue: {
    type: Number,
    default: null,
    validator: (val) => val === null || (val >= 0 && val <= 1),
  },
});

// Calcule le style du cercle de progression
const circleStyle = computed(() => {
  const radius = 52; // Rayon du cercle principal
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - props.value);
  return {
    strokeDasharray: `${circumference} ${circumference}`,
    strokeDashoffset: offset,
    transform: "rotate(-90deg)",
    transformOrigin: "center",
  };
});

// Calcule le style du cercle de moyenne
const averageCircleStyle = computed(() => {
  if (props.averageValue === null) return {};
  const radius = 44; // Rayon du cercle de moyenne
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - props.averageValue);
  return {
    strokeDasharray: `${circumference} ${circumference}`,
    strokeDashoffset: offset,
    transform: "rotate(-90deg)",
    transformOrigin: "center",
  };
});

// Calcule le pourcentage affiché
const percentage = computed(() => Math.round(props.value * 100));

// Calcule le pourcentage moyen affiché
const averagePercentage = computed(() =>
  props.averageValue !== null ? Math.round(props.averageValue * 100) : 0
);

// Détermine la couleur en fonction de la valeur
const circleColor = computed(() => {
  if (props.value > 0.85) return "stroke-green-500";
  if (props.value > 0.7) return "stroke-yellow-400";
  if (props.value > 0.55) return "stroke-amber-500";
  return "stroke-red-500";
});

// Détermine la couleur du texte (même logique que le cercle)
const textColor = computed(() => {
  if (props.value > 0.85) return "fill-green-500";
  if (props.value > 0.7) return "fill-yellow-400";
  if (props.value > 0.55) return "fill-amber-500";
  return "fill-red-500";
});
</script>

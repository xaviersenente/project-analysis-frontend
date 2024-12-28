<template>
  <svg viewBox="0 0 120 120" class="max-w-36 max-h-36">
    <!-- Cercle de fond -->
    <circle
      cx="60"
      cy="60"
      r="50"
      fill="none"
      stroke-width="14"
      class="stroke-gray-200"
    />
    <!-- Cercle de progression -->
    <circle
      cx="60"
      cy="60"
      r="50"
      fill="none"
      stroke="#4caf50"
      stroke-width="10"
      stroke-linecap="round"
      class="transition-all duration-1000 ease-in-out"
      :class="circleColor"
      :style="circleStyle"
    />
    <!-- Texte affichant le pourcentage -->
    <text x="60" y="70" text-anchor="middle" font-size="30" fill="#333">
      {{ percentage }}
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
  });

  // Calcule le style du cercle de progression
  const circleStyle = computed(() => {
    const circumference = 2 * Math.PI * 50; // 2πr avec r = 50
    const offset = circumference * (1 - props.value);
    return {
      strokeDasharray: `${circumference} ${circumference}`,
      strokeDashoffset: offset,
      transform: "rotate(-90deg)",
      transformOrigin: "center",
    };
  });

  // Calcule le pourcentage affiché
  const percentage = computed(() => Math.round(props.value * 100));

  // Détermine la couleur en fonction de la valeur
  const circleColor = computed(() => {
    if (props.value > 0.85) return "stroke-green-500";
    if (props.value > 0.7) return "stroke-yellow-400";
    if (props.value > 0.55) return "stroke-amber-500";
    return "stroke-red-500";
  });
</script>

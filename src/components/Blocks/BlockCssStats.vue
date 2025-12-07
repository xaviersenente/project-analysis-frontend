<template>
  <Block
    title="Métriques CSS"
    desc="Quelques chiffres clés sur votre code CSS.">
    <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
      <!-- Lignes de codes -->
      <Section
        title="Lignes de codes"
        :value="cssAnalysisResult.stylesheet.sourceLinesOfCode" />

      <!-- Règles -->
      <Section
        title="Règles"
        subtitle="(Total / vide)"
        :value="cssAnalysisResult.rules.total"
        :additionalValue="cssAnalysisResult.rules.empty.total" />

      <!-- Sélecteurs -->
      <Section
        title="Sélecteurs"
        subtitle="(Total / Unique)"
        rightText="Écart"
        :value="cssAnalysisResult.selectors.total"
        :additionalValue="cssAnalysisResult.selectors.totalUnique"
        :rightValue="gapSelector"
        :rightClass="getGapClass(gapSelector)" />
    </div>
  </Block>
</template>

<script setup>
import { computed } from "vue";
import { gap } from "../../js/helpers";
import Block from "../Block.vue";
import Section from "../Section.vue";

const props = defineProps({
  cssAnalysisResult: Object,
});

const gapSelector = computed(() =>
  gap(
    props.cssAnalysisResult.selectors.total,
    props.cssAnalysisResult.selectors.totalUnique
  )
);

const gapDeclaration = computed(() =>
  gap(
    props.cssAnalysisResult.declarations.total,
    props.cssAnalysisResult.declarations.totalUnique
  )
);

// Fonction pour déterminer la classe en fonction de la valeur d'écart
const getGapClass = (gapValue) => {
  if (gapValue <= 10) return "text-green-600";
  if (gapValue <= 25) return "text-yellow-500";
  if (gapValue <= 40) return "text-orange-500";
  return "text-red-500";
};

// Fonction pour déterminer la classe en fonction de la valeur des variables
// const getClassForValue = (value) => {
//   if (value < 2) return "text-red-500";
//   if (value <= 8) return "text-orange-500";
//   if (value <= 15) return "text-yellow-500";
//   return "text-green-600";
// };

// // Fonction pour déterminer la classe des Id
// const getIdClass = (value) => {
//   if (value === 0) return "text-green-600";
//   if (value <= 4) return "text-orange-500";
//   return "text-red-500";
// };
</script>

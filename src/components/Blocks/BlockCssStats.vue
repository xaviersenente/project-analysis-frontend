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
import { gap, getGapClass } from "../../js/helpers";
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
</script>

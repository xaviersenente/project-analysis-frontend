<template>
  <Block title="Variables CSS" class="col-span-12 lg:col-span-6 xl:col-span-8">
    <div class="grid grid-cols-3 gap-8">
      <!-- Lignes de codes -->
      <Section
        title="Lignes de codes"
        :value="projectData.cssAnalysisResult.stylesheet.sourceLinesOfCode"
      />

      <!-- Règles -->
      <Section
        title="Règles"
        subtitle="(Total / vide)"
        :value="projectData.cssAnalysisResult.rules.total"
        :additionalValue="projectData.cssAnalysisResult.rules.empty.total"
      />

      <!-- Sélecteurs -->
      <Section
        title="Sélecteurs"
        subtitle="(Total / Unique)"
        :value="projectData.cssAnalysisResult.selectors.total"
        :additionalValue="projectData.cssAnalysisResult.selectors.totalUnique"
      >
        <div class="text-xs uppercase text-gray-400">Écart</div>
        <span :class="getGapClass(gapSelector)">{{ gapSelector }}%</span>
      </Section>

      <!-- Déclarations -->
      <Section
        title="Déclarations"
        subtitle="(Total / Unique)"
        :value="projectData.cssAnalysisResult.declarations.total"
        :additionalValue="
          projectData.cssAnalysisResult.declarations.totalUnique
        "
      >
        <div class="text-xs uppercase text-gray-400">Écart</div>
        <span :class="getGapClass(gapDeclaration)">{{ gapDeclaration }}%</span>
      </Section>

      <!-- Variables -->
      <Section
        title="Variables"
        :value="projectData.cssAnalysisResult.properties.custom.total"
        :class="
          getClassForValue(
            projectData.cssAnalysisResult.properties.custom.total
          )
        "
      />

      <!-- Id -->
      <Section
        title="Id"
        :value="projectData.cssAnalysisResult.selectors.id.total"
        :class="getIdClass(projectData.cssAnalysisResult.selectors.id.total)"
      />
    </div>
  </Block>
</template>

<script setup>
  import { computed } from "vue";
  import { gap } from "../../js/helpers";
  import Block from "../Block.vue";
  import Section from "../Section.vue";

  const props = defineProps({
    projectData: Object,
  });

  const gapSelector = computed(() =>
    gap(
      props.projectData.cssAnalysisResult.selectors.total,
      props.projectData.cssAnalysisResult.selectors.totalUnique
    )
  );

  const gapDeclaration = computed(() =>
    gap(
      props.projectData.cssAnalysisResult.declarations.total,
      props.projectData.cssAnalysisResult.declarations.totalUnique
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
  const getClassForValue = (value) => {
    if (value < 2) return "text-red-500";
    if (value <= 8) return "text-orange-500";
    if (value <= 15) return "text-yellow-500";
    return "text-green-600";
  };

  // Fonction pour déterminer la classe des Id
  const getIdClass = (value) => {
    if (value === 0) return "text-green-600";
    if (value <= 4) return "text-orange-500";
    return "text-red-500";
  };
</script>

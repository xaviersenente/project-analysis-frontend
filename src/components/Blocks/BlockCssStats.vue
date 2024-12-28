<template>
  <Block title="Variables CSS" class="col-span-12 lg:col-span-6 xl:col-span-8">
    <div class="grid grid-cols-3 gap-8">
      <div>
        <h5 class="text-xs uppercase">Lignes de codes</h5>
        <p class="text-4xl font-bold lg:text-6xl">
          {{ props.projectData.cssAnalysisResult.stylesheet.sourceLinesOfCode }}
        </p>
      </div>
      <div>
        <h5 class="text-xs uppercase">Règles</h5>
        <p class="text-4xl font-bold lg:text-6xl">
          {{ props.projectData.cssAnalysisResult.rules.total }}
        </p>
      </div>
      <div>
        <h5 class="text-xs uppercase">Sélecteurs</h5>
        <p class="text-4xl font-bold lg:text-6xl">
          {{ props.projectData.cssAnalysisResult.selectors.total }}
        </p>
      </div>
      <div>
        <h5 class="text-xs uppercase">Déclarations</h5>
        <p class="text-4xl font-bold lg:text-6xl">
          {{ props.projectData.cssAnalysisResult.declarations.total }}
        </p>
      </div>
      <div>
        <h5 class="text-xs uppercase">Variables</h5>
        <p class="text-4xl font-bold lg:text-6xl">
          {{ props.projectData.cssAnalysisResult.properties.custom.total }}
        </p>
      </div>
      <div>
        <h5 class="text-xs uppercase">Id</h5>
        <p class="text-4xl font-bold lg:text-6xl">
          {{ props.projectData.cssAnalysisResult.selectors.id.total }}
        </p>
      </div>
    </div>
  </Block>
</template>
<script setup>
  import Block from "../Block.vue";

  const props = defineProps({
    projectData: Object,
  });
</script>

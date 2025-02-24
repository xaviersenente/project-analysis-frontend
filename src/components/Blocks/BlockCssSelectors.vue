<template>
  <Block title="Sélecteurs" class="col-span-12 lg:col-span-8">
    <template v-slot:header>
      <div class="flex gap-4">
        <div>
          <div class="text-xs uppercase">Total</div>
          <div class="text-xl font-bold">
            {{ props.projectData.cssAnalysisResult.selectors.total }}
          </div>
        </div>
        <div>
          <div class="text-xs uppercase">Unique</div>
          <div class="text-xl font-bold">
            {{ props.projectData.cssAnalysisResult.selectors.totalUnique }}
          </div>
        </div>
        <div>
          <div class="text-xs uppercase">Écart</div>
          <div
            class="text-xl font-bold"
            :class="{
              'text-green-600': gapSelector <= 10,
              'text-yellow-500': gapSelector > 10 && gapSelector <= 25,
              'text-orange-500': gapSelector > 25 && gapSelector <= 40,
              'text-red-500': gapSelector > 40,
            }"
          >
            {{ gapSelector }}%
          </div>
        </div>
      </div>
    </template>
    <div class="grid gap-8 lg:grid-cols-2 items-start">
      <TableMeter
        :data="props.projectData.cssAnalysisResult.selectors.specificity.unique"
        headerLabel="Spécificité"
      />
      <TableMeter
        :data="props.projectData.cssAnalysisResult.selectors.complexity.unique"
        headerLabel="Complexité"
      />
    </div>
    <Infos
      v-if="
        gapSelector > 10 ||
        isSpecificityAboveThreshold ||
        hasIdOrHigherSpecificity
      "
      class="flex flex-col gap-2"
    >
      <p v-if="gapSelector > 15">
        L'écart entre le nombre de sélecteur total et unique indique que vous
        pouvez encore améliorer votre usage de la méthodologie BEM.
      </p>
      <p v-if="isSpecificityAboveThreshold">
        Le faible nombre de spécificité <code>0,0,1</code> indique que vous
        n'avez pas déclaré suffisamment de styles généraux (<code>body</code>,
        <code>h1</code>, <code>h2</code>, <code>p</code>, <code>a</code> …)
      </p>
      <p v-if="hasIdOrHigherSpecificity">
        Le niveau de spécificité commençant par le chiffre 1 (ou supérieur)
        indique que vous avez utilisé des ID dans vos css, ce qui est
        déconseillé.
      </p>
    </Infos>
  </Block>
</template>

<script setup>
  import Block from "../Block.vue";
  import TableMeter from "../TableMeter.vue";
  import Infos from "../Infos.vue";
  import { gap } from "../../js/helpers";
  import { computed } from "vue";

  // Props attendues depuis le parent
  const props = defineProps({
    projectData: Object,
  });

  // Écart pour les sélecteurs (réactif avec computed)
  const gapSelector = computed(() =>
    gap(
      props.projectData.cssAnalysisResult.selectors.total,
      props.projectData.cssAnalysisResult.selectors.totalUnique
    )
  );

  // Vérifier si "0,0,1" est supérieur à 5
  const isSpecificityAboveThreshold = computed(() => {
    const specificity =
      props.projectData.cssAnalysisResult.selectors.specificity.unique;
    return specificity["0,0,1"] < 5;
  });

  // Vérifier la présence de sélecteurs avec une spécificité d'ID ou plus (1,…,… ou supérieur)
  const hasIdOrHigherSpecificity = computed(() => {
    const specificity =
      props.projectData.cssAnalysisResult.selectors.specificity.unique;

    // Parcourir les clés et vérifier si au moins une commence par "1," ou plus
    return Object.keys(specificity).some((key) => {
      const [idPart] = key.split(",").map(Number); // Extraire le premier nombre
      return idPart >= 1; // Vérifier si le premier nombre est >= 1
    });
  });
</script>

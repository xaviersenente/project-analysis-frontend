<template>
  <Block
    title="Analyse des Classes CSS"
    desc="Cette analyse évalue la qualité et l'organisation de vos classes CSS
        selon la méthodologie BEM (Block Element Modifier) et
        l'efficacité de leur utilisation.">
    <div class="space-y-6">
      <div class="grid grid-cols-2 gap-8">
        <!-- Couverture HTML -->
        <Section
          title="Couverture HTML"
          definition="Classes HTML ayant une définition CSS"
          suffix="%"
          :value="Math.round(classAnalysis.mismatch.coverageHtml * 100)">
        </Section>

        <!-- Couverture CSS -->
        <Section
          title="Couverture CSS"
          definition="Classes CSS utilisées dans le HTML"
          suffix="%"
          :value="Math.round(classAnalysis.mismatch.coverageCss * 100)">
        </Section>
      </div>

      <div class="grid grid-cols-2 gap-8 md:grid-cols-3 2xl:grid-cols-6">
        <Section
          title="Sélecteurs"
          size="sm"
          subtitle="(Total / Pure BEM)"
          rightText="BEM"
          :value="classAnalysis.css.totalSelectors"
          :additionalValue="classAnalysis.css.selectorForms.pureBemSelectors"
          :rightValue="`${Math.round(
            (classAnalysis.css.selectorForms.pureBemSelectors /
              classAnalysis.css.totalSelectors) *
              100
          )}%`">
        </Section>
        <Section
          title="Blocs"
          subtitle="(Total / Structurés)"
          size="sm"
          rightText="Struct."
          :value="classAnalysis.bem.blockStructure.totalBlocks"
          :additionalValue="classAnalysis.bem.blockStructure.structuredBlocks"
          :rightValue="`${Math.round(
            (classAnalysis.bem.blockStructure.structuredBlocks /
              classAnalysis.bem.blockStructure.totalBlocks) *
              100
          )}%`">
        </Section>
        <Section
          title="Blocs Implicites"
          size="sm"
          :value="
            classAnalysis.bem.blockStructure.implicitBlocks?.length || 0
          " />
        <Section
          size="sm"
          title="Éléments"
          :value="classAnalysis.bem.counts.elements" />
        <Section
          title="Modificateurs (Blocs)"
          size="sm"
          :value="classAnalysis.bem.counts.modifiers" />
        <Section
          title="Modificateurs (Éléments)"
          size="sm"
          :value="classAnalysis.bem.counts.elementModifiers" />
      </div>
    </div>

    <!-- Boutons pour modales -->
    <div class="mt-6 flex flex-wrap gap-8">
      <Button text="Structure BEM détaillée" @open="openBemModal" size="md" />
      <Button
        v-if="
          classAnalysis.mismatch.unusedCssClasses.length > 0 ||
          classAnalysis.mismatch.undefinedHtmlClasses.length > 0
        "
        text="Classes non utilisées"
        @open="openMismatchModal"
        size="md" />
    </div>

    <!-- Recommandations -->
    <Infos
      v-if="scoreBreakdown || scoreImprovements.length > 0"
      :twoColumns="true">
      <template #summary>
        <ul class="list-disc list-inside">
          <li v-for="(item, key) in scoreBreakdown" :key="key">
            {{ item.details }}
          </li>
        </ul>
      </template>

      <template v-if="scoreImprovements.lenght > 0" #recommendations>
        <ul class="list-disc list-inside">
          <li v-for="(improvement, idx) in scoreImprovements" :key="idx">
            {{ improvement }}
          </li>
        </ul>
      </template>
    </Infos>

    <!-- Modal Structure BEM -->
    <Modal
      :isOpen="isBemModalOpen"
      title="Structure BEM détaillée"
      @close="closeBemModal"
      size="w-[calc(100vw-60px)]">
      <BlockClassesBem :classAnalysis="classAnalysis" />
    </Modal>

    <!-- Modal Classes non utilisées -->
    <Modal
      :isOpen="isMismatchModalOpen"
      title="Classes non utilisées et non définies"
      @close="closeMismatchModal">
      <BlockClassesMismatch :classAnalysis="classAnalysis" />
    </Modal>
  </Block>
</template>

<script setup>
import { computed, ref } from "vue";
import Block from "../Block.vue";
import Section from "../Section.vue";
import Button from "../Button.vue";
import Modal from "../Modal.vue";
import Infos from "../Infos.vue";
import BlockClassesBem from "./BlockClassesBem.vue";
import BlockClassesMismatch from "./BlockClassesMismatch.vue";

const props = defineProps({
  classAnalysis: Object,
});

const isBemModalOpen = ref(false);
const isMismatchModalOpen = ref(false);

const openBemModal = () => {
  isBemModalOpen.value = true;
};

const closeBemModal = () => {
  isBemModalOpen.value = false;
};

const openMismatchModal = () => {
  isMismatchModalOpen.value = true;
};

const closeMismatchModal = () => {
  isMismatchModalOpen.value = false;
};

// Score BEM
const scoreBreakdown = computed(
  () => props.classAnalysis.score?.bem?.breakdown || {}
);
const scoreImprovements = computed(
  () => props.classAnalysis.score?.bem?.improvements || []
);
</script>

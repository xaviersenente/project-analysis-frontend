<template>
  <Block
    title="Analyse des Classes CSS"
    desc="Cette analyse évalue la qualité et l'organisation de vos classes CSS
        selon la méthodologie BEM (Block Element Modifier) et
        l'efficacité de leur utilisation."
    class="col-span-12 lg:col-span-6 xl:col-span-8">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <Section
        title="Conformité BEM"
        definition="Pourcentage de classes suivant la convention BEM
          (bloc__élément--modificateur)">
        <ProgressCircle :value="classAnalysis.bem.ratios.bemClassesRatio" />
        <div class="text-center text-sm text-gray-600">
          {{ classAnalysis.bem.counts.blocks }} blocs,
          {{ classAnalysis.bem.counts.elements }} éléments
        </div>
      </Section>

      <div class="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Couverture HTML -->
        <Section
          title="Couverture HTML"
          :value="Math.round(classAnalysis.mismatch.coverageHtml * 100)"
          definition="% de classes HTML ayant une définition CSS"
          size="sm">
          <Tag :value="classAnalysis.mismatch.coverageHtml" />
        </Section>

        <!-- Couverture CSS -->
        <Section
          title="Couverture CSS"
          :value="Math.round(classAnalysis.mismatch.coverageCss * 100)"
          definition="% de classes CSS utilisées dans le HTML"
          size="sm">
          <Tag :value="classAnalysis.mismatch.coverageCss" />
        </Section>

        <!-- Profondeur BEM -->
        <Section
          title="Profondeur BEM"
          subtitle="(Moy / Max)"
          definition="Nombre de niveaux de hiérarchie (bloc &gt; élément &gt; modificateur).
            Idéal : ≤ 2"
          :value="classAnalysis.bem.depth.average.toFixed(1)"
          :additionalValue="classAnalysis.bem.depth.max"
          size="sm">
          <div
            :class="getDepthClass(classAnalysis.bem.depth.average)"
            class="text-sm font-semibold">
            {{ getDepthLabel(classAnalysis.bem.depth.average) }}
          </div>
        </Section>

        <!-- Classes par nœud -->
        <Section
          title="Classes / Nœud"
          subtitle="(Moy / Max)"
          definition="Nombre moyen de classes par élément HTML. Idéal : 1-2"
          :value="classAnalysis.html.averageClassesPerNode.toFixed(1)"
          :additionalValue="classAnalysis.html.maxClassesPerNode"
          size="sm">
          <div
            :class="getNodeLoadClass(classAnalysis.html.averageClassesPerNode)"
            class="text-sm font-semibold">
            {{ getNodeLoadLabel(classAnalysis.html.averageClassesPerNode) }}
          </div>
        </Section>
      </div>
    </div>

    <!-- Classes non utilisées / non définies -->
    <div
      v-if="
        classAnalysis.mismatch.unusedCssClasses.length > 0 ||
        classAnalysis.mismatch.undefinedHtmlClasses.length > 0
      "
      class="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-if="classAnalysis.mismatch.unusedCssClasses.length > 0">
          <h6 class="font-semibold text-sm text-orange-700 mb-2">
            Classes CSS non utilisées ({{
              classAnalysis.mismatch.unusedCssClasses.length
            }})
          </h6>
          <div class="flex flex-wrap gap-2">
            <code
              v-for="cls in classAnalysis.mismatch.unusedCssClasses"
              :key="cls"
              class="text-xs bg-white px-2 py-1 rounded border border-orange-300">
              {{ cls }}
            </code>
          </div>
        </div>
        <div v-if="classAnalysis.mismatch.undefinedHtmlClasses.length > 0">
          <h6 class="font-semibold text-sm text-orange-700 mb-2">
            Classes HTML sans CSS ({{
              classAnalysis.mismatch.undefinedHtmlClasses.length
            }})
          </h6>
          <div class="flex flex-wrap gap-2">
            <code
              v-for="cls in classAnalysis.mismatch.undefinedHtmlClasses.slice(
                0,
                10
              )"
              :key="cls"
              class="text-xs bg-white px-2 py-1 rounded border border-orange-300">
              {{ cls }}
            </code>
            <button
              v-if="classAnalysis.mismatch.undefinedHtmlClasses.length > 10"
              @click="openMismatchModal"
              class="text-xs text-blue-600 hover:underline">
              +{{ classAnalysis.mismatch.undefinedHtmlClasses.length - 10 }}
              autres...
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Boutons pour modales -->
    <div class="mt-6 flex flex-wrap gap-4">
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

    <!-- Modal Structure BEM -->
    <Modal
      :isOpen="isBemModalOpen"
      title="Structure BEM détaillée"
      @close="closeBemModal"
      size="large">
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
import { ref } from "vue";
import Block from "../Block.vue";
import Section from "../Section.vue";
import Tag from "../Tag.vue";
import ProgressCircle from "../ProgressCircle.vue";
import Button from "../Button.vue";
import Modal from "../Modal.vue";
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

// Fonction pour déterminer la classe de couleur de la profondeur BEM
const getDepthClass = (depth) => {
  if (depth <= 2) return "text-green-600";
  if (depth <= 2.5) return "text-yellow-500";
  return "text-orange-500";
};

const getDepthLabel = (depth) => {
  if (depth <= 2) return "Excellent";
  if (depth <= 2.5) return "Bon";
  return "À améliorer";
};

// Fonction pour déterminer la classe de couleur du nombre de classes par nœud
const getNodeLoadClass = (avg) => {
  if (avg <= 1.5) return "text-green-600";
  if (avg <= 2) return "text-yellow-500";
  return "text-orange-500";
};

const getNodeLoadLabel = (avg) => {
  if (avg <= 1.5) return "Excellent";
  if (avg <= 2) return "Bon";
  return "Élevé";
};
</script>

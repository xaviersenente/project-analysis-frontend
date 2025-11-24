<template>
  <div class="space-y-6">
    <!-- Statistiques BEM -->
    <div
      class="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-blue-50 rounded-lg">
      <div>
        <div class="text-xs text-gray-600 uppercase">Blocs</div>
        <div class="text-2xl font-bold text-blue-600">
          {{ classAnalysis.bem.counts.blocks }}
        </div>
      </div>
      <div>
        <div class="text-xs text-gray-600 uppercase">Éléments</div>
        <div class="text-2xl font-bold text-blue-600">
          {{ classAnalysis.bem.counts.elements }}
        </div>
      </div>
      <div>
        <div class="text-xs text-gray-600 uppercase">Modificateurs</div>
        <div class="text-2xl font-bold text-blue-600">
          {{ classAnalysis.bem.counts.modifiers }}
        </div>
      </div>
      <div>
        <div class="text-xs text-gray-600 uppercase">Mod. d'éléments</div>
        <div class="text-2xl font-bold text-blue-600">
          {{ classAnalysis.bem.counts.elementModifiers }}
        </div>
      </div>
    </div>

    <!-- Violations BEM -->
    <div
      v-if="
        classAnalysis.bem.violations && classAnalysis.bem.violations.length > 0
      "
      class="p-4 bg-red-50 border border-red-200 rounded-lg">
      <h4 class="font-semibold text-red-700 mb-2">
        ⚠️ Violations BEM détectées
      </h4>
      <ul class="list-disc list-inside space-y-1">
        <li
          v-for="(violation, index) in classAnalysis.bem.violations"
          :key="index"
          class="text-sm text-red-600">
          {{ violation }}
        </li>
      </ul>
    </div>

    <!-- Distribution des préfixes -->
    <div v-if="Object.keys(classAnalysis.distribution.prefixes).length > 0">
      <h4 class="font-semibold mb-3 text-lg">
        Distribution des préfixes de classes
      </h4>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        <div
          v-for="(count, prefix) in sortedPrefixes"
          :key="prefix"
          class="bg-gray-100 p-3 rounded-lg">
          <div class="text-sm font-medium text-gray-700">{{ prefix }}</div>
          <div class="text-xl font-bold text-gray-900">{{ count }}</div>
        </div>
      </div>
      <div class="mt-3 text-sm text-gray-600">
        <strong>Entropie :</strong>
        {{ classAnalysis.distribution.entropy.toFixed(2) }} (diversité des
        préfixes)
      </div>
    </div>

    <!-- Structure des blocs BEM -->
    <div>
      <h4 class="font-semibold mb-3 text-lg">
        Structure des blocs BEM ({{
          Object.keys(classAnalysis.bem.blocks).length
        }})
      </h4>
      <div class="space-y-2">
        <details
          v-for="(block, blockName) in sortedBlocks"
          :key="blockName"
          class="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <summary
            class="cursor-pointer p-3 hover:bg-gray-50 font-medium flex justify-between items-center">
            <span class="text-blue-700">{{ blockName }}</span>
            <span class="text-xs text-gray-500">
              {{
                block.elements.length +
                block.modifiers.length +
                block.elementModifiers.length
              }}
              classes
            </span>
          </summary>
          <div class="p-4 bg-gray-50 space-y-3">
            <!-- Éléments -->
            <div v-if="block.elements.length > 0">
              <div class="text-xs font-semibold text-gray-600 uppercase mb-2">
                Éléments ({{ block.elements.length }})
              </div>
              <div class="flex flex-wrap gap-2">
                <code
                  v-for="element in block.elements"
                  :key="element"
                  class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {{ element }}
                </code>
              </div>
            </div>

            <!-- Modificateurs -->
            <div v-if="block.modifiers.length > 0">
              <div class="text-xs font-semibold text-gray-600 uppercase mb-2">
                Modificateurs ({{ block.modifiers.length }})
              </div>
              <div class="flex flex-wrap gap-2">
                <code
                  v-for="modifier in block.modifiers"
                  :key="modifier"
                  class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  {{ modifier }}
                </code>
              </div>
            </div>

            <!-- Modificateurs d'éléments -->
            <div v-if="block.elementModifiers.length > 0">
              <div class="text-xs font-semibold text-gray-600 uppercase mb-2">
                Modificateurs d'éléments ({{ block.elementModifiers.length }})
              </div>
              <div class="flex flex-wrap gap-2">
                <code
                  v-for="modifier in block.elementModifiers"
                  :key="modifier"
                  class="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                  {{ modifier }}
                </code>
              </div>
            </div>

            <!-- Si le bloc n'a aucun élément/modificateur -->
            <div
              v-if="
                block.elements.length === 0 &&
                block.modifiers.length === 0 &&
                block.elementModifiers.length === 0
              "
              class="text-sm text-gray-500 italic">
              Bloc sans éléments ni modificateurs
            </div>
          </div>
        </details>
      </div>
    </div>

    <!-- Classes utilitaires -->
    <div
      v-if="classAnalysis.distribution.utilityClassesRatio > 0"
      class="p-4 bg-indigo-50 rounded-lg">
      <h4 class="font-semibold text-indigo-900 mb-2">Classes utilitaires</h4>
      <div class="text-sm text-indigo-700">
        Ratio :
        {{ (classAnalysis.distribution.utilityClassesRatio * 100).toFixed(1) }}%
        <span class="text-xs text-indigo-600 ml-2">
          ({{
            getUtilityRatioLabel(
              classAnalysis.distribution.utilityClassesRatio
            )
          }})
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  classAnalysis: Object,
});

// Trier les blocs par nombre total de classes (décroissant)
const sortedBlocks = computed(() => {
  const blocks = props.classAnalysis.bem.blocks;
  return Object.fromEntries(
    Object.entries(blocks).sort((a, b) => {
      const countA =
        a[1].elements.length +
        a[1].modifiers.length +
        a[1].elementModifiers.length;
      const countB =
        b[1].elements.length +
        b[1].modifiers.length +
        b[1].elementModifiers.length;
      return countB - countA;
    })
  );
});

// Trier les préfixes par nombre (décroissant)
const sortedPrefixes = computed(() => {
  const prefixes = props.classAnalysis.distribution.prefixes;
  return Object.fromEntries(
    Object.entries(prefixes).sort((a, b) => b[1] - a[1])
  );
});

// Label pour le ratio de classes utilitaires
const getUtilityRatioLabel = (ratio) => {
  if (ratio < 0.05) return "Peu de classes utilitaires";
  if (ratio < 0.15) return "Bon équilibre";
  if (ratio < 0.3) return "Usage modéré";
  return "Usage important";
};
</script>

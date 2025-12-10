<template>
  <div class="space-y-6">
    <!-- Résumé -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div class="p-4 bg-green-50 rounded-lg">
        <div class="text-xs text-slate-600 uppercase">Couverture HTML</div>
        <div class="text-2xl font-bold text-green-700">
          {{ Math.round(classAnalysis.mismatch.coverageHtml * 100) }}%
        </div>
        <div class="text-xs text-slate-600 mt-1">
          Proportion de classes HTML ayant une définition CSS
        </div>
      </div>
      <div class="p-4 bg-blue-50 rounded-lg">
        <div class="text-xs text-slate-600 uppercase">Couverture CSS</div>
        <div class="text-2xl font-bold text-blue-700">
          {{ Math.round(classAnalysis.mismatch.coverageCss * 100) }}%
        </div>
        <div class="text-xs text-slate-600 mt-1">
          Proportion de classes CSS utilisées dans le HTML
        </div>
      </div>
    </div>

    <!-- Classes CSS non utilisées dans le HTML -->
    <div v-if="classAnalysis.mismatch.unusedCssClasses.length > 0">
      <div
        class="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-t-lg">
        <h4 class="font-semibold text-orange-900">
          Classes CSS non utilisées dans le HTML
        </h4>
        <span class="text-sm font-bold text-orange-700">
          {{ classAnalysis.mismatch.unusedCssClasses.length }}
        </span>
      </div>
      <div
        class="p-4 bg-white border border-t-0 border-orange-200 rounded-b-lg">
        <p class="text-sm text-slate-600 mb-3">
          Ces classes sont définies dans le CSS mais n'apparaissent dans aucune
          page HTML analysée. Elles peuvent être supprimées pour optimiser le
          code.
        </p>
        <div class="flex flex-wrap gap-2">
          <code
            v-for="cls in classAnalysis.mismatch.unusedCssClasses"
            :key="cls"
            class="text-sm bg-orange-100 text-orange-800 px-3 py-1 rounded border border-orange-300 font-mono">
            .{{ cls }}
          </code>
        </div>
      </div>
    </div>

    <!-- Message de succès si aucune classe CSS inutilisée -->
    <div
      v-else
      class="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
      <span class="text-2xl">✓</span>
      <div>
        <h4 class="font-semibold text-green-900">
          Excellent ! Aucune classe CSS inutilisée
        </h4>
        <p class="text-sm text-green-700">
          Toutes les classes CSS définies sont utilisées dans le HTML.
        </p>
      </div>
    </div>

    <!-- Classes HTML sans définition CSS -->
    <div v-if="classAnalysis.mismatch.undefinedHtmlClasses.length > 0">
      <div
        class="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-t-lg">
        <h4 class="font-semibold text-amber-900">
          Classes HTML sans définition CSS
        </h4>
        <span class="text-sm font-bold text-amber-700">
          {{ classAnalysis.mismatch.undefinedHtmlClasses.length }}
        </span>
      </div>
      <div class="p-4 bg-white border border-t-0 border-amber-200 rounded-b-lg">
        <p class="text-sm text-slate-600 mb-3">
          Ces classes apparaissent dans le HTML mais ne sont pas définies dans
          le CSS. Elles peuvent provenir de frameworks JavaScript, de classes
          dynamiques ou être des erreurs.
        </p>
        <div class="flex flex-wrap gap-2">
          <code
            v-for="cls in classAnalysis.mismatch.undefinedHtmlClasses"
            :key="cls"
            class="text-sm bg-amber-100 text-amber-800 px-3 py-1 rounded border border-amber-300 font-mono">
            .{{ cls }}
          </code>
        </div>
      </div>
    </div>

    <!-- Message de succès si toutes les classes HTML ont du CSS -->
    <div
      v-else
      class="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
      <span class="text-2xl">✓</span>
      <div>
        <h4 class="font-semibold text-green-900">
          Parfait ! Toutes les classes HTML sont stylées
        </h4>
        <p class="text-sm text-green-700">
          Chaque classe utilisée dans le HTML possède une définition CSS
          correspondante.
        </p>
      </div>
    </div>

    <!-- Analyse de la fréquence des classes -->
    <div v-if="topFrequentClasses.length > 0">
      <h4 class="font-semibold mb-3 text-lg">Classes les plus fréquentes</h4>
      <div class="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-slate-50">
            <tr>
              <th class="text-left p-3 font-semibold text-slate-700">Classe</th>
              <th class="text-right p-3 font-semibold text-slate-700">
                Fréquence
              </th>
              <th class="text-right p-3 font-semibold text-slate-700">
                Utilisation
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr v-for="(item, index) in topFrequentClasses" :key="item.name">
              <td class="p-3">
                <code class="text-sm bg-slate-100 px-2 py-1 rounded">{{
                  item.name
                }}</code>
              </td>
              <td class="p-3 text-right font-mono">{{ item.count }}</td>
              <td class="p-3 text-right">
                <div class="flex items-center justify-end gap-2">
                  <div
                    class="h-2 bg-blue-500 rounded"
                    :style="{
                      width: (item.count / maxFrequency) * 100 + '%',
                      minWidth: '4px',
                    }"></div>
                  <span class="text-xs text-slate-500 w-12"
                    >{{ ((item.count / maxFrequency) * 100).toFixed(0) }}%</span
                  >
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  classAnalysis: Object,
});

// Top 10 des classes les plus fréquentes
const topFrequentClasses = computed(() => {
  const frequency = props.classAnalysis.html.frequency;
  return Object.entries(frequency)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
});

// Fréquence maximale pour calculer les pourcentages
const maxFrequency = computed(() => {
  if (topFrequentClasses.value.length === 0) return 1;
  return topFrequentClasses.value[0].count;
});
</script>

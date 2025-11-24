<template>
  <Block
    title="Typographie"
    desc="Analyse typographique : familles, tailles, line-height, variantes et échelle de texte."
    class="col-span-12 2xl:col-span-8">
    <div class="grid gap-8 items-start lg:grid-cols-3">
      <!-- Font-Family -->
      <div>
        <div class="flex gap-4 justify-between mb-4">
          <h4 class="text-lg">Font-family</h4>
          <div class="flex gap-4">
            <div>
              <div class="text-xs uppercase">Total</div>
              <div class="text-xl font-bold">
                {{ cssAnalysisResult?.fontFamilies?.total }}
              </div>
            </div>
            <div>
              <div class="text-xs uppercase">Unique</div>
              <div class="text-xl font-bold">
                {{ cssAnalysisResult?.fontFamilies?.totalUnique }}
              </div>
            </div>
          </div>
        </div>
        <table
          class="min-w-full table-auto border-collapse text-left text-xs lg:text-sm">
          <thead>
            <tr class="bg-gray-100 *:px-3 *:py-2">
              <th>Valeur</th>
              <th>Nb</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(count, font) in cssAnalysisResult?.fontFamilies?.unique"
              :key="font"
              class="hover:bg-gray-50 transition-colors *:px-3 *:py-2 *:border-b">
              <td class="font-mono">{{ font }}</td>
              <td class="font-mono">{{ count }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Font-Size -->
      <div>
        <div class="flex gap-4 justify-between mb-4">
          <h4 class="text-lg">Font-size</h4>
          <div class="flex gap-4">
            <div>
              <div class="text-xs uppercase">Total</div>
              <div class="text-xl font-bold">
                {{ cssAnalysisResult?.fontSizes?.total }}
              </div>
            </div>
            <div>
              <div class="text-xs uppercase">Unique</div>
              <div class="text-xl font-bold">
                {{ cssAnalysisResult?.fontSizes?.totalUnique }}
              </div>
            </div>
          </div>
        </div>
        <table
          class="min-w-full table-auto border-collapse text-left text-xs lg:text-sm">
          <thead>
            <tr class="bg-gray-100 *:px-3 *:py-2">
              <th>Valeur</th>
              <th>Nb</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(count, font) in cssAnalysisResult?.fontSizes?.unique"
              :key="font"
              class="hover:bg-gray-50 transition-colors *:px-3 *:py-2 *:border-b">
              <td class="font-mono">{{ font }}</td>
              <td class="font-mono">{{ count }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Google Fonts -->
      <div>
        <h3 class="text-lg mb-4">Google Fonts</h3>
        <ul v-if="fonts.length > 0">
          <li v-for="font in fonts" :key="font" class="mt-4">
            <p class="text-slate-500 border-b border-b-slate-300 pb-1 mb-1">
              {{ font }}
            </p>
            <p class="text-4xl" :style="{ fontFamily: font }">Hamburgevons</p>
          </li>
        </ul>
        <p v-else>Aucune Google fonte</p>
      </div>
    </div>

    <Infos
      v-if="
        hasNonCssVariableFontFamily ||
        hasNonCssVariableFontSize ||
        props.fonts.length > 3
      ">
      <p v-if="hasNonCssVariableFontFamily">
        Définisez les polices de caractère (<code>font-family</code>) en
        utilisant plutôt des variables.
      </p>
      <p v-if="hasNonCssVariableFontSize">
        Définisez les tailles de police de caractère (<code>font-size</code>) en
        utilisant plutôt des variables.
      </p>
      <p v-if="props.fonts.length > 3">
        Attention à ne pas charger / utiliser trop de polices de caractères
        différentes.
      </p>
    </Infos>
  </Block>
</template>

<script setup>
import { computed } from "vue";
import Infos from "../Infos.vue";
import Block from "../Block.vue";

const props = defineProps({
  cssAnalysisResult: {
    type: Object,
    required: true,
  },
  fonts: {
    type: Array,
    default: () => [],
  },
});

// Fonction utilitaire pour vérifier si une valeur est une variable CSS
function isCssVariable(value) {
  return /^var\(.+\)$/.test(value);
}

// Vérifier si au moins une valeur n'est pas une variable CSS
const hasNonCssVariableFontFamily = computed(() => {
  return Object.keys(props.cssAnalysisResult?.fontFamilies?.unique || {}).some(
    (font) => !isCssVariable(font)
  );
});
const hasNonCssVariableFontSize = computed(() => {
  return Object.keys(props.cssAnalysisResult?.fontSizes?.unique || {}).some(
    (font) => !isCssVariable(font)
  );
});
</script>

<template>
  <Block
    title="Variables CSS"
    desc="Utilisation des variables en CSS (déclaration, utilisation, catégories…)">
    <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
      <Section
        title="Total"
        subtitle="(Déclarées / Utilisées)"
        rightText="Écart"
        :value="customProps.totalDeclared"
        :textClass="getVariablesClass()"
        :additionalValue="customProps.totalUsed"
        :rightValue="gapSelector"
        :rightClass="getGapClass(gapSelector, 'selector')" />

      <Section
        title="Déclarations"
        subtitle="(Total / Avec var())"
        rightText="Écart"
        :value="totalDeclarations"
        :additionalValue="customProps.ratio?.variableUsages"
        :rightValue="gapDeclarations"
        :rightClass="getGapClass(gapDeclarations, 'declarations')" />

      <Section
        title="Non déclarées"
        :value="customProps.totalUndeclared"
        :textClass="getUndeclaredClass()" />
    </div>

    <!-- Liste des variables par catégorie -->
    <div class="mt-8 space-y-6">
      <DistributionDetails
        :data="detailedCategorization"
        summary="Voir la distribution complète des variables"
        :open="false">
        <div
          class="grid grid-flow-dense grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <!-- Catégories de variables -->
          <div
            v-for="category in VARIABLE_CATEGORIES"
            v-show="filteredCategories[category.key]"
            :key="category.key">
            <h5
              class="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
              {{ category.label }} ({{
                filteredCategories[category.key]?.length
              }})
            </h5>
            <div class="space-y-2">
              <PropertyBar
                v-for="variable in filteredCategories[category.key]"
                :key="variable.name"
                :label="variable.name"
                :count="variable.usageCount"
                :maxCount="maxUsageCount"
                :barColor="getBarColor(variable.usageCount)"
                :class="variable.usageCount === 0 ? 'text-red-600' : ''" />
            </div>
          </div>

          <!-- Non déclarées -->
          <div v-if="undeclaredVariables.length > 0">
            <h5
              class="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
              Non déclarées
            </h5>
            <div class="space-y-2">
              <div
                v-for="variable in undeclaredVariables"
                :key="variable.name"
                class="flex items-center gap-2">
                <span class="font-mono text-xs text-red-700">{{
                  variable.name
                }}</span>
                <span
                  v-if="variable.fallback"
                  class="text-xs text-red-500 italic"
                  >(fallback: {{ variable.fallback }})</span
                >
              </div>
            </div>
          </div>
        </div>
      </DistributionDetails>

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
    </div>
  </Block>
</template>

<script setup>
import { computed } from "vue";
import { gap } from "../../js/helpers";
import Block from "../Block.vue";
import Section from "../Section.vue";
import DistributionDetails from "../DistributionDetails.vue";
import PropertyBar from "../PropertyBar.vue";
import Infos from "../Infos.vue";

const props = defineProps({
  projectData: Object,
});

const customProps = computed(() => props.projectData || {});

const VARIABLE_CATEGORIES = [
  { key: "color", label: "Couleurs" },
  { key: "typography", label: "Typographie" },
  { key: "spacing", label: "Espacements" },
  { key: "layout", label: "Layout" },
  { key: "zIndex", label: "Z-Index" },
  { key: "radius", label: "Rayons" },
  { key: "other", label: "Autres" },
];

const gapSelector = computed(() =>
  gap(customProps.value.totalDeclared, customProps.value.totalUsed)
);

// Calcul du total des déclarations (rawProperties + variableUsages)
const totalDeclarations = computed(() => {
  const rawProps = customProps.value.ratio?.rawProperties || 0;
  const varUsages = customProps.value.ratio?.variableUsages || 0;
  return rawProps + varUsages;
});

const gapDeclarations = computed(() =>
  gap(totalDeclarations.value, customProps.value.ratio?.variableUsages)
);

// Fonction pour déterminer la classe en fonction de la valeur d'écart
const getGapClass = (gapValue, type = "selector") => {
  const numericValue = parseFloat(gapValue);

  if (type === "selector") {
    // Pour gapSelector
    if (numericValue === 0) return "text-red-500";
    if (numericValue <= 10) return "text-green-600";
    if (numericValue <= 25) return "text-yellow-500";
    if (numericValue <= 40) return "text-orange-500";
    return "text-red-500";
  } else if (type === "declarations") {
    // Pour gapDeclarations
    if (numericValue <= 70) return "text-green-600";
    if (numericValue <= 80) return "text-yellow-500";
    if (numericValue <= 90) return "text-orange-500";
    return "text-red-500";
  }

  return "text-gray-600";
};

// Fonction pour déterminer la classe des variables non déclarées
const getUndeclaredClass = () => {
  const count = customProps.value.totalUndeclared || 0;
  if (count === 0) return "text-green-600";
  if (count < 5) return "text-orange-500";
  return "text-red-500";
};

// Fonction pour déterminer la classe des variables déclarées
const getVariablesClass = () => {
  const count = customProps.value.totalDeclared || 0;
  if (count === 0) return "text-red-500";
  if (count < 10) return "text-orange-500";
};

// Exposer le score pour utilisation externe
defineExpose({
  variablesScore,
});

// Récupération des catégories détaillées
const detailedCategorization = computed(
  () => customProps.value.detailedCategorization || {}
);

// Filtrer les catégories non vides
const filteredCategories = computed(() => {
  const categories = {};
  Object.entries(detailedCategorization.value).forEach(([key, value]) => {
    if (Array.isArray(value) && value.length > 0) {
      categories[key] = value;
    }
  });
  return categories;
});

// Variables non déclarées
const undeclaredVariables = computed(
  () => customProps.value.undeclaredUsages || []
);

// Calcul du nombre max d'utilisations pour normaliser les barres
const maxUsageCount = computed(() => {
  let max = 0;
  Object.values(detailedCategorization.value).forEach((category) => {
    if (Array.isArray(category)) {
      category.forEach((variable) => {
        if (variable.usageCount > max) {
          max = variable.usageCount;
        }
      });
    }
  });
  return max || 1; // Éviter division par 0
});

// Couleur de la barre uniforme
const getBarColor = (count) => {
  return "bg-gray-700";
};

// Recommandations depuis le score
const scoreImprovements = computed(
  () => customProps.value.score?.improvements || []
);

// Breakdown du score
const scoreBreakdown = computed(() => customProps.value.score?.breakdown || {});

// Formater les noms de critères
const formatScoreName = (key) => {
  const names = {
    adoption: "Adoption",
    coverage: "Couverture",
    hygiene: "Hygiène",
    categories: "Catégories",
    bestPractices: "Bonnes pratiques",
  };
  return names[key] || key;
};

// ============ Recommandations ============

// Nombre de variables déclarées
// const declaredCount = computed(() => customProps.value.totalDeclared || 0);

// Nombre de variables non déclarées
// const undeclaredCount = computed(() => customProps.value.totalUndeclared || 0);

// 1. Recommandation : Déclarer plus de variables (si < 10)
// const shouldDeclareMoreVariables = computed(() => declaredCount.value < 10);

// 2. Recommandation : Utiliser davantage les variables déclarées (si écart > 40%)
// const unusedPercentage = computed(() => {
//   const gapValue = parseFloat(gapSelector.value);
//   return Math.round(gapValue);
// });
// const shouldUseMoreVariables = computed(() => {
//   return declaredCount.value >= 5 && unusedPercentage.value > 40;
// });

// 3. Recommandation : Augmenter l'usage de var() (si écart > 80%)
// const varUsagePercent = computed(() => {
//   const gapValue = parseFloat(gapDeclarations.value);
//   return Math.round(100 - gapValue);
// });
// const shouldUseMoreVarFunction = computed(() => {
//   const gapValue = parseFloat(gapDeclarations.value);
//   return gapValue > 80;
// });

// 4. Recommandation : Variables non déclarées détectées
// const hasUndeclaredVariables = computed(() => undeclaredCount.value > 0);

// 5. Recommandation : Diversifier les catégories (si < 4 catégories)
// const activeCategoriesCount = computed(() => {
//   const categories = [
//     "color",
//     "typography",
//     "spacing",
//     "layout",
//     "zIndex",
//     "radius",
//   ];
//   let count = 0;
//   categories.forEach((cat) => {
//     if (
//       detailedCategorization.value[cat] &&
//       Array.isArray(detailedCategorization.value[cat]) &&
//       detailedCategorization.value[cat].length > 0
//     ) {
//       count++;
//     }
//   });
//   return count;
// });
// const shouldDiversifyCategories = computed(
//   () => activeCategoriesCount.value < 4
// );

// Afficher le bloc de recommandations si au moins une recommandation est présente
// const hasRecommendations = computed(
//   () =>
//     shouldDeclareMoreVariables.value ||
//     shouldUseMoreVariables.value ||
//     shouldUseMoreVarFunction.value ||
//     hasUndeclaredVariables.value ||
//     shouldDiversifyCategories.value
// );
</script>

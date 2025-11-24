<template>
  <Block
    title="Sélecteurs"
    desc="Répartition des sélecteurs par niveau de spécificité."
    class="col-span-12 lg:col-span-8">
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
      </div>
    </template>
    <div class="space-y-6">
      <div class="grid grid-cols-4 gap-4">
        <Section
          title="Basse (0-10)"
          suffix="%"
          textClass="text-green-600"
          :value="lowSpecificity" />
        <Section
          title="Moyenne (11-30)"
          suffix="%"
          textClass="text-blue-500"
          :value="mediumSpecificity" />
        <Section
          title="Haute (31-60)"
          suffix="%"
          textClass="text-orange-500"
          :value="highSpecificity" />
        <Section
          title="Critique (>60)"
          suffix="%"
          textClass="text-red-500"
          :value="criticalSpecificity" />
      </div>

      <DistributionDetails
        class="text-sm"
        summary="Voir la distribution complète">
        <div class="grid grid-cols-4 gap-4">
          <!-- Basse -->
          <div>
            <h5
              class="text-xs font-semibold text-green-600 mb-2 uppercase tracking-wide">
              Basse (0-10)
            </h5>
            <div class="space-y-1.5">
              <PropertyBar
                v-for="(item, index) in lowSpecificityList"
                :key="index"
                :label="item.selector"
                :count="item.count"
                :maxCount="maxSelectorCount"
                :percent="item.percent"
                :barColor="'bg-green-500'" />
            </div>
          </div>
          <!-- Moyenne -->
          <div>
            <h5
              class="text-xs font-semibold text-blue-600 mb-2 uppercase tracking-wide">
              Moyenne (11-30)
            </h5>
            <div class="space-y-1.5">
              <PropertyBar
                v-for="(item, index) in mediumSpecificityList"
                :key="index"
                :label="item.selector"
                :count="item.count"
                :maxCount="maxSelectorCount"
                :percent="item.percent"
                :barColor="'bg-blue-500'" />
            </div>
          </div>
          <!-- Haute -->
          <div>
            <h5
              class="text-xs font-semibold text-orange-600 mb-2 uppercase tracking-wide">
              Haute (31-60)
            </h5>
            <div class="space-y-1.5">
              <PropertyBar
                v-for="(item, index) in highSpecificityList"
                :key="index"
                :label="item.selector"
                :count="item.count"
                :maxCount="maxSelectorCount"
                :percent="item.percent"
                :barColor="'bg-orange-500'" />
            </div>
          </div>
          <!-- Critique -->
          <div>
            <h5
              class="text-xs font-semibold text-red-600 mb-2 uppercase tracking-wide">
              Critique (>60)
            </h5>
            <div class="space-y-1.5">
              <PropertyBar
                v-for="(item, index) in criticalSpecificityList"
                :key="index"
                :label="item.selector"
                :count="item.count"
                :maxCount="maxSelectorCount"
                :percent="item.percent"
                :barColor="'bg-red-500'" />
            </div>
          </div>
        </div>
      </DistributionDetails>

      <Infos
        v-if="isSpecificityAboveThreshold || hasIdOrHigherSpecificity"
        class="flex flex-col gap-2">
        <p v-if="isSpecificityAboveThreshold">
          Le faible nombre de spécificité <code>0,0,1</code> indique que vous
          n'avez pas déclaré suffisamment de styles généraux (<code>body</code>,
          <code>h1</code>, <code>h2</code>, <code>p</code>, <code>a</code> …)
        </p>
        <p v-if="hasIdOrHigherSpecificity">
          Le niveau de spécificité critique indique que vous avez utilisé des ID
          dans vos css, ce qui est déconseillé.
        </p>
      </Infos>
    </div>
  </Block>
</template>

<script setup>
import Block from "../Block.vue";
import DistributionDetails from "../DistributionDetails.vue";
import PropertyBar from "../PropertyBar.vue";
import Section from "../Section.vue";
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

const specificityData = computed(
  () => props.projectData?.cssAnalysisResult?.selectors?.specificity || {}
);

const total = computed(() => specificityData.value.total || 0);

// Calculer la somme de spécificité depuis le format "id,class,element"
const calculateSpecificitySum = (key) => {
  const parts = key.split(",").map(Number);
  return parts[0] * 100 + parts[1] * 10 + parts[2]; // ID * 100 + classes * 10 + éléments
};

const lowSpecificity = computed(() => {
  try {
    let count = 0;
    Object.entries(specificityData.value.unique || {}).forEach(([key, val]) => {
      const sum = calculateSpecificitySum(key);
      if (sum <= 10) count += val;
    });
    return total.value > 0 ? Math.round((count / total.value) * 100) : 0;
  } catch (e) {
    console.error("Erreur calcul lowSpecificity:", e);
    return 0;
  }
});

const mediumSpecificity = computed(() => {
  try {
    let count = 0;
    Object.entries(specificityData.value.unique || {}).forEach(([key, val]) => {
      const sum = calculateSpecificitySum(key);
      if (sum >= 11 && sum <= 30) count += val;
    });
    return total.value > 0 ? Math.round((count / total.value) * 100) : 0;
  } catch (e) {
    console.error("Erreur calcul mediumSpecificity:", e);
    return 0;
  }
});

const highSpecificity = computed(() => {
  try {
    let count = 0;
    Object.entries(specificityData.value.unique || {}).forEach(([key, val]) => {
      const sum = calculateSpecificitySum(key);
      if (sum >= 31 && sum <= 60) count += val;
    });
    return total.value > 0 ? Math.round((count / total.value) * 100) : 0;
  } catch (e) {
    console.error("Erreur calcul highSpecificity:", e);
    return 0;
  }
});

const criticalSpecificity = computed(() => {
  return (
    100 - lowSpecificity.value - mediumSpecificity.value - highSpecificity.value
  );
});

const criticalCount = computed(() => {
  try {
    let count = 0;
    Object.entries(specificityData.value.unique || {}).forEach(([key, val]) => {
      const sum = calculateSpecificitySum(key);
      if (sum > 60) count += val;
    });
    return count;
  } catch (e) {
    console.error("Erreur calcul criticalCount:", e);
    return 0;
  }
});

const topSelectors = computed(() => {
  // La structure n'a pas de items, on doit utiliser complexity ou autre chose
  // Pour l'instant on retourne un tableau vide si pas de données
  return [];
});

// Tri et catégorisation des sélecteurs par spécificité
const sortedSelectors = computed(() => {
  try {
    const unique = specificityData.value.unique || {};
    return Object.entries(unique)
      .map(([selector, count]) => ({
        selector,
        count,
        sum: calculateSpecificitySum(selector),
        percent: total.value > 0 ? Math.round((count / total.value) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);
  } catch (e) {
    console.error("Erreur sortedSelectors:", e);
    return [];
  }
});

// Séparer par catégorie
const lowSpecificityList = computed(() =>
  sortedSelectors.value.filter((s) => s.sum <= 10)
);

const mediumSpecificityList = computed(() =>
  sortedSelectors.value.filter((s) => s.sum >= 11 && s.sum <= 30)
);

const highSpecificityList = computed(() =>
  sortedSelectors.value.filter((s) => s.sum >= 31 && s.sum <= 60)
);

const criticalSpecificityList = computed(() =>
  sortedSelectors.value.filter((s) => s.sum > 60)
);

// Valeur maximale pour normaliser les barres
const maxSelectorCount = computed(() => {
  if (sortedSelectors.value.length === 0) return 1;
  return Math.max(...sortedSelectors.value.map((s) => s.count));
});
</script>

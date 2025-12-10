<template>
  <Block
    title="Typographie"
    desc="Analyse typographique : familles, tailles, line-height, variantes et échelle de texte.">
    <div class="grid grid-cols-1 gap-8 md:grid-cols-4">
      <Section title="Web fonts" :value="webfontDetails.length">
        <div class="space-y-3">
          <div
            v-for="(font, idx) in webfontDetails"
            :key="idx"
            class="text-sm text-slate-600">
            <a
              class="font-semibold text-slate-800 flex items-center gap-2"
              :href="font.url"
              >{{ font.provider }}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24">
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6m-7 1l9-9m-5 0h5v5" />
              </svg>
            </a>
          </div>
        </div>
      </Section>

      <Section title="Prévisualisation des polices" class="md:col-span-3">
        <div class="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <div v-for="family in fontFamiliesData" :key="family.name" class="">
            <h4 class="text-slate-400 mb-3 text-sm">
              {{ family.name }}
            </h4>
            <p class="text-4xl" :style="{ fontFamily: family.name }">
              Hamburgevons
            </p>
          </div>
        </div>
      </Section>

      <Section
        title="Font-family"
        :value="typographySummary.totalFamilies"
        :additionalValue="typographySummary.totalFontFamilyDeclarations"
        subtitle="(unique/déclarations)">
      </Section>

      <Section
        title="Font-size"
        :value="Object.keys(fontSizeDetails).length"
        :additionalValue="typographySummary.totalFontSizeDeclarations"
        subtitle="(unique/déclarations)">
      </Section>

      <Section
        title="Line-heights"
        :value="Object.keys(lineHeightDetails).length"
        :additionalValue="typographySummary.totalLineHeightDeclarations"
        subtitle="(unique/déclarations)">
      </Section>

      <Section
        title="Unités relatives"
        :value="`${
          Math.round(typographySummary.fontSizeUnits?.relativeRatio * 100) || 0
        }%`"
        :additionalValue="typographySummary.fontSizeUnits?.relativeUnits"
        subtitle="(pourcentage/count)">
      </Section>

      <DistributionDetails
        class="text-sm md:col-span-4"
        summary="Voir la distribution complète">
        <div class="grid grid-cols-1 gap-8 md:grid-cols-4">
          <!-- Fonts -->
          <div>
            <h5 class="text-xs font-semibold mb-2 uppercase tracking-wide">
              Fonts
            </h5>
            <div class="space-y-1.5">
              <PropertyBar
                v-for="family in fontFamiliesData"
                :key="family.name"
                :label="family.name"
                :count="family.declarationCount"
                :maxCount="maxDeclarations"
                :percent="
                  Math.round(
                    (family.declarationCount / totalDeclarations) * 100
                  )
                ">
              </PropertyBar>
            </div>
          </div>
          <!-- Tailles -->
          <div>
            <h5 class="text-xs font-semibold mb-2 uppercase tracking-wide">
              Tailles
            </h5>
            <div class="space-y-1.5">
              <PropertyBar
                v-for="item in sortedSizes"
                :key="item.size"
                :label="item.size"
                :count="item.count"
                :maxCount="typographySummary.totalFontSizeDeclarations"
                :percent="
                  Math.round(
                    (item.count / typographySummary.totalFontSizeDeclarations) *
                      100
                  )
                ">
              </PropertyBar>
            </div>
          </div>
          <!-- Interlignage -->
          <div>
            <h5 class="text-xs font-semibold mb-2 uppercase tracking-wide">
              Interlignage
            </h5>
            <div class="space-y-1.5">
              <PropertyBar
                v-for="item in sortedLineHeights"
                :key="item.height"
                :label="item.height"
                :count="item.count"
                :maxCount="typographySummary.totalLineHeightDeclarations"
                :percent="
                  Math.round(
                    (item.count /
                      typographySummary.totalLineHeightDeclarations) *
                      100
                  )
                ">
              </PropertyBar>
            </div>
          </div>
          <div class="space-y-8">
            <!-- Unités font-size -->
            <div>
              <h5 class="text-xs font-semibold mb-2 uppercase tracking-wide">
                Unités tailles
              </h5>
              <div class="space-y-1.5">
                <PropertyBar
                  v-for="(count, unit) in fontSizeUnitsData.units"
                  :key="unit"
                  :label="`${unit}`"
                  :count="count"
                  :maxCount="fontSizeUnitsData.totalSizes || 1"
                  :percent="
                    Math.round((count / fontSizeUnitsData.totalSizes) * 100)
                  ">
                </PropertyBar>
              </div>
            </div>
            <!-- Unités line-height -->
            <div>
              <h5 class="text-xs font-semibold mb-2 uppercase tracking-wide">
                Unités interlignage
              </h5>
              <div class="space-y-1.5">
                <PropertyBar
                  v-for="(count, unit) in lineHeightUnitsData.units"
                  :key="unit"
                  :label="`${unit}`"
                  :count="count"
                  :maxCount="lineHeightUnitsData.total || 1"
                  :percent="
                    Math.round((count / lineHeightUnitsData.total) * 100)
                  ">
                </PropertyBar>
              </div>
            </div>
          </div>
        </div>
      </DistributionDetails>

      <!-- Recommandations -->
      <Infos
        v-if="scoreBreakdown || scoreImprovements.length > 0"
        :twoColumns="true"
        class="md:col-span-4">
        <template #summary>
          <ul class="list-disc list-inside">
            <li v-for="(item, key) in scoreBreakdown" :key="key">
              {{ item.details }}
            </li>
          </ul>
        </template>

        <template v-if="scoreImprovements.length > 0" #recommendations>
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
import Block from "../Block.vue";
import Section from "../Section.vue";
import PropertyBar from "../PropertyBar.vue";
import DistributionDetails from "../DistributionDetails.vue";
import Infos from "../Infos.vue";

const props = defineProps({
  typography: {
    type: Object,
    default: () => ({}),
  },
});

// Données centralisées
const typographySummary = computed(() => props.typography?.summary || {});
const webfontDetails = computed(
  () => props.typography?.webfonts?.details || []
);
const fontFamiliesObj = computed(() => props.typography?.fontFamilies || {});
const scoreData = computed(() => props.typography?.score || {});

// Familles de polices
const fontFamiliesData = computed(() =>
  Object.entries(fontFamiliesObj.value)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.declarationCount - a.declarationCount)
);

const totalDeclarations = computed(() =>
  fontFamiliesData.value.reduce((sum, f) => sum + f.declarationCount, 0)
);

const maxDeclarations = computed(() =>
  Math.max(...fontFamiliesData.value.map((f) => f.declarationCount), 1)
);

// Tailles de police
const fontSizeDetails = computed(
  () => typographySummary.value.fontSizeDetails || {}
);

const sortedSizes = computed(() =>
  Object.entries(fontSizeDetails.value)
    .map(([size, data]) => ({ size, ...data }))
    .sort((a, b) => b.count - a.count)
);

// Line-heights
const lineHeightDetails = computed(
  () => typographySummary.value.lineHeightDetails || {}
);

const sortedLineHeights = computed(() =>
  Object.entries(lineHeightDetails.value)
    .map(([height, data]) => ({ height, count: data.count }))
    .sort((a, b) => b.count - a.count)
);

// Unités
const fontSizeUnitsData = computed(
  () => typographySummary.value.fontSizeUnits || {}
);
const lineHeightUnitsData = computed(
  () => typographySummary.value.lineHeightUnits || {}
);

// Score
const scoreBreakdown = computed(() => scoreData.value.breakdown || {});
const scoreImprovements = computed(() => scoreData.value.improvements || []);

const GRADE_COLORS = {
  A: "bg-green-100 text-green-900",
  B: "bg-green-100 text-green-900",
  C: "bg-yellow-100 text-yellow-900",
  D: "bg-orange-100 text-orange-900",
  E: "bg-red-100 text-red-900",
  F: "bg-red-100 text-red-900",
};

const gradeColorClass = computed(
  () => GRADE_COLORS[scoreData.value.grade] || GRADE_COLORS.F
);

const SCORE_LABELS = {
  webfonts: "Webfonts",
  fallbacks: "Fallbacks",
  inheritance: "Héritage",
  sizes: "Tailles",
  lineHeights: "Line-heights",
  bestPractices: "Bonnes pratiques",
};

const formatScoreName = (key) => SCORE_LABELS[key] || key;
</script>

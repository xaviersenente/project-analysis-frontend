<template>
  <Block
    title="Couleurs"
    desc="Groupement des couleurs utilisées (par teinte) et détection des similarités ou transparences.">
    <template v-slot:header>
      <div class="flex gap-8">
        <div>
          <div class="text-xs uppercase">Total</div>
          <div class="text-xl font-bold">{{ stats.totalColors }}</div>
        </div>
        <div>
          <div class="text-xs uppercase">Unique</div>
          <div class="text-xl font-bold">{{ stats.uniqueColors }}</div>
        </div>
      </div>
    </template>

    <!-- Groupes de couleurs (données backend) -->
    <div class="mt-4 grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3">
      <Section
        v-for="(group, index) in stats.colorGroups"
        :key="index"
        :title="group.hueName"
        :subtitle="
          group.hueRange !== undefined && group.hueRange >= 0
            ? `(Teinte ~${group.hueRange}°)`
            : ''
        ">
        <div class="flex flex-wrap gap-3 mt-2">
          <div
            v-for="colorObj in group.colors"
            :key="colorObj.color"
            class="relative group">
            <div
              :class="[
                'relative w-10 h-10 rounded shadow-md lg:w-12 lg:h-12 cursor-pointer',
                similarSet.has(colorObj.color)
                  ? 'ring-2 ring-amber-400 ring-offset-1 ring-offset-white'
                  : '',
              ]">
              <div
                class="absolute inset-0 rounded"
                :style="backgroundStyle(colorObj.color)"></div>
              <span
                v-if="colorObj.count > 1"
                class="absolute -top-2 -right-2 bg-white text-xs font-semibold text-slate-700 border border-slate-200 rounded-full px-1.5 shadow z-10">
                ×{{ colorObj.count }}
              </span>
            </div>
            <!-- Popover -->
            <div
              class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              {{ colorObj.color }}
            </div>
          </div>
        </div>
      </Section>
    </div>

    <div class="mt-4 grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3">
      <!-- Couleurs transparentes -->
      <Section
        v-if="stats.transparentColors.length"
        title="Transparentes"
        desc="Couleurs avec opacité ou valeur transparente"
        class="mt-6">
        <div class="flex flex-wrap gap-3 mt-2">
          <div
            v-for="tcolor in stats.transparentColors"
            :key="tcolor.color"
            class="relative group">
            <div
              class="relative w-10 h-10 rounded shadow-md lg:w-12 lg:h-12 cursor-pointer"
              style="
                background-image: repeating-conic-gradient(
                  #e5e7eb 0% 25%,
                  #fff 0% 50%
                );
                background-size: 8px 8px;
              ">
              <div
                class="absolute inset-0 rounded"
                :style="backgroundStyle(tcolor.color)"></div>
              <span
                v-if="tcolor.count > 1"
                class="absolute -top-2 -right-2 bg-white text-xs font-semibold text-slate-700 border border-slate-200 rounded-full px-1.5 shadow z-10">
                ×{{ tcolor.count }}
              </span>
            </div>
            <!-- Popover -->
            <div
              class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              {{ tcolor.color }}
            </div>
          </div>
        </div>
      </Section>

      <!-- Dégradés -->
      <Section
        v-if="gradientsStats.totalUnique > 0"
        title="Dégradés"
        :desc="`${gradientsStats.total} total(aux), ${gradientsStats.totalUnique} unique(s)`"
        class="mt-6">
        <div class="flex flex-wrap gap-3 mt-2">
          <div
            v-for="(count, gradient) in gradientsStats.unique"
            :key="gradient"
            class="relative group">
            <div
              class="relative w-10 h-10 rounded shadow-md lg:w-12 lg:h-12 cursor-pointer"
              style="
                background-image: repeating-conic-gradient(
                  #e5e7eb 0% 25%,
                  #fff 0% 50%
                );
                background-size: 8px 8px;
              ">
              <div
                class="absolute inset-0 rounded"
                :style="{ background: gradient }"></div>
            </div>
            <span
              v-if="count > 1"
              class="absolute -top-2 -right-2 bg-white text-xs font-semibold text-slate-700 border border-slate-200 rounded-full px-1.5 shadow z-10">
              ×{{ count }}
            </span>
            <!-- Popover -->
            <div
              class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 max-w-xs">
              {{ gradient }}
            </div>
          </div>
        </div>
      </Section>
    </div>

    <!-- Synthèse des formats -->
    <div class="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-600">
      <span class="text-xs uppercase text-slate-500">Formats</span>
      <span
        v-for="(count, fmt) in stats.formats"
        :key="fmt"
        class="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 bg-slate-50 text-slate-700">
        <span class="font-semibold">{{ fmt }}</span>
        <span class="text-xs text-slate-500">{{ count }}</span>
      </span>
    </div>

    <div class="flex gap-8 text-sm my-4">
      <div class="flex items-center gap-3">
        <div
          class="w-4 h-4 rounded ring-2 ring-amber-400 ring-offset-1 ring-offset-white shrink-0"></div>
        <span>Couleur similaire à une autre</span>
      </div>
      <div class="flex items-center gap-3">
        <div
          class="bg-white text-xs font-semibold text-slate-700 border border-slate-200 rounded-full px-1.5 shadow z-10">
          ×3
        </div>
        <span>Nb d'utilisation de la couleur</span>
      </div>
    </div>

    <Infos v-if="hasLowUniqueness" :twoColumns="true">
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
  </Block>
</template>

<script setup>
import Block from "../Block.vue";
import Section from "../Section.vue";
import Infos from "../Infos.vue";
import { computed } from "vue";

const props = defineProps({
  colorsData: Object,
  gradientsData: Object,
});

// Données issues du backend (cssAnalysisResult.colors)
const stats = computed(() => {
  const colorsData = props.colorsData || {};
  return {
    totalColors: colorsData.totalColors || 0,
    uniqueColors: colorsData.uniqueColors || 0,
    formats: colorsData.formats || {},
    colorGroups: colorsData.colorGroups || [],
    opaqueColors: colorsData.opaqueColors || [],
    transparentColors: colorsData.transparentColors || [],
    similarColors: colorsData.similarColors || [],
    hasSimilarColors: !!colorsData.hasSimilarColors,
    scoreData: colorsData.score || {},
  };
});

const similarSet = computed(
  () =>
    new Set(
      stats.value.opaqueColors.filter((c) => c.isSimilar).map((c) => c.color)
    )
);

const gradientsStats = computed(() => {
  const gradientsData = props.gradientsData || {};
  return {
    total: gradientsData.total || 0,
    totalUnique: gradientsData.totalUnique || 0,
    unique: gradientsData.unique || {},
    uniquenessRatio: gradientsData.uniquenessRatio || 0,
  };
});

const backgroundStyle = (color) => ({ backgroundColor: color });

const hasLowUniqueness = computed(() => {
  const formatRatio = stats.value.formats?.uniquenessRatio;
  const similar = stats.value.hasSimilarColors;
  return similar || (formatRatio !== undefined && formatRatio < 0.3);
});

const scoreBreakdown = computed(() => stats.value.scoreData?.breakdown || {});

const scoreImprovements = computed(
  () => stats.value.scoreData?.improvements || []
);
</script>

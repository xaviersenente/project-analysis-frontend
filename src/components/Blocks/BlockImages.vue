<template>
  <Block
    title="Images"
    desc="Statistiques sur les images : formats, poids total/moyen, présence des attributs alt et répartition par format.">
    <div class="grid grid-cols-2 gap-8 mb-12 lg:grid-cols-4">
      <div class="row-span-2 flex justify-center">
        <ProgressCircle
          :value="imagesScore / 100"
          :averageValue="imagesAverage ?? undefined" />
      </div>
      <Section title="Nombre total d'images" :value="globalStats.totalImages" />

      <Section title="Attributs Alt">
        <div class="space-y-3">
          <PropertyBar
            label="Avec alt"
            :count="globalStats.imagesWithAlt"
            :maxCount="globalStats.totalImages"
            :percent="
              Math.round(
                (globalStats.imagesWithAlt / globalStats.totalImages) * 100
              )
            "
            barColor="bg-blue-500" />
        </div>
      </Section>

      <Section title="Formats">
        <div class="space-y-3">
          <PropertyBar
            v-for="(count, fmt) in filteredFormats"
            :key="fmt"
            :label="fmt.toUpperCase()"
            :count="count"
            :maxCount="globalStats.totalImages"
            :percent="Math.round((count / globalStats.totalImages) * 100)"
            barColor="bg-blue-500" />
        </div>
      </Section>

      <Section
        title="Poids moyen"
        subtitle="(Top 5 moy.)"
        size="sm"
        :value="formatSize(globalStats.averageWeight)"
        :additionalValue="formatSize(globalStats.top5AverageWeight)"
        :class="getSizeClass(globalStats.top5AverageWeight)">
      </Section>

      <Section title="Images décoratives">
        <div class="space-y-3">
          <PropertyBar
            label="Décoratives"
            :count="globalStats.decorativeImages"
            :maxCount="globalStats.totalImages"
            :percent="decorativePercent"
            barColor="bg-blue-500" />
        </div>
      </Section>

      <Section title="Lazy loading">
        <div class="space-y-3">
          <PropertyBar
            label="Avec lazy loading"
            :count="globalStats.imagesWithLazyLoading"
            :maxCount="globalStats.totalImages"
            :percent="lazyLoadingRatio"
            barColor="bg-blue-500" />
        </div>
      </Section>
    </div>

    <div class="mt-8 flex flex-wrap gap-4">
      <Button @click="openModalAlt" size="sm" text="Détail des images" />
      <Button
        @click="openModal"
        size="sm"
        text="Détail (moy. 5 img + lourdes)" />
    </div>
    <Infos
      v-if="globalScore.breakdown || (globalScore.improvements || []).length"
      :twoColumns="true">
      <template #summary>
        <ul class="list-disc list-inside">
          <li v-for="(item, key) in globalScore.breakdown" :key="key">
            {{ item.details }}
          </li>
        </ul>
      </template>
      <template v-if="globalScore.improvements?.length" #recommendations>
        <ul class="list-disc list-inside">
          <li v-for="(imp, idx) in globalScore.improvements" :key="idx">
            {{ imp }}
          </li>
        </ul>
      </template>
    </Infos>
    <Modal
      :isOpen="isModalOpen"
      title="Poids des 5 images les plus lourdes"
      @close="closeModal">
      <table
        class="min-w-full table-auto border-collapse text-left text-xs lg:text-sm">
        <thead>
          <tr class="bg-slate-100 *:px-3 *:py-2">
            <th>Images</th>
            <th>Poids</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(img, index) in stats.top5LargestImages"
            :key="index"
            class="hover:bg-slate-50 transition-colors *:px-3 *:py-2 *:border-b">
            <td>{{ getFileName(img.url) }}</td>
            <td>{{ formatSize(img.resourceSize) }}</td>
          </tr>
        </tbody>
      </table>
    </Modal>
    <Modal
      :isOpen="isModalAltOpen"
      title="Attributs Alt"
      @close="closeModalAlt"
      size="large">
      <ul class="grid grid-cols-1 gap-8 lg:grid-cols-2 2xl:grid-cols-3">
        <li
          v-for="(page, indexPage) in props.projectData.pages"
          :key="indexPage">
          <div class="bg-slate-100 py-2 px-4 text-slate-600 rounded-lg mb-4">
            <p class="text-lg font-bold">{{ page.title }}</p>
            <p>{{ getFileName(page.file) }}</p>
          </div>
          <table
            class="min-w-full table-auto border-collapse text-left text-xs lg:text-sm">
            <thead>
              <tr class="bg-slate-100 *:px-3 *:py-2">
                <th>Image</th>
                <th>Alt</th>
                <th>Aria</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in page.images"
                :key="index"
                class="hover:bg-slate-50 transition-colors *:px-3 *:py-2 *:border-b">
                <td :class="{ 'text-red-500': item.src === 'No src' }">
                  {{ getFileNameFromPath(item.src) }}
                </td>
                <td :class="{ 'text-red-500': item.alt === 'No alt' }">
                  {{ item.alt }}
                </td>
                <td>{{ item.ariaHidden }}</td>
              </tr>
            </tbody>
          </table>
        </li>
      </ul>
    </Modal>
  </Block>
</template>

<script setup>
import { ref, computed } from "vue";
import { getFileName, formatSize } from "../../js/helpers";
import Block from "../Block.vue";
import ProgressCircle from "../ProgressCircle.vue";
import Button from "../Button.vue";
import Modal from "../Modal.vue";
import Infos from "../Infos.vue";
import Section from "../Section.vue";
import PropertyBar from "../PropertyBar.vue";

const props = defineProps({
  projectData: {
    type: Object,
    required: true,
  },
  globalImagesAnalysis: {
    type: Object,
    required: false,
    default: () => ({}),
  },
  classStats: {
    type: Object,
    required: false,
    default: () => ({}),
  },
});

const imagesScore = computed(
  () => props.projectData?.globalImagesAnalysis?.globalScore?.total || 0
);
const imagesAverage = computed(() => {
  const mean = props.classStats?.stats?.htmlImages?.mean;
  return typeof mean === "number" ? mean / 100 : null;
});

const isModalOpen = ref(false);
const isModalAltOpen = ref(false);

// Modal Controls
const openModal = () => (isModalOpen.value = true);
const closeModal = () => (isModalOpen.value = false);

const openModalAlt = () => (isModalAltOpen.value = true);
const closeModalAlt = () => (isModalAltOpen.value = false);

// Données issues du backend globalImagesAnalysis
const globalImages = computed(() => props.globalImagesAnalysis || {});
const globalStats = computed(() => globalImages.value.globalStats || {});
const globalScore = computed(() => globalImages.value.globalScore || {});
const decorativePercent = computed(() =>
  globalStats.value.decorativeRatio
    ? Math.round(globalStats.value.decorativeRatio * 100)
    : 0
);
const lazyLoadingRatio = computed(() => {
  const total = globalStats.value.totalImages || 0;
  if (!total) return 0;
  return Math.round((globalStats.value.imagesWithLazyLoading / total) * 100);
});
const filteredFormats = computed(() => {
  const formats = globalImages.value.formats || {};
  return Object.fromEntries(
    Object.entries(formats).filter(([, count]) => count > 0)
  );
});

const getFileNameFromPath = (path) => {
  return path.split("/").pop();
};

// Classe CSS basée sur la taille
const getSizeClass = (size) => {
  if (size < 250000) return "text-green-600";
  if (size <= 500000) return "text-orange-500";
  return "text-red-500";
};

// Images (pour les modales seulement)
const allImages = computed(() =>
  props.projectData.pages.flatMap((page) =>
    page.lighthouseReport.requests.filter((req) => req.resourceType === "Image")
  )
);

const uniqueImages = computed(() => {
  const seen = new Set();
  return allImages.value.filter(
    (img) => !seen.has(img.url) && seen.add(img.url)
  );
});

const stats = computed(() => {
  const top5LargestImages = uniqueImages.value
    .sort((a, b) => b.resourceSize - a.resourceSize)
    .slice(0, 5);

  return {
    top5LargestImages,
  };
});
</script>

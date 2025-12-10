<template>
  <Block
    title="Détails des fichiers HTML"
    desc="Inventaire des fichiers HTML analysés avec liens, favicon, viewport, erreurs W3C et métriques Lighthouse.">
    <div class="grid gap-8 2xl:grid-cols-4">
      <div class="overflow-x-scroll lg:overflow-auto 2xl:col-span-3">
        <table
          class="min-w-full table-auto border-collapse text-left text-xs lg:text-sm">
          <thead>
            <tr class="bg-slate-100 *:px-3 *:py-2">
              <th
                v-for="header in headers"
                :key="header.key"
                :width="header.width">
                {{ header.label }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="file in files"
              :key="file.file"
              class="hover:bg-slate-50 transition-colors *:px-3 *:py-2 *:border-b *:border-b-slate-300">
              <td>{{ getFileName(file.file) }}</td>
              <td>{{ file.title }}</td>
              <td class="font-mono">{{ file.deadLinks }}</td>
              <td class="font-mono">{{ file.externalLinks }}</td>
              <td><component :is="file.favicon ? Check : Fail" /></td>
              <td class="font-mono">{{ file.mailtoLinks }}</td>
              <td><component :is="file.viewport ? Check : Fail" /></td>
              <td>
                <div>
                  <span
                    v-if="file.validationErrors.length === 0"
                    class="px-2 py-0.5 border border-transparent rounded text-green-700 inline-block"
                    >Valide&nbsp;!</span
                  >

                  <button
                    v-if="file.validationErrors.length > 0"
                    @click="openModal(file.validationErrors)"
                    class="px-2 py-0.5 border rounded cursor-pointer focus:outline-none"
                    :class="{
                      'border-yellow-500 text-yellow-600 hover:text-white hover:bg-yellow-600 hover:border-yellow-600':
                        file.validationErrors.length > 0,
                      'border-orange-500 text-orange-600 hover:text-white hover:bg-orange-600 hover:border-orange-600':
                        file.validationErrors.length >= 10,
                      'border-red-500 text-red-700 hover:text-white hover:bg-red-600 hover:border-red-600':
                        file.validationErrors.length >= 20,
                    }">
                    {{ file.validationErrors.length }}&nbsp;erreur{{
                      file.validationErrors.length === 1 ? "" : "s"
                    }}
                  </button>
                </div>
              </td>
              <!-- <td class="font-mono">
                <Tag
                  :value="
                    Math.round(file.imagesAnalysis?.score?.total || 0) / 100
                  " />
              </td> -->
              <td v-for="metric in metrics" :key="metric.key" class="font-mono">
                <Tag :value="file.lighthouseReport[metric.key]" />
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="bg-slate-50 font-semibold *:px-3 *:py-2">
              <td colspan="2">Moyenne / Statut</td>
              <td class="font-mono">{{ average.deadLinks }}</td>
              <td class="font-mono">{{ average.externalLinks }}</td>
              <td class="font-mono">
                <span v-if="average.favicon">1</span>
                <span v-else>0</span>
              </td>
              <td class="font-mono">{{ average.mailtoLinks }}</td>
              <td class="font-mono">
                <span v-if="average.viewport">1</span>
                <span v-else>0</span>
              </td>
              <td class="font-mono">{{ average.validationErrors }}</td>
              <!-- <td class="font-mono">{{ average.imagesScore }}</td> -->
              <td v-for="metric in metrics" :key="metric.key" class="font-mono">
                {{ average[metric.key] }}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <Infos v-if="adviceMessages.length" class="mt-0">
        <ul class="list-decimal pl-5">
          <li
            v-for="(message, index) in adviceMessages"
            :key="index"
            class="mb-1">
            {{ message }}
          </li>
        </ul>
      </Infos>
    </div>
    <Modal
      :isOpen="isModalOpen"
      title="Détails des erreurs de validation"
      @close="closeModal">
      <ul v-if="modalErrors.length" class="pl-5 mb-4">
        <li v-for="(error, index) in modalErrors" :key="index" class="mb-4">
          <div class="font-bold text-red-600">Erreur {{ index + 1 }} :</div>
          <div><strong>Type : </strong> {{ error.type }}</div>
          <div class="text-xs">
            Ligne {{ error.lastLine }} | Colonne {{ error.lastColumn }}
          </div>
          <div>
            <strong>Message : </strong>
            <span>{{ error.message }}</span>
          </div>
          <div>
            <strong>Extrait du code : </strong>
            <pre class="bg-slate-100 p-2 rounded text-sm whitespace-pre-wrap">{{
              error.extract.trim()
            }}</pre>
          </div>
          <div>
            <strong>Partie concernée : </strong>
            <span class="text-blue-500">
              {{
                error.extract.slice(
                  error.hiliteStart,
                  error.hiliteStart + error.hiliteLength
                )
              }}
            </span>
          </div>
        </li>
      </ul>
    </Modal>
  </Block>
</template>

<script setup>
import { ref, computed } from "vue";
import { getFileName } from "../../js/helpers";
import Infos from "../Infos.vue";
import Block from "../Block.vue";
import Check from "../Check.vue";
import Fail from "../Fail.vue";
import Tag from "../Tag.vue";
import Modal from "../Modal.vue";

const props = defineProps({
  files: Array,
});

const isModalOpen = ref(false);
const modalErrors = ref([]);

const openModal = (errors) => {
  modalErrors.value = errors;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  modalErrors.value = [];
};

// En-têtes du tableau
const headers = [
  { key: "file", label: "Fichier", width: "20%" },
  { key: "title", label: "Title", width: "20%" },
  { key: "deadLinks", label: "Liens mort", width: "6%" },
  { key: "externalLinks", label: "Liens ext.", width: "6%" },
  { key: "favicon", label: "Favicon", width: "6%" },
  { key: "mailtoLinks", label: "Mailto", width: "6%" },
  { key: "viewport", label: "Viewport", width: "6%" },
  { key: "validationErrors", label: "Erreurs W3C", width: "6%" },
  // { key: "imagesScore", label: "Score img", width: "6%" },
  { key: "performance", label: "Perf.", width: "4%" },
  { key: "accessibility", label: "Acces.", width: "4%" },
  { key: "bestPractices", label: "BP", width: "4%" },
  { key: "seo", label: "SEO", width: "4%" },
];

// Métriques Lighthouse
const metrics = [
  { key: "performance", label: "Perf." },
  { key: "accessibility", label: "Acces." },
  { key: "bestPractices", label: "BP" },
  { key: "seo", label: "SEO" },
];

// Fonctions calculées optimisées
const adviceMessages = computed(() => {
  const messages = [];

  const duplicateTitles = props.files
    .map((file) => file.title)
    .filter((title, index, arr) => arr.indexOf(title) !== index);

  if (duplicateTitles.length) {
    messages.push(
      `Doublons dans les balises <title> : ${duplicateTitles.join(", ")}`
    );
  }

  const conditions = [
    {
      condition: props.files.some((file) => file.deadLinks > 0),
      message: "Corrigez les liens morts.",
    },
    {
      condition: props.files.some((file) => !file.favicon),
      message: "Ajoutez un favicon.",
    },
    {
      condition: props.files.some((file) => !file.viewport),
      message: "Ajoutez une balise viewport.",
    },
    {
      condition: props.files.some((file) => file.validationErrors.length > 0),
      message: "Corrigez les erreurs W3C.",
    },
    {
      condition: props.files.some(
        (file) => file.lighthouseReport.accessibility < 100
      ),
      message: "Améliorez l'accessibilité.",
    },
    {
      condition: props.files.some(
        (file) => file.lighthouseReport.bestPractices < 100
      ),
      message: "Améliorez les bonnes pratiques.",
    },
    {
      condition: props.files.some((file) => file.lighthouseReport.seo < 100),
      message: "Améliorez le SEO.",
    },
  ];

  conditions.forEach(({ condition, message }) => {
    if (condition) messages.push(message);
  });

  return messages;
});

const average = computed(() => {
  const totalFiles = props.files.length;

  if (totalFiles === 0) {
    return {
      deadLinks: "0",
      externalLinks: "0",
      favicon: false,
      mailtoLinks: "0",
      viewport: false,
      validationErrors: "0",
      imagesScore: "0",
      performance: "0",
      accessibility: "0",
      bestPractices: "0",
      seo: "0",
    };
  }

  const sum = props.files.reduce(
    (acc, file) => {
      acc.deadLinks += file.deadLinks || 0;
      acc.externalLinks += file.externalLinks || 0;
      acc.mailtoLinks += file.mailtoLinks || 0;
      acc.validationErrors += file.validationErrors.length || 0;
      acc.imagesScore += file.imagesAnalysis?.score?.total || 0;
      acc.performance += file.lighthouseReport?.performance || 0;
      acc.accessibility += file.lighthouseReport?.accessibility || 0;
      acc.bestPractices += file.lighthouseReport?.bestPractices || 0;
      acc.seo += file.lighthouseReport?.seo || 0;

      acc.favicon = acc.favicon && file.favicon;
      acc.viewport = acc.viewport && file.viewport;

      return acc;
    },
    {
      deadLinks: 0,
      externalLinks: 0,
      mailtoLinks: 0,
      validationErrors: 0,
      performance: 0,
      accessibility: 0,
      bestPractices: 0,
      seo: 0,
      imagesScore: 0,
      favicon: true,
      viewport: true,
    }
  );

  const formatNumber = (value) => value.toFixed(2).replace(".", ",");

  return {
    deadLinks: formatNumber(sum.deadLinks / totalFiles),
    externalLinks: formatNumber(sum.externalLinks / totalFiles),
    mailtoLinks: formatNumber(sum.mailtoLinks / totalFiles),
    validationErrors: formatNumber(sum.validationErrors / totalFiles),
    imagesScore: ((sum.imagesScore || 0) / totalFiles).toFixed(0),
    performance: ((sum.performance * 100) / totalFiles).toFixed(0),
    accessibility: ((sum.accessibility * 100) / totalFiles).toFixed(0),
    bestPractices: ((sum.bestPractices * 100) / totalFiles).toFixed(0),
    seo: ((sum.seo * 100) / totalFiles).toFixed(0),
    favicon: sum.favicon,
    viewport: sum.viewport,
  };
});
</script>

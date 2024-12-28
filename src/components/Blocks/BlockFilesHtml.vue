<template>
  <Block title="Détails des fichiers HTML" class="col-span-12">
    <div class="grid gap-8 2xl:grid-cols-4">
      <div class="overflow-x-scroll lg:overflow-auto 2xl:col-span-3">
        <table class="min-w-full table-auto border-collapse text-left text-sm">
          <thead>
            <tr class="bg-gray-100 *:px-4 *:py-2">
              <th width="20%">Fichier</th>
              <th width="20%">Title</th>
              <th width="6%">Liens mort</th>
              <th width="6%">Liens ext.</th>
              <th width="6%">Favicon</th>
              <th width="6%">Mailto</th>
              <th width="6%">Viewport</th>
              <th width="6%">Erreurs W3C</th>
              <th width="4%">Perf.</th>
              <th width="4%">Acces.</th>
              <th width="4%">BP</th>
              <th width="4%">SEO</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="file in files"
              :key="file.file"
              class="hover:bg-gray-50 transition-colors *:px-4 *:py-2 *:border-b"
            >
              <td>{{ getFileName(file.file) }}</td>
              <td>{{ file.title }}</td>
              <td class="font-mono">{{ file.deadLinks }}</td>
              <td class="font-mono">{{ file.externalLinks }}</td>
              <td>
                <component :is="file.favicon ? Check : Fail" />
              </td>
              <td class="font-mono">{{ file.mailtoLinks }}</td>
              <td>
                <component :is="file.viewport ? Check : Fail" />
              </td>
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
                    class="px-2 py-0.5 border rounded focus:outline-none"
                    :class="{
                      'border-yellow-500 text-yellow-600 hover:text-white hover:bg-yellow-600 hover:border-yellow-600':
                        file.validationErrors.length > 0,
                      'border-orange-500 text-orange-600 hover:text-white hover:bg-orange-600 hover:border-orange-600':
                        file.validationErrors.length >= 10,
                      'border-red-500 text-red-700 hover:text-white hover:bg-red-600 hover:border-red-600':
                        file.validationErrors.length >= 20,
                    }"
                  >
                    {{ file.validationErrors.length }}&nbsp;erreur{{
                      file.validationErrors.length === 1 ? "" : "s"
                    }}
                  </button>
                </div>
              </td>
              <td class="font-mono">
                <Tag :value="file.lighthouseReport.performance" />
              </td>
              <td class="font-mono">
                <Tag :value="file.lighthouseReport.accessibility" />
              </td>
              <td class="font-mono">
                <Tag :value="file.lighthouseReport.bestPractices" />
              </td>
              <td class="font-mono">
                <Tag :value="file.lighthouseReport.seo" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Infos v-if="adviceMessages.length" class="mt-0">
        <ul class="list-decimal pl-5">
          <li v-for="(message, index) in adviceMessages" :key="index">
            {{ message }}
          </li>
        </ul>
      </Infos>
    </div>
  </Block>
  <Modal
    :isOpen="isModalOpen"
    title="Détails des erreurs de validation"
    @close="closeModal"
  >
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
          <pre class="bg-gray-100 p-2 rounded text-sm">{{
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

  // Ouvrir la pop-up avec les erreurs
  const openModal = (errors) => {
    modalErrors.value = errors;
    isModalOpen.value = true;
  };

  // Fermer la pop-up
  const closeModal = () => {
    isModalOpen.value = false;
    modalErrors.value = [];
  };

  // Calcul des conseils
  const deadLinksCount = computed(
    () => props.files.filter((file) => file.deadLinks > 0).length
  );

  const avgExternalLinks = computed(() => {
    const total = props.files.reduce(
      (acc, file) => acc + file.externalLinks,
      0
    );
    return props.files.length > 0 ? total / props.files.length : 0;
  });

  const faviconMissing = computed(
    () => props.files.filter((file) => !file.favicon).length
  );

  const mailtoMissing = computed(
    () => props.files.filter((file) => !file.mailtoLinks).length
  );

  const viewportMissing = computed(
    () => props.files.filter((file) => !file.viewport).length
  );

  const validationErrorsExist = computed(() =>
    props.files.some((file) => file.validationErrors.length > 0)
  );

  const avgAccessibility = computed(() => {
    const total = props.files.reduce(
      (acc, file) => acc + file.lighthouseReport.accessibility,
      0
    );
    return props.files.length > 0 ? total / props.files.length : 0;
  });

  const avgBestPractices = computed(() => {
    const total = props.files.reduce(
      (acc, file) => acc + file.lighthouseReport.bestPractices,
      0
    );
    return props.files.length > 0 ? total / props.files.length : 0;
  });

  const avgSEO = computed(() => {
    const total = props.files.reduce(
      (acc, file) => acc + file.lighthouseReport.seo,
      0
    );
    return props.files.length > 0 ? total / props.files.length : 0;
  });

  // Détection des doublons dans les titres
  const duplicateTitles = computed(() => {
    const titles = props.files.map((file) => file.title);
    const titleCounts = titles.reduce((acc, title) => {
      acc[title] = (acc[title] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(titleCounts).filter((title) => titleCounts[title] > 1);
  });

  // Messages de conseil
  const adviceMessages = computed(() => {
    const messages = [];

    if (duplicateTitles.value.length > 0) {
      messages.push(
        `Il y a des doublons dans les balises <title> : ${duplicateTitles.value.join(
          ", "
        )}`
      );
    }

    if (deadLinksCount.value > 0) {
      messages.push("Corrigez les liens mort.");
    }

    if (avgExternalLinks.value < 2) {
      messages.push("Ajoutez davantage de liens externes.");
    }

    if (faviconMissing.value > 0) {
      messages.push("Le favicon est manquant sur une ou plusieurs pages.");
    }

    if (mailtoMissing.value > 0) {
      messages.push("Le mailto est manquant sur une ou plusieurs pages.");
    }

    if (viewportMissing.value > 0) {
      messages.push("Le viewport est manquant sur une ou plusieurs pages.");
    }

    if (validationErrorsExist.value) {
      messages.push("Corrigez les erreurs de validation.");
    }

    if (avgAccessibility.value < 100) {
      messages.push("Améliorez l'accessibilité.");
    }

    if (avgBestPractices.value < 100) {
      messages.push("Améliorez les bonnes pratiques.");
    }

    if (avgSEO.value < 100) {
      messages.push("Améliorez le SEO.");
    }

    return messages;
  });
</script>

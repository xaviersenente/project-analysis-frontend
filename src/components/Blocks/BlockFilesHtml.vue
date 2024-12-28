<template>
  <Block
    title="Détails des fichiers HTML"
    class="col-span-12 overflow-x-scroll lg:overflow-auto"
  >
    <table class="min-w-full table-auto border-collapse text-left text-sm">
      <thead>
        <tr class="bg-gray-100 *:px-4 *:py-2">
          <th width="20%">Fichier</th>
          <th width="20%">Title</th>
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
          <td class="font-mono"><Tag :value="file.lighthouseReport.seo" /></td>
        </tr>
      </tbody>
    </table>
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
  import { ref } from "vue";
  import { getFileName } from "../../js/helpers";
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
</script>

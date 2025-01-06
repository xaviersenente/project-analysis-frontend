<template>
  <Block
    title="Structure de document"
    class="col-span-12 xl:col-span-6 2xl:col-span-4"
  >
    <template v-slot:header>
      <Button @open="openModal()" />
    </template>
    <p class="text-sm mb-2 text-gray-400">Nombre de titres par pages</p>
    <div class="overflow-x-auto">
      <table
        class="min-w-full table-auto border-collapse text-left text-xs lg:text-sm"
      >
        <thead>
          <tr class="bg-gray-100 *:px-3 *:py-2">
            <th>Pages HTML</th>
            <th width="10%">h1</th>
            <th width="10%">h2</th>
            <th width="10%">h3</th>
            <th width="10%">h4</th>
            <th width="10%">h5</th>
            <th width="10%">h6</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="file in props.projectData.pages"
            :key="file.file"
            class="hover:bg-gray-50 transition-colors *:px-3 *:py-2 *:border-b"
          >
            <td>{{ getFileName(file.file) }}</td>
            <td v-for="level in 6" :key="`heading-h${level}`" class="font-mono">
              <span
                v-if="file.headings?.[`h${level}`] === 0"
                class="text-gray-400"
                >—</span
              >
              <span v-else>{{ file.headings?.[`h${level}`] }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <Infos v-if="missingH1 || poorH2H3">
      <p v-if="missingH1" class="mb-2">
        Une ou plusieurs pages n'ont pas de titre <code>&lt;h1&gt;</code>.
        Chaque page devrait avoir un titre principal unique&nbsp;!
      </p>
      <p v-if="poorH2H3">
        En moyenne, il y a moins d'un titre <code>&lt;h2&gt;</code> ou
        <code>&lt;h3&gt;</code> par page. Assurez-vous que la hiérarchie des
        titres est logique et équilibrée.
      </p>
    </Infos>
  </Block>
  <Modal
    :isOpen="isModalOpen"
    title="Structure des pages HTML"
    size="large"
    @close="closeModal"
  >
    <ul
      class="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
    >
      <li v-for="(page, indexPage) in props.projectData.pages" :key="indexPage">
        <div class="bg-gray-100 py-2 px-4 text-gray-600 rounded-lg mb-4">
          <p class="text-lg font-bold">{{ page.title }}</p>
          <p>{{ getFileName(page.file) }}</p>
        </div>
        <ul>
          <li
            v-for="(item, index) in page.outlineStructure"
            :key="index"
            class="text-sm mb-2"
            :class="getClass(item.level)"
          >
            <div
              v-if="['h1', 'h2', 'h3', 'h4', 'h6'].includes(item.tag)"
              class="flex gap-2"
            >
              <span><Code :tag="item.tag" /></span>
              <span>{{ item.text }}</span>
            </div>
            <div v-else>
              <span><Code :tag="item.tag" /></span>
            </div>
          </li>
        </ul>
      </li>
    </ul>
  </Modal>
</template>
<script setup>
  import { ref, computed } from "vue";
  import { getFileName } from "../../js/helpers";
  import Block from "../Block.vue";
  import Modal from "../Modal.vue";
  import Button from "../Button.vue";
  import Code from "../Code.vue";
  import Infos from "../Infos.vue";

  const isModalOpen = ref(false);

  const props = defineProps({
    projectData: Object,
  });

  // Fonction pour ouvrir la modale
  const openModal = () => {
    isModalOpen.value = true;
  };

  // Fermer la pop-up
  const closeModal = () => {
    isModalOpen.value = false;
  };

  // Vérifier si un h1 est manquant
  const missingH1 = computed(() => {
    return props.projectData.pages.some((page) => page.headings?.h1 === 0);
  });

  // Calculer la moyenne des h2 et h3
  const poorH2H3 = computed(() => {
    const totalPages = props.projectData.pages.length;
    let totalH2 = 0;
    let totalH3 = 0;

    props.projectData.pages.forEach((page) => {
      totalH2 += page.headings?.h2 || 0;
      totalH3 += page.headings?.h3 || 0;
    });

    return totalH2 / totalPages <= 1 || totalH3 / totalPages <= 1;
  });

  // Fonction pour définir une classe en fonction du niveau
  const getClass = (level) => {
    return [
      level === 1 ? "" : "",
      level === 2 ? "pl-3 " : "",
      level === 3 ? "pl-6 " : "",
      level === 4 ? "pl-9 " : "",
      level === 5 ? "pl-12 " : "",
      level === 6 ? "pl-15 " : "",
    ];
  };
</script>

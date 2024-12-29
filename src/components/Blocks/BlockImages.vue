<template>
  <Block title="Images" class="col-span-12 2xl:col-span-4">
    <div class="grid grid-cols-2 gap-4 mb-12 lg:grid-cols-4 2xl:grid-cols-2">
      <Section
        title="Images"
        subtitle="(Total / unique)"
        size="sm"
        :value="stats.totalImages"
        :additionalValue="stats.uniqueImages"
      />

      <Section
        title="Moy. 5 img + lourdes"
        size="sm"
        :value="formatSize(stats.avgSizeTop5)"
        :class="getSizeClass(stats.avgSizeTop5)"
      >
        <Button @click="openModal()" size="sm" text="Détail" />
      </Section>

      <Section
        title="Poids"
        subtitle="(Total / unique)"
        size="sm"
        :value="formatSize(stats.totalSizeAll)"
        :additionalValue="formatSize(stats.totalSizeUnique)"
      />

      <Section
        title="Poids moyen"
        subtitle="(Total / unique)"
        size="sm"
        :value="formatSize(stats.avgSizeAll)"
        :additionalValue="formatSize(stats.avgSizeUnique)"
      />
    </div>

    <table class="min-w-full table-auto border-collapse text-left text-sm">
      <thead>
        <tr class="bg-gray-100 *:px-4 *:py-2">
          <th>Format</th>
          <th>Total/unique</th>
          <th>Poids Total/unique</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(stat, index) in imageStatsTable"
          :key="index"
          class="hover:bg-gray-50 transition-colors *:px-4 *:py-2 *:border-b"
        >
          <td>{{ stat.type }}</td>
          <td class="font-mono">
            <span v-if="stat.count === 0" class="text-gray-400">—</span>
            <span v-else>{{ stat.count }} / {{ stat.uniqueCount }}</span>
          </td>
          <td class="font-mono">
            <span v-if="stat.count === 0" class="text-gray-400">—</span>
            <span v-else
              >{{ formatSize(stat.size) }} /
              {{ formatSize(stat.uniqueSize) }}</span
            >
          </td>
        </tr>
      </tbody>
    </table>
    <Infos v-if="stats.avgSizeTop5 > 250000 || outdatedImageFormats">
      <p v-if="stats.avgSizeTop5 > 250000" class="mb-2">
        Pensez à optimiser la taille des images pour améliorer les performances.
      </p>
      <p v-if="outdatedImageFormats">
        Privilégiez les formats modernes comme <code>WebP</code> ou
        <code>AVIF</code> au lieu de <code>Jpeg</code> ou <code>PNG</code> pour
        une meilleure optimisation.
      </p>
    </Infos>
  </Block>
  <Modal
    :isOpen="isModalOpen"
    title="Poids des 5 images les plus lourdes"
    @close="closeModal"
  >
    <table class="min-w-full table-auto border-collapse text-left text-sm">
      <thead>
        <tr class="bg-gray-100 *:px-4 *:py-2">
          <th>Images</th>
          <th>Poids</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(img, index) in stats.top5LargestImages"
          :key="index"
          class="hover:bg-gray-50 transition-colors *:px-4 *:py-2 *:border-b"
        >
          <td>{{ getFileName(img.url) }}</td>
          <td>{{ formatSize(img.resourceSize) }}</td>
        </tr>
      </tbody>
    </table>
  </Modal>
</template>

<script setup>
  import { ref, computed } from "vue";
  import { getFileName, formatSize } from "../../js/helpers";
  import Block from "../Block.vue";
  import Button from "../Button.vue";
  import Modal from "../Modal.vue";
  import Infos from "../Infos.vue";
  import Section from "../Section.vue";

  const props = defineProps({
    projectData: {
      type: Object,
      required: true,
    },
  });

  const isModalOpen = ref(false);

  // Fonction pour ouvrir la modale
  const openModal = () => {
    isModalOpen.value = true;
  };

  // Fermer la pop-up
  const closeModal = () => {
    isModalOpen.value = false;
  };

  // Fonction pour déterminer la classe en fonction de la valeur d'écart
  const getSizeClass = (size) => {
    if (size > 0 && size < 250000) return "text-green-600";
    if (size >= 250000 && size <= 500000) return "text-orange-500";
    if (size > 500000) return "text-red-500";
    return "text-red-500";
  };

  // Types d'image à afficher
  const imageTypes = [
    { mime: "image/avif", label: "avif" },
    { mime: "image/webp", label: "webp" },
    { mime: "image/svg+xml", label: "svg" },
    { mime: "image/jpeg", label: "jpeg" },
    { mime: "image/png", label: "png" },
  ];

  // Calculer les statistiques d'image par format
  const imageStatsTable = computed(() => {
    const stats = {};

    imageTypes.forEach((type) => {
      stats[type.mime] = {
        type: type.label,
        count: 0,
        uniqueCount: 0,
        size: 0,
        uniqueSize: 0,
        uniqueTracker: new Set(),
      };
    });

    props.projectData.pages.forEach((page) => {
      page.lighthouseReport.requests.forEach((request) => {
        if (
          request.resourceType === "Image" &&
          stats.hasOwnProperty(request.mimeType)
        ) {
          const stat = stats[request.mimeType];
          stat.count++;
          stat.size += request.resourceSize;

          if (!stat.uniqueTracker.has(request.url)) {
            stat.uniqueTracker.add(request.url);
            stat.uniqueCount++;
            stat.uniqueSize += request.resourceSize;
          }
        }
      });
    });

    return Object.values(stats).map(
      ({ type, count, uniqueCount, size, uniqueSize }) => ({
        type,
        count,
        uniqueCount,
        size,
        uniqueSize,
      })
    );
  });

  // Extraire les images
  const allImages = computed(() => {
    return props.projectData.pages.flatMap((page) =>
      page.lighthouseReport.requests.filter(
        (req) => req.resourceType === "Image"
      )
    );
  });

  const uniqueImages = computed(() => {
    const seen = new Set();
    return allImages.value.filter((img) => {
      if (!seen.has(img.url)) {
        seen.add(img.url);
        return true;
      }
      return false;
    });
  });

  // Vérifier les formats d'image obsolètes
  const outdatedImageFormats = computed(() => {
    return props.projectData.pages.some((page) =>
      page.lighthouseReport.requests.some(
        (req) =>
          req.resourceType === "Image" &&
          ["image/jpeg", "image/png"].includes(req.mimeType)
      )
    );
  });

  // Calculer les statistiques globales
  const stats = computed(() => {
    const totalSizeAll = allImages.value.reduce(
      (sum, img) => sum + img.resourceSize,
      0
    );
    const totalSizeUnique = uniqueImages.value.reduce(
      (sum, img) => sum + img.resourceSize,
      0
    );

    const avgSizeAll =
      allImages.value.length > 0 ? totalSizeAll / allImages.value.length : 0;

    const avgSizeUnique =
      uniqueImages.value.length > 0
        ? totalSizeUnique / uniqueImages.value.length
        : 0;

    const top5LargestImages = [...uniqueImages.value]
      .sort((a, b) => b.resourceSize - a.resourceSize)
      .slice(0, 5);

    const totalSizeTop5 = top5LargestImages.reduce(
      (sum, img) => sum + img.resourceSize,
      0
    );

    const avgSizeTop5 =
      top5LargestImages.length > 0
        ? totalSizeTop5 / top5LargestImages.length
        : 0;

    return {
      totalImages: allImages.value.length,
      uniqueImages: uniqueImages.value.length,
      totalSizeAll,
      totalSizeUnique,
      avgSizeAll,
      avgSizeUnique,
      avgSizeTop5,
      top5LargestImages,
    };
  });
</script>

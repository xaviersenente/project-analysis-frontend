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
        <Button @click="openModal" size="sm" text="Détail" />
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

    <table
      class="min-w-full table-auto border-collapse text-left text-xs lg:text-sm"
    >
      <thead>
        <tr class="bg-gray-100 *:px-3 *:py-2">
          <th>Format</th>
          <th>Total/unique</th>
          <th>Poids Total/unique</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(stat, index) in imageStatsTable"
          :key="index"
          class="hover:bg-gray-50 transition-colors *:px-3 *:py-2 *:border-b"
        >
          <td>{{ stat.type }}</td>
          <td class="font-mono">
            {{ stat.count || "—" }} / {{ stat.uniqueCount || "—" }}
          </td>
          <td class="font-mono">
            {{
              stat.count
                ? `${formatSize(stat.size)} / ${formatSize(stat.uniqueSize)}`
                : "—"
            }}
          </td>
        </tr>
      </tbody>
    </table>

    <Infos v-if="stats.avgSizeTop5 > 250000 || outdatedImageFormats">
      <p v-if="stats.avgSizeTop5 > 250000">
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
    <table
      class="min-w-full table-auto border-collapse text-left text-xs lg:text-sm"
    >
      <thead>
        <tr class="bg-gray-100 *:px-3 *:py-2">
          <th>Images</th>
          <th>Poids</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(img, index) in stats.top5LargestImages"
          :key="index"
          class="hover:bg-gray-50 transition-colors *:px-3 *:py-2 *:border-b"
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

  // Modal Controls
  const openModal = () => (isModalOpen.value = true);
  const closeModal = () => (isModalOpen.value = false);

  // Classe CSS basée sur la taille
  const getSizeClass = (size) => {
    if (size < 250000) return "text-green-600";
    if (size <= 500000) return "text-orange-500";
    return "text-red-500";
  };

  // Formats d'image
  const imageTypes = [
    { mime: "image/avif", label: "avif" },
    { mime: "image/webp", label: "webp" },
    { mime: "image/svg+xml", label: "svg" },
    { mime: "image/jpeg", label: "jpeg" },
    { mime: "image/png", label: "png" },
  ];

  // Calcul des statistiques d'image
  const imageStatsTable = computed(() => {
    const stats = imageTypes.map((type) => ({
      type: type.label,
      count: 0,
      uniqueCount: 0,
      size: 0,
      uniqueSize: 0,
      uniqueTracker: new Set(),
    }));

    props.projectData.pages.forEach((page) => {
      page.lighthouseReport.requests.forEach((req) => {
        const stat = stats.find((s) => s.type === req.mimeType.split("/")[1]);
        if (stat) {
          stat.count++;
          stat.size += req.resourceSize;

          if (!stat.uniqueTracker.has(req.url)) {
            stat.uniqueTracker.add(req.url);
            stat.uniqueCount++;
            stat.uniqueSize += req.resourceSize;
          }
        }
      });
    });

    return stats.map(({ type, count, uniqueCount, size, uniqueSize }) => ({
      type,
      count,
      uniqueCount,
      size,
      uniqueSize,
    }));
  });

  // Images
  const allImages = computed(() =>
    props.projectData.pages.flatMap((page) =>
      page.lighthouseReport.requests.filter(
        (req) => req.resourceType === "Image"
      )
    )
  );

  const uniqueImages = computed(() => {
    const seen = new Set();
    return allImages.value.filter(
      (img) => !seen.has(img.url) && seen.add(img.url)
    );
  });

  // Formats obsolètes
  const outdatedImageFormats = computed(() =>
    allImages.value.some((img) =>
      ["image/jpeg", "image/png"].includes(img.mimeType)
    )
  );

  // Statistiques globales
  const stats = computed(() => {
    const totalSizeAll = allImages.value.reduce(
      (sum, img) => sum + img.resourceSize,
      0
    );
    const totalSizeUnique = uniqueImages.value.reduce(
      (sum, img) => sum + img.resourceSize,
      0
    );

    const top5LargestImages = uniqueImages.value
      .sort((a, b) => b.resourceSize - a.resourceSize)
      .slice(0, 5);

    return {
      totalImages: allImages.value.length,
      uniqueImages: uniqueImages.value.length,
      totalSizeAll,
      totalSizeUnique,
      avgSizeAll: totalSizeAll / allImages.value.length || 0,
      avgSizeUnique: totalSizeUnique / uniqueImages.value.length || 0,
      avgSizeTop5:
        top5LargestImages.reduce((sum, img) => sum + img.resourceSize, 0) / 5 ||
        0,
      top5LargestImages,
    };
  });
</script>

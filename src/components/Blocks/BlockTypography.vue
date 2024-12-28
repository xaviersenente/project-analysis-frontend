<template>
  <Block title="Typographie" class="col-span-12 lg:col-span-6">
    <template v-slot:header>
      <div class="flex gap-4">
        <div>
          <div class="text-xs uppercase">Total</div>
          <div class="text-xl font-bold">{{ stats.totalFonts }}</div>
        </div>
        <div>
          <div class="text-xs uppercase">Unique</div>
          <div class="text-xl font-bold">{{ stats.uniqueFonts }}</div>
        </div>
      </div>
    </template>

    <table>
      <thead>
        <tr>
          <th>Font</th>
          <th>Count</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(count, font) in stats.fontFamilies" :key="font">
          <td><Code :tag="font" /></td>
          <td>{{ count }}</td>
        </tr>
      </tbody>
    </table>
    <ul>
      <li v-for="font in fonts" :key="font" class="mt-4">
        <p class="text-slate-500 border-b border-b-slate-300 pb-1 mb-1">
          {{ font }}
        </p>
        <p class="text-5xl" :style="{ fontFamily: font }">Hamburgevons</p>
      </li>
    </ul>
  </Block>
</template>

<script setup>
  import Block from "../Block.vue";
  import Code from "../Code.vue";
  import { ref, computed, onMounted } from "vue";

  const props = defineProps({
    projectData: Object,
  });

  // Extraire les statistiques de typographie
  const stats = computed(() => {
    const fontData =
      props.projectData?.cssAnalysisResult?.values?.fontFamilies || {};
    return {
      totalFonts: fontData.total || 0,
      uniqueFonts: fontData.totalUnique || 0,
      fontFamilies: fontData.unique || {},
    };
  });

  // Polices dynamiquement chargées
  const fonts = ref([]);

  // Fonction pour extraire les polices depuis @import et les charger dynamiquement
  const extractFontsFromImport = () => {
    const importObj =
      props.projectData?.cssAnalysisResult?.atrules?.import?.unique || {};
    const importUrl = Object.keys(importObj)[0] || "";

    if (importUrl) {
      const url = importUrl.match(/url\("(.+?)"\)/)?.[1];
      if (url) {
        loadGoogleFonts(url);

        // Extraire les familles de polices de l'URL
        const fontFamilies = [...url.matchAll(/family=([^&]+)/g)].map(
          (match) => match[1]
        );

        fonts.value = fontFamilies.map((family) =>
          family.split(":")[0].replace(/\+/g, " ")
        );
      }
    }
  };

  // Ajouter dynamiquement une balise <link> pour charger les polices
  const loadGoogleFonts = (url) => {
    const existingLink = document.querySelector(`link[data-dynamic-fonts]`);
    if (existingLink) {
      existingLink.href = url;
    } else {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = url;
      link.setAttribute("data-dynamic-fonts", "true");
      document.head.appendChild(link);
    }
  };

  // Charger les polices à l'initialisation
  onMounted(() => {
    extractFontsFromImport();
  });
</script>

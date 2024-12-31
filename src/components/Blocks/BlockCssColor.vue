<template>
  <Block title="Couleurs par Teinte" class="col-span-12 2xl:col-span-4">
    <template v-slot:header>
      <div class="flex gap-4">
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

    <!-- Groupes de couleurs par teinte -->
    <div class="mt-4">
      <div
        v-for="(group, index) in groupedColors.groups"
        :key="index"
        class="mb-6"
      >
        <div class="mb-2">
          <span class="font-semibold">Groupe {{ index + 1 }}</span> (Teinte :
          {{ group.hsl.h }}°)
        </div>
        <div class="flex flex-wrap gap-3">
          <div
            v-for="(colorObj, idx) in group.colors"
            :key="`${index}-${idx}`"
            class="relative w-10 h-10 rounded shadow-md lg:w-12 lg:h-12"
            :style="{ backgroundColor: colorObj.color }"
          >
            <div
              v-if="colorObj.isSimilar"
              class="absolute top-[-8px] right-[-8px] flex justify-center"
            >
              <span
                class="text-red-500 text-xs font-bold bg-white border rounded-full w-5 h-5 flex justify-center items-center"
                >✕</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Groupe des couleurs transparentes -->
    <div class="mt-6" v-if="groupedColors.transparentGroup > 0">
      <div class="font-semibold mb-2">Couleurs Transparentes</div>
      <div class="flex flex-wrap gap-3">
        <div
          v-for="(colorObj, idx) in groupedColors.transparentGroup"
          :key="`transparent-${idx}`"
          class="w-10 h-10 rounded shadow-md lg:w-12 lg:h-12 relative overflow-hidden"
        >
          <div
            class="absolute inset-0 bg-[linear-gradient(45deg,#fff_25%,#999_25%,#999_50%,#fff_50%,#fff_75%,#999_75%,#999)] bg-[length:10px_10px]"
          ></div>
          <div
            class="absolute inset-0"
            :style="{
              backgroundColor: colorObj.color,
            }"
          ></div>
        </div>
      </div>
    </div>
    <Infos
      v-if="groupedColors.hasSimilarColors || groupedColors.groups.length > 5"
    >
      <p v-if="groupedColors.hasSimilarColors">
        Il semble qu'il y ait une ou plusieurs couleurs proches qu'il serait
        préférable de réunir en une seule couleur.
      </p>
      <p v-if="groupedColors.groups.length > 5">
        Attention à ne pas choisir trop de teintes différentes dans votre
        harmonie colorée pour ne pas perdre en cohérence.
      </p>
    </Infos>
  </Block>
</template>

<script setup>
  import Block from "../Block.vue";
  import Infos from "../Infos.vue";
  import { computed } from "vue";

  const props = defineProps({
    projectData: Object,
  });

  // Extraire les statistiques des couleurs
  const stats = computed(() => {
    const cssAnalysis =
      props.projectData?.cssAnalysisResult?.values?.colors || {};
    return {
      totalColors: cssAnalysis.total || 0,
      uniqueColors: cssAnalysis.totalUnique || 0,
      colors: cssAnalysis.unique || {},
    };
  });

  // Fonction pour convertir une couleur CSS en HSL
  const getHSL = (color) => {
    const s = new Option().style;
    s.color = color;

    if (!s.color) return null; // Vérifie si la couleur est valide

    // Crée un élément invisible pour interpréter la couleur
    const div = document.createElement("div");
    div.style.color = color;
    document.body.appendChild(div);

    // Récupère la couleur calculée par le navigateur
    const computedColor = getComputedStyle(div).color;
    document.body.removeChild(div);

    // Extrait les valeurs RGB
    const match = computedColor.match(/\d+/g);
    if (!match || match.length < 3) return null;

    const [r, g, b] = match.map(Number);

    // Conversion RGB → HSL
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, sValue, l;

    l = (max + min) / 2;
    if (max === min) {
      h = sValue = 0; // Achromatic (gris)
    } else {
      const delta = max - min;
      sValue = l > 127.5 ? delta / (510 - max - min) : delta / (max + min);

      switch (max) {
        case r:
          h = (g - b) / delta + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / delta + 2;
          break;
        case b:
          h = (r - g) / delta + 4;
          break;
      }
      h = Math.round(h * 60);
    }

    return {
      h: h || 0,
      s: Math.round(sValue * 100) || 0,
      l: Math.round((l / 255) * 100) || 0,
    };
  };

  // Fonction pour vérifier les couleurs similaires
  const areColorsSimilar = (color1, color2) => {
    const hsl1 = getHSL(color1);
    const hsl2 = getHSL(color2);

    if (!hsl1 || !hsl2) return false;

    return Math.abs(hsl1.s - hsl2.s) < 10 && Math.abs(hsl1.l - hsl2.l) < 10;
  };

  // Grouper les couleurs par teinte et identifier les couleurs similaires
  const groupedColors = computed(() => {
    // Filtrer les couleurs transparentes (rgba, hsla ou "transparent")
    const colors = Object.entries(stats.value.colors)
      .map(([color]) => ({
        color,
        hsl: getHSL(color),
        isSimilar: false,
      }))
      .filter(
        (colorObj) =>
          !colorObj.color.includes("rgba") &&
          !colorObj.color.includes("hsla") &&
          colorObj.color !== "transparent" // Exclure "transparent"
      );

    const groups = {};
    let hasSimilarColors = false; // Ajout du paramètre global

    colors.forEach((colorObj) => {
      if (!colorObj.hsl) return;

      const hueGroup = Math.floor(colorObj.hsl.h / 30) * 30;

      if (!groups[hueGroup]) groups[hueGroup] = [];
      groups[hueGroup].push(colorObj);
    });

    Object.values(groups).forEach((group) => {
      for (let i = 0; i < group.length; i++) {
        for (let j = i + 1; j < group.length; j++) {
          if (areColorsSimilar(group[i].color, group[j].color)) {
            group[i].isSimilar = true;
            group[j].isSimilar = true;
            hasSimilarColors = true; // Détecte qu'il y a des couleurs similaires
          }
        }
      }
    });

    // Retourner les groupes sans les transparents et les transparents séparément
    return {
      groups: Object.keys(groups).map((key) => ({
        hsl: { h: key },
        colors: groups[key],
      })),
      transparentGroup: Object.entries(stats.value.colors)
        .map(([color]) => ({
          color,
          hsl: getHSL(color),
          isSimilar: false,
        }))
        .filter(
          (colorObj) =>
            colorObj.color.includes("rgba") ||
            colorObj.color.includes("hsla") ||
            colorObj.color === "transparent" // Ajouter "transparent" dans le groupe transparent
        ),
      hasSimilarColors, // Ajout du paramètre global
    };
  });
</script>

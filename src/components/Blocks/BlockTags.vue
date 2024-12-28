<template>
  <Block
    title="Balises utilisées"
    class="col-span-12 xl:col-span-6 2xl:col-span-4"
  >
    <div v-if="projectData.globalAnalysis?.tagsMissing?.length > 0">
      <p
        class="text-xl text-red-600 font-bold pb-2 border-b border-b-slate-200 mb-2"
      >
        {{ projectData.globalAnalysis?.tagsMissing?.length }} balises manquantes
      </p>
      <ul class="flex flex-wrap gap-2">
        <li
          v-for="(tag, index) in projectData.globalAnalysis?.tagsMissing"
          :key="index"
        >
          <Code :tag="tag" />
        </li>
      </ul>
      <Infos v-if="projectData.globalAnalysis?.tagsMissing?.length > 0">
        <p>
          D'après l'analyse du sujet qui vous a été donné, vous auriez dû
          utiliser les balises ci-dessus pour structurer correctement le
          contenu&nbsp;!
        </p>
      </Infos>
    </div>
    <p v-else class="text-xl text-green-600 font-bold">
      Toutes les balises attentues sont là !
    </p>

    <div class="flex gap-8">
      <div
        v-if="
          projectData.globalAnalysis?.obsoleteTagsUsage &&
          Object.keys(projectData.globalAnalysis.obsoleteTagsUsage).length > 0
        "
        class="mt-8 flex-1"
      >
        <p
          class="text-xl text-red-600 font-bold pb-2 border-b border-b-slate-200 mb-2"
        >
          Balises obsolètes
        </p>
        <table class="min-w-full table-auto text-left">
          <tbody>
            <tr
              v-for="(count, tag) in projectData.globalAnalysis
                .obsoleteTagsUsage"
              :key="tag"
              class="hover:bg-gray-50 transition-colors *:py-1"
            >
              <td width="20%"><Code :tag="tag" /></td>
              <td class="font-mono">{{ count }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        v-if="projectData.globalAnalysis?.otherTagsUsage"
        class="mt-8 flex-1"
      >
        <p class="text-xl font-bold pb-2 border-b border-b-slate-200 mb-2">
          Autres balises
        </p>
        <table class="min-w-full table-auto text-left">
          <tbody>
            <tr
              v-for="(count, tag) in projectData.globalAnalysis.otherTagsUsage"
              :key="tag"
              class="hover:bg-gray-50 transition-colors *:py-1"
            >
              <td width="20%"><Code :tag="tag" /></td>
              <td class="font-mono">{{ count }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <Infos
      v-if="
        projectData.globalAnalysis?.otherTagsUsage?.br > 10 ||
        projectData.globalAnalysis?.otherTagsUsage?.hr > 8 ||
        Object.keys(projectData.globalAnalysis.obsoleteTagsUsage).length > 0
      "
    >
      <p
        v-if="
          projectData.globalAnalysis?.otherTagsUsage?.br > 10 ||
          projectData.globalAnalysis?.otherTagsUsage?.hr > 8
        "
      >
        L'utilisation excessive des balises <code>&lt;br&gt;</code> ou
        <code>&lt;hr&gt;</code> peut nuire à la structure du document.
        Privilégiez l'utilisation des CSS pour espacer ou séparer.
      </p>
      <p
        v-if="
          Object.keys(projectData.globalAnalysis.obsoleteTagsUsage).length > 0
        "
      >
        Remplacez les balises obsolète par des règles css ou d'autres balises
        appropriées.
      </p>
    </Infos>
  </Block>
</template>
<script setup>
  import Block from "../Block.vue";
  import Code from "../Code.vue";
  import Infos from "../Infos.vue";

  const props = defineProps({
    projectData: Object,
  });
</script>

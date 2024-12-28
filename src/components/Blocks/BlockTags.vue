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
    </div>
    <p v-else class="text-xl text-green-600 font-bold">
      Toutes les balises attentues sont là !
    </p>

    <div
      v-if="
        projectData.globalAnalysis?.obsoleteTagsUsage &&
        Object.keys(projectData.globalAnalysis.obsoleteTagsUsage).length > 0
      "
      class="mt-8"
    >
      <p
        class="text-xl text-red-600 font-bold pb-2 border-b border-b-slate-200 mb-2"
      >
        Balises obsolètes
      </p>
      <table class="min-w-full table-auto text-left">
        <tbody>
          <tr
            v-for="(count, tag) in projectData.globalAnalysis.obsoleteTagsUsage"
            :key="tag"
            class="hover:bg-gray-50 transition-colors *:py-1"
          >
            <td width="20%"><Code :tag="tag" /></td>
            <td>{{ count }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="projectData.globalAnalysis?.otherTagsUsage" class="mt-8">
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
            <td>{{ count }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </Block>
</template>
<script setup>
  import Block from "../Block.vue";
  import Code from "../Code.vue";

  const props = defineProps({
    projectData: Object,
  });
</script>

<template>
  <Block title="Unités" class="col-span-12 lg:col-span-4">
    <template v-slot:header>
      <div class="flex gap-4">
        <div>
          <div class="text-xs uppercase">Total</div>
          <div class="text-xl font-bold">
            {{ props.projectData.cssAnalysisResult.values.units.total }}
          </div>
        </div>
        <div>
          <div class="text-xs uppercase">Unique</div>
          <div class="text-xl font-bold">
            {{ props.projectData.cssAnalysisResult.values.units.totalUnique }}
          </div>
        </div>
      </div>
    </template>
    <TableMeter
      :data="props.projectData.cssAnalysisResult.values.units.unique"
      headerLabel="Unité"
    />
    <Infos
      v-if="props.projectData.cssAnalysisResult.values.units.unique.rem < 3"
    >
      <p>
        Il semble que ayez peu voir pas utilisé l'unité <code>rem</code>,
        notamment pour définir les tailles de texte.
      </p>
    </Infos>
  </Block>
</template>

<script setup>
  import Block from "../Block.vue";
  import Infos from "../Infos.vue";
  import TableMeter from "../TableMeter.vue";

  // Props attendues depuis le parent
  const props = defineProps({
    projectData: Object,
  });
</script>

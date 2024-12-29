<template>
  <Block title="Propriétés" class="col-span-12 lg:col-span-8">
    <template v-slot:header>
      <div class="flex gap-4">
        <div>
          <div class="text-xs uppercase">Total</div>
          <div class="text-xl font-bold">
            {{ props.projectData.cssAnalysisResult.properties.total }}
          </div>
        </div>
        <div>
          <div class="text-xs uppercase">Unique</div>
          <div class="text-xl font-bold">
            {{ props.projectData.cssAnalysisResult.properties.totalUnique }}
          </div>
        </div>
      </div>
    </template>
    <TableMeter
      :data="props.projectData.cssAnalysisResult.properties.unique"
      columnWidth="20%"
      :maxRows="15"
    />
  </Block>
</template>

<script setup>
  import Block from "../Block.vue";
  import TableMeter from "../TableMeter.vue";

  // Props attendues depuis le parent
  const props = defineProps({
    projectData: Object,
  });
</script>

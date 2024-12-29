<template>
  <Block title="Règles" class="col-span-12 lg:col-span-4">
    <template v-slot:header>
      <div class="flex gap-4">
        <div>
          <div class="text-xs uppercase">Total</div>
          <div class="text-xl font-bold">
            {{ props.projectData.cssAnalysisResult.rules.total }}
          </div>
        </div>
        <div>
          <div class="text-xs uppercase">Vide</div>
          <div class="text-xl font-bold">
            {{ props.projectData.cssAnalysisResult.rules.empty.total }}
          </div>
        </div>
      </div>
    </template>
    <TableMeter
      :data="props.projectData.cssAnalysisResult.rules.sizes.unique"
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

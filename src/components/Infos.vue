<template>
  <div
    class="bg-yellow-50 rounded border border-yellow-200 p-3 mt-6 text-yellow-700 lg:p-4 lg:mt-8">
    <p
      v-if="!twoColumns"
      class="text-yellow-700 font-bold mb-2 flex gap-2 items-center">
      <svg
        viewBox="0 0 512 512"
        xmlns="http://www.w3.org/2000/svg"
        class="w-5 h-5">
        <title />
        <path
          d="M85.57,446.25H426.43a32,32,0,0,0,28.17-47.17L284.18,82.58c-12.09-22.44-44.27-22.44-56.36,0L57.4,399.08A32,32,0,0,0,85.57,446.25Z"
          style="
            fill: none;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-width: 40px;
          "
          class="stroke-yellow-700" />
        <path
          d="M250.26,195.39l5.74,122,5.73-121.95a5.74,5.74,0,0,0-5.79-6h0A5.74,5.74,0,0,0,250.26,195.39Z"
          style="
            fill: none;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-width: 40px;
          "
          class="stroke-yellow-700" />
        <path d="M256,397.25a20,20,0,1,1,20-20A20,20,0,0,1,256,397.25Z" />
      </svg>
      Recommandation(s)
    </p>
    <div v-if="!twoColumns" class="text-sm flex flex-col gap-2"><slot /></div>

    <!-- Mode deux colonnes -->
    <div v-if="twoColumns" class="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <!-- Résumé -->
      <div v-if="$slots.summary">
        <h4 class="text-yellow-700 font-bold mb-4 flex gap-2 items-center">
          <!-- <svg
            viewBox="0 0 512 512"
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5">
            <title />
            <path
              d="M85.57,446.25H426.43a32,32,0,0,0,28.17-47.17L284.18,82.58c-12.09-22.44-44.27-22.44-56.36,0L57.4,399.08A32,32,0,0,0,85.57,446.25Z"
              style="
                fill: none;
                stroke-linecap: round;
                stroke-linejoin: round;
                stroke-width: 40px;
              "
              class="stroke-yellow-700" />
            <path
              d="M250.26,195.39l5.74,122,5.73-121.95a5.74,5.74,0,0,0-5.79-6h0A5.74,5.74,0,0,0,250.26,195.39Z"
              style="
                fill: none;
                stroke-linecap: round;
                stroke-linejoin: round;
                stroke-width: 40px;
              "
              class="stroke-yellow-700" />
            <path d="M256,397.25a20,20,0,1,1,20-20A20,20,0,0,1,256,397.25Z" />
          </svg> -->
          Résumé
        </h4>
        <div class="text-sm flex flex-col gap-2">
          <slot name="summary" />
        </div>
      </div>

      <!-- Recommandations -->
      <div v-if="$slots.recommendations">
        <h4 class="text-yellow-700 font-bold mb-4 flex gap-2 items-center">
          <svg
            viewBox="0 0 512 512"
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5">
            <title />
            <path
              d="M85.57,446.25H426.43a32,32,0,0,0,28.17-47.17L284.18,82.58c-12.09-22.44-44.27-22.44-56.36,0L57.4,399.08A32,32,0,0,0,85.57,446.25Z"
              style="
                fill: none;
                stroke-linecap: round;
                stroke-linejoin: round;
                stroke-width: 40px;
              "
              class="stroke-yellow-700" />
            <path
              d="M250.26,195.39l5.74,122,5.73-121.95a5.74,5.74,0,0,0-5.79-6h0A5.74,5.74,0,0,0,250.26,195.39Z"
              style="
                fill: none;
                stroke-linecap: round;
                stroke-linejoin: round;
                stroke-width: 40px;
              "
              class="stroke-yellow-700" />
            <path d="M256,397.25a20,20,0,1,1,20-20A20,20,0,0,1,256,397.25Z" />
          </svg>
          Recommandation(s)
        </h4>
        <div class="text-sm flex flex-col gap-2">
          <slot name="recommendations" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  twoColumns: {
    type: Boolean,
    default: false,
  },
});
</script>

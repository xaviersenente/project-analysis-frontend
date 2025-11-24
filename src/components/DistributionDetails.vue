<template>
  <details ref="detailsRef" class="text-sm group" :open="open">
    <summary
      class="cursor-pointer flex items-center gap-2 py-1 select-none outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded text-slate-500">
      <span
        class="toggle-icon relative w-4 h-4 inline-flex items-center justify-center transition-all ease-in-out duration-200 before:absolute before:w-4 before:h-0.5 before:bg-slate-500 after:absolute after:w-0.5 after:h-4 after:bg-slate-500"
        :class="isOpen ? 'toggle-icon--open' : ''"></span>

      <span>{{ summary }}</span>
    </summary>
    <div
      class="mt-3 transition-opacity duration-300"
      :class="isOpen ? 'opacity-100' : 'opacity-0'">
      <slot />
    </div>
  </details>
</template>

<script setup>
import { ref, onMounted } from "vue";

const props = defineProps({
  data: { type: Object, required: true },
  summary: { type: String, default: "Voir la distribution complète" },
  open: { type: Boolean, default: false },
});

const detailsRef = ref(null);
const isOpen = ref(props.open);

onMounted(() => {
  if (detailsRef.value) {
    // synchroniser l'état initial
    isOpen.value = detailsRef.value.open;
    detailsRef.value.addEventListener("toggle", () => {
      isOpen.value = detailsRef.value.open;
    });
  }
});
</script>

<style scoped>
.toggle-icon.toggle-icon--open::after {
  transform: scaleY(0);
  opacity: 0;
}

.toggle-icon.toggle-icon--open {
  transform: scale(1.1);
}
</style>

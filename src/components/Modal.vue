<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto"
    @click.self="closeModal"
  >
    <div class="max-h-screen">
      <div class="bg-white p-6 rounded-lg m-8 text-sm" :class="modalSizeClass">
        <h2 class="text-xl font-semibold mb-4">{{ title }}</h2>
        <div class="content mb-4">
          <slot></slot>
        </div>
        <button
          @click="closeModal"
          class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
        >
          Fermer
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { computed } from "vue";

  const props = defineProps({
    isOpen: Boolean,
    title: String,
    size: {
      type: String,
      default: "default",
    },
  });

  const emit = defineEmits(["close"]);

  const closeModal = () => {
    emit("close");
  };

  // Ajuster la largeur selon le type de modal
  const modalSizeClass = computed(() => {
    switch (props.size) {
      case "large":
        return "max-w-full";
      default:
        return "max-w-4xl";
    }
  });
</script>

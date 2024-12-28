<template>
  <button
    @click="handleOpenModal"
    :class="buttonClasses"
    class="border rounded focus:outline-none"
  >
    {{ text }}
  </button>
</template>

<script setup>
  import { computed } from "vue";
  const props = defineProps({
    modalType: String, // Type de modal (ex: 'validation', 'details')
    text: {
      type: String,
      default: "En détail…", // Texte par défaut du bouton
    },
    size: {
      type: String,
      default: "md", // Taille par défaut
      validator: (value) => ["sm", "md", "lg"].includes(value), // Taille valide
    },
  });

  const emit = defineEmits(["open"]);

  const handleOpenModal = () => {
    emit("open", props.modalType);
  };

  // Classes dynamiques selon la taille
  const buttonClasses = computed(() => {
    const baseClasses =
      "text-gray-600 bg-gray-100 hover:text-white hover:bg-gray-700";

    const sizeClasses = {
      sm: "px-2 py-1 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    };

    return `${baseClasses} ${sizeClasses[props.size]}`;
  });
</script>

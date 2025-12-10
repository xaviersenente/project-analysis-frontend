<template>
  <div class="relative w-full md:w-64">
    <button
      @click="toggleDropdown"
      class="w-full bg-white border border-slate-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
      <span class="block truncate">
        {{ selectedOption ? selectedOption.label : "Sélectionner une option" }}
      </span>
      <span
        class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <svg
          class="h-5 w-5 text-slate-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true">
          <path
            fill-rule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06-.02L10 10.94l3.7-3.75a.75.75 0 111.08 1.04l-4.25 4.25a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z"
            clip-rule="evenodd" />
        </svg>
      </span>
    </button>

    <div
      v-if="isOpen"
      class="absolute mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none z-50">
      <div
        v-for="option in options"
        :key="option.value"
        @click="selectOption(option)"
        class="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-600 hover:text-white"
        :class="{
          'bg-indigo-600 text-white': selectedOption?.value === option.value,
        }">
        <span class="block truncate">{{ option.label }}</span>
        <span
          v-if="selectedOption?.value === option.value"
          class="absolute inset-y-0 right-0 flex items-center pr-4">
          <svg
            class="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true">
            <path
              fill-rule="evenodd"
              d="M7.707 13.707a1 1 0 01-1.414 0l-3-3a1 1 0 011.414-1.414L7 11.586l7.293-7.293a1 1 0 111.414 1.414l-8 8z"
              clip-rule="evenodd" />
          </svg>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  options: {
    type: Array,
    required: true,
  },
  selectedOption: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["update:selectedOption"]);

const isOpen = ref(false);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const selectOption = (option) => {
  emit("update:selectedOption", option);
  isOpen.value = false;
};
</script>

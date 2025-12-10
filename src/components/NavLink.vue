<template>
  <li>
    <a
      :href="`#${section}`"
      :class="[
        'block text-sm transition-all duration-200',
        isActive
          ? `${activeColor} font-semibold translate-x-2`
          : `text-slate-700 ${hoverColor} hover:translate-x-1`,
        mobile ? 'py-2' : '',
      ]"
      @click="handleClick">
      {{ label }}
    </a>
  </li>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  section: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  activeSection: {
    type: String,
    default: null,
  },
  variant: {
    type: String,
    default: "html", // 'html' ou 'css'
    validator: (value) => ["html", "css"].includes(value),
  },
  mobile: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["navigate"]);

const isActive = computed(() => props.activeSection === props.section);

const activeColor = computed(() => {
  return props.variant === "html" ? "text-orange-600" : "text-blue-600";
});

const hoverColor = computed(() => {
  return props.variant === "html"
    ? "hover:text-orange-600"
    : "hover:text-blue-600";
});

const handleClick = () => {
  emit("navigate", props.section);
};
</script>

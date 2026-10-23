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
import { VARIANT_COLORS } from "../js/constants";

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
    default: "html",
    validator: (value) => ["html", "css"].includes(value),
  },
  mobile: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["navigate"]);

const isActive = computed(() => props.activeSection === props.section);

const activeColor = computed(() => VARIANT_COLORS[props.variant].text);

const hoverColor = computed(() => VARIANT_COLORS[props.variant].hover);

const handleClick = () => {
  emit("navigate", props.section);
};
</script>

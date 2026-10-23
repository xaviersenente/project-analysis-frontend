<template>
  <!-- Accès enseignant : le jeton de l'API est saisi ici, jamais inscrit dans le code (S2) -->
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-100 p-4">
    <form
      class="w-full max-w-sm bg-white rounded-lg shadow-sm border border-slate-200 p-8 flex flex-col gap-4"
      @submit.prevent="valider">
      <p class="font-semibold text-2xl">WebScope</p>
      <label for="jeton" class="text-sm text-slate-700">
        Jeton d'accès à l'API
      </label>
      <input
        id="jeton"
        v-model="valeur"
        type="password"
        autocomplete="off"
        required
        autofocus
        class="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
      <p v-if="refuse" class="text-sm text-red-700" role="alert">
        Jeton refusé : vérifiez-le et recommencez.
      </p>
      <p class="text-sm text-slate-500">
        Il est gardé le temps de la session de navigation.
      </p>
      <button
        type="submit"
        class="bg-indigo-600 text-white rounded-md px-4 py-2 font-semibold hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2">
        Accéder aux analyses
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";

defineProps({
  refuse: { type: Boolean, default: false },
});
const emit = defineEmits(["valider"]);
const valeur = ref("");

const valider = () => {
  if (valeur.value.trim()) emit("valider", valeur.value);
};
</script>

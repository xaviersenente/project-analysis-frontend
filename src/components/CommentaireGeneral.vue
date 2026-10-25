<template>
  <!-- Mode local : le commentaire général, publié avec la note (en développement seulement) -->
  <form class="space-y-2 rounded-md border border-accent/40 bg-accent-fond px-3 py-2 text-sm" @submit.prevent="enregistrer">
    <label for="commentaire-general" class="block font-semibold text-accent">Mode local · commentaire général (publié)</label>
    <textarea id="commentaire-general" v-model="commentaire" rows="3" class="w-full rounded border border-bordure bg-surface px-2 py-1"></textarea>
    <div class="flex flex-wrap items-center gap-2">
      <button type="submit" :disabled="envoi" class="min-h-11 rounded bg-accent px-3 font-semibold text-white disabled:opacity-60">Enregistrer</button>
      <p role="status" :class="erreur ? 'text-non-respecte' : 'text-texte-doux'">{{ message }}</p>
    </div>
  </form>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  slug: { type: String, required: true },
  initial: { type: String, default: "" },
});

const commentaire = ref(props.initial ?? "");
const envoi = ref(false);
const message = ref("");
const erreur = ref(false);

const enregistrer = async () => {
  envoi.value = true;
  erreur.value = false;
  message.value = "Enregistrement…";
  try {
    const reponse = await fetch(`/__webscope/notes/${props.slug}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commentaire: commentaire.value }),
    });
    const donnees = await reponse.json();
    if (!reponse.ok) throw new Error(donnees.erreurs.join(" · "));
    window.location.reload();
  } catch (e) {
    erreur.value = true;
    message.value = e.message;
    envoi.value = false;
  }
};
</script>

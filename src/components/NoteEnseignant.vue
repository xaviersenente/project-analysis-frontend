<template>
  <!-- Mode local : la note de l'enseignant sur un critère (en développement seulement) -->
  <form class="space-y-2 rounded-md border border-accent/40 bg-accent-fond px-3 py-2 text-sm" @submit.prevent="enregistrer()">
    <p class="font-semibold text-accent">Mode local · votre évaluation</p>

    <div v-if="enPoints" class="flex flex-wrap items-center gap-2">
      <label :for="id('points')">Points</label>
      <input
        :id="id('points')"
        v-model.number="points"
        type="number"
        min="0"
        :max="max"
        step="1"
        class="w-20 rounded border border-bordure bg-surface px-2 py-1" />
      <span class="text-texte-doux">sur {{ max }}</span>
    </div>

    <div v-else class="flex flex-wrap items-center gap-2">
      <label :for="id('verdict')">Verdict</label>
      <select :id="id('verdict')" v-model="verdict" class="rounded border border-bordure bg-surface px-2 py-1">
        <option value="">{{ verdictOutil === "a-juger" ? "— à juger —" : `Garder celui de l'outil (${LIBELLES[verdictOutil]})` }}</option>
        <option v-for="v in VERDICTS" :key="v" :value="v">{{ LIBELLES[v] }}</option>
      </select>
    </div>

    <div>
      <label :for="id('commentaire')" class="block">
        {{ justificationRequise ? "Justification (obligatoire pour corriger l'outil)" : "Commentaire" }}
      </label>
      <textarea
        :id="id('commentaire')"
        v-model="commentaire"
        rows="2"
        :required="justificationRequise"
        class="mt-1 w-full rounded border border-bordure bg-surface px-2 py-1"></textarea>
    </div>

    <div class="flex flex-wrap items-center gap-2">
      <button type="submit" :disabled="envoi" class="min-h-11 rounded bg-accent px-3 font-semibold text-white disabled:opacity-60">Enregistrer</button>
      <button v-if="dejaNote" type="button" :disabled="envoi" class="min-h-11 rounded border border-bordure bg-surface px-3" @click="enregistrer(true)">
        Effacer
      </button>
      <p role="status" class="text-sm" :class="erreur ? 'text-non-respecte' : 'text-texte-doux'">{{ message }}</p>
    </div>
  </form>
</template>

<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  slug: { type: String, required: true },
  critere: { type: Object, required: true },
});

const LIBELLES = {
  respecte: "Respecté",
  partiel: "Partiel",
  "non-respecte": "Non respecté",
  "non-mesurable": "Non mesurable",
  "a-juger": "À juger",
};

const c = props.critere;
const verdictOutil = c.enseignant?.verdictOutil ?? c.verdict;
// Une contrainte à juger se note en points ; tout le reste par un verdict
const enPoints = verdictOutil === "a-juger" && c.statut === "C" && Boolean(c.points);
const max = c.points?.max ?? 0;
const VERDICTS = c.statut === "C" ? ["respecte", "partiel", "non-respecte"] : ["respecte", "non-respecte"];
const dejaNote = Boolean(c.enseignant);

const points = ref(c.enseignant?.points ?? null);
const verdict = ref(c.enseignant && !enPoints && c.verdict !== verdictOutil ? c.verdict : "");
const commentaire = ref(c.enseignant?.commentaire ?? "");
const envoi = ref(false);
const message = ref("");
const erreur = ref(false);

const justificationRequise = computed(() => !enPoints && verdictOutil !== "a-juger" && verdict.value !== "");
const id = (suffixe) => `note-${c.id}-${suffixe}`;

const enregistrer = async (effacer = false) => {
  envoi.value = true;
  message.value = "Enregistrement…";
  erreur.value = false;
  const note = effacer
    ? null
    : enPoints
      ? { points: points.value === "" ? null : points.value, commentaire: commentaire.value }
      : { verdict: verdict.value || null, commentaire: commentaire.value };
  try {
    const reponse = await fetch(`/__webscope/notes/${props.slug}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ critere: c.id, note }),
    });
    const donnees = await reponse.json();
    if (!reponse.ok) throw new Error(donnees.erreurs.join(" · "));
    message.value = "Enregistré. Mise à jour de la note…";
    // La note est recalculée au rendu de la page : on la recharge, au même endroit
    sessionStorage.setItem("webscope-retour", c.id);
    window.location.reload();
  } catch (e) {
    erreur.value = true;
    message.value = e.message;
    envoi.value = false;
  }
};
</script>

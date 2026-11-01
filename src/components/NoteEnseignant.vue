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
        step="0.5"
        class="w-20 rounded border border-bordure bg-surface px-2 py-1" />
      <span class="text-texte-doux">sur {{ max }}<template v-if="pointsProposes !== null"> · proposé : {{ String(pointsProposes).replace(".", ",") }}</template></span>
    </div>

    <div v-else-if="echelle" class="flex flex-wrap items-center gap-2">
      <label :for="id('niveau')">Niveau</label>
      <select :id="id('niveau')" v-model="niveau" class="rounded border border-bordure bg-surface px-2 py-1">
        <option value="">— à juger —</option>
        <option v-for="n in echelle" :key="n" :value="n">{{ n === proposee ? `${n} (proposé par l'IA)` : n }}</option>
      </select>
    </div>

    <div v-else class="flex flex-wrap items-center gap-2">
      <label :for="id('verdict')">Verdict</label>
      <select :id="id('verdict')" v-model="verdict" class="rounded border border-bordure bg-surface px-2 py-1">
        <option v-if="!VERDICTS.includes(verdictOutil)" value="">{{ verdictOutil === "a-juger" ? "— à juger —" : `${LIBELLES[verdictOutil]} (outil)` }}</option>
        <option v-for="v in VERDICTS" :key="v" :value="v">{{ v === verdictOutil ? `${LIBELLES[v]} (outil)` : LIBELLES[v] }}</option>
      </select>
    </div>

    <div>
      <label :for="id('commentaire')" class="block">
        {{ justificationRequise ? `Justification (obligatoire pour corriger ${echelle ? "l'IA" : enPoints ? "la proposition" : "l'outil"})` : "Commentaire" }}
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
import { VERDICTS as MOTS, motVerdict } from "../config/verdicts.js";

const props = defineProps({
  slug: { type: String, required: true },
  critere: { type: Object, required: true },
  // Identifiant de la ligne qui porte le formulaire : un critère peut figurer deux fois (axe, liste « À noter »)
  ligne: { type: String, default: "" },
});

const LIBELLES = Object.fromEntries(Object.keys(MOTS).map((v) => [v, motVerdict(v, { majuscule: true })]));

const c = props.critere;
const verdictOutil = c.enseignant?.verdictOutil ?? c.verdict;
// Une contrainte à juger se note en points ; tout le reste par un verdict
const enPoints = verdictOutil === "a-juger" && c.statut === "C" && Boolean(c.points);
const max = c.points?.max ?? 0;
// Critère avec une échelle (proposé par l'IA) : un niveau, la proposition présélectionnée
const echelle = c.echelle ?? null;
const proposee = c.proposition?.niveau ?? null;
const VERDICTS = ["respecte", "partiel", "non-respecte"];
const dejaNote = Boolean(c.enseignant);

// Points proposés par l'outil (Q2) : pré-remplis tant que le jury n'a rien noté
const pointsProposes = c.pointsProposes?.valeur ?? null;
const points = ref(c.enseignant ? c.enseignant.points : pointsProposes);
// Le verdict de l'outil est présélectionné : on ne touche la liste que pour le corriger
const verdict = ref(VERDICTS.includes(c.verdict) ? c.verdict : "");
const niveau = ref(c.enseignant ? (c.enseignant.niveau ?? "") : (proposee ?? ""));
const commentaire = ref(c.enseignant?.commentaire ?? "");
const envoi = ref(false);
const message = ref("");
const erreur = ref(false);

const verdictCorrige = computed(() => verdict.value !== "" && verdict.value !== verdictOutil);
const justificationRequise = computed(() => {
  if (echelle) return Boolean(proposee) && niveau.value !== "" && niveau.value !== proposee;
  if (enPoints) return pointsProposes !== null && points.value !== null && points.value !== "" && points.value !== pointsProposes;
  return verdictOutil !== "a-juger" && verdictCorrige.value;
});
const ligne = props.ligne || `critere-${c.id}`;
const id = (suffixe) => `note-${ligne}-${suffixe}`;

const enregistrer = async (effacer = false) => {
  envoi.value = true;
  message.value = "Enregistrement…";
  erreur.value = false;
  const note = effacer
    ? null
    : echelle
      ? { niveau: niveau.value || null, commentaire: commentaire.value }
      : enPoints
      ? { points: points.value === "" ? null : points.value, commentaire: commentaire.value }
      : { verdict: verdictCorrige.value ? verdict.value : null, commentaire: commentaire.value };
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
    sessionStorage.setItem("webscope-retour", ligne);
    window.location.reload();
  } catch (e) {
    erreur.value = true;
    message.value = e.message;
    envoi.value = false;
  }
};
</script>

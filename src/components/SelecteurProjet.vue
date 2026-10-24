<template>
  <!-- Combobox avec liste (motif ARIA APG « combobox with listbox popup ») -->
  <div class="relative w-full max-w-md" ref="racine">
    <label :for="idChamp" class="sr-only">Projet</label>
    <div
      class="flex items-center gap-2 rounded-md border border-bordure bg-surface px-3 h-10 focus-within:outline-2 focus-within:outline-accent focus-within:outline-offset-2">
      <input
        :id="idChamp"
        ref="champ"
        v-model="recherche"
        type="text"
        role="combobox"
        autocomplete="off"
        spellcheck="false"
        :aria-expanded="ouvert"
        :aria-controls="idListe"
        aria-autocomplete="list"
        :aria-activedescendant="ouvert && actif >= 0 ? idOption(actif) : undefined"
        class="min-w-0 flex-1 bg-transparent font-semibold outline-none placeholder:font-normal placeholder:text-texte-doux"
        placeholder="Rechercher un étudiant"
        @focus="ouvrir"
        @input="surSaisie"
        @keydown="surTouche" />
      <span v-if="courant && !ouvert" class="text-sm text-texte-doux whitespace-nowrap">{{
        courant.groupe
      }}</span>
      <span class="font-mono text-xs text-texte-doux whitespace-nowrap" aria-hidden="true"
        >{{ position }}/{{ options.length }}</span
      >
      <kbd
        class="hidden sm:inline-block rounded border border-bordure px-1.5 font-mono text-xs text-texte-doux"
        aria-hidden="true"
        >/</kbd
      >
    </div>

    <ul
      v-show="ouvert"
      :id="idListe"
      role="listbox"
      aria-label="Étudiants de la promo"
      class="absolute z-40 mt-1 max-h-96 w-full overflow-y-auto rounded-md border border-bordure bg-surface py-1 shadow-lg">
      <li
        v-for="(option, index) in filtrees"
        :id="idOption(index)"
        :key="option.slug"
        role="option"
        :aria-selected="index === actif"
        class="flex cursor-pointer items-center justify-between gap-3 px-3 py-2"
        :class="index === actif ? 'bg-accent-fond' : ''"
        @mousedown.prevent="choisir(option)"
        @mousemove="actif = index">
        <span class="min-w-0">
          <span class="font-semibold" :class="option.slug === courantSlug ? 'text-accent' : ''">{{
            option.nom
          }}</span>
          <span class="ml-2 text-sm text-texte-doux">{{ option.groupe }}</span>
        </span>
        <span
          v-if="option.note !== null"
          class="rounded px-1.5 py-0.5 text-xs font-semibold font-mono bg-neutre-fond text-texte"
          >{{ option.note }} · {{ option.lettre }}</span
        >
        <span v-else class="rounded px-1.5 py-0.5 text-xs text-neutre bg-neutre-fond"
          >non analysé</span
        >
      </li>
      <li v-if="filtrees.length === 0" class="px-3 py-2 text-texte-doux" role="presentation">
        Aucun étudiant ne correspond.
      </li>
    </ul>
    <p class="sr-only" aria-live="polite">{{ annonce }}</p>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";

const props = defineProps({
  // [{ slug, nom, groupe, note: number|null, lettre: string|null }]
  options: { type: Array, required: true },
  courantSlug: { type: String, default: null },
});

const idChamp = "selecteur-projet";
const idListe = "selecteur-projet-liste";
const idOption = (index) => `selecteur-projet-option-${index}`;

const racine = ref(null);
const champ = ref(null);
const courant = computed(() => props.options.find((o) => o.slug === props.courantSlug) ?? null);
const position = computed(() =>
  courant.value ? props.options.indexOf(courant.value) + 1 : "–"
);

const recherche = ref(courant.value?.nom ?? "");
const ouvert = ref(false);
const actif = ref(-1);
const saisieFaite = ref(false);

// Recherche sans tenir compte des accents ni de la casse
const normaliser = (texte) =>
  texte.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

const filtrees = computed(() => {
  if (!saisieFaite.value) return props.options;
  const terme = normaliser(recherche.value.trim());
  return props.options.filter((o) => normaliser(`${o.nom} ${o.groupe}`).includes(terme));
});

const annonce = computed(() =>
  ouvert.value ? `${filtrees.value.length} étudiant${filtrees.value.length > 1 ? "s" : ""}` : ""
);

const ouvrir = () => {
  ouvert.value = true;
  saisieFaite.value = false;
  actif.value = props.options.indexOf(courant.value);
  champ.value?.select();
};

const fermer = () => {
  ouvert.value = false;
  saisieFaite.value = false;
  recherche.value = courant.value?.nom ?? "";
};

const surSaisie = () => {
  ouvert.value = true;
  saisieFaite.value = true;
  actif.value = filtrees.value.length ? 0 : -1;
};

const choisir = (option) => {
  window.location.href = `${import.meta.env.BASE_URL}projet/${option.slug}/`;
};

const surTouche = (evenement) => {
  const total = filtrees.value.length;
  switch (evenement.key) {
    case "ArrowDown":
      evenement.preventDefault();
      if (!ouvert.value) ouvrir();
      else if (total) actif.value = (actif.value + 1) % total;
      break;
    case "ArrowUp":
      evenement.preventDefault();
      if (total) actif.value = (actif.value - 1 + total) % total;
      break;
    case "Enter":
      if (ouvert.value && actif.value >= 0 && filtrees.value[actif.value]) {
        evenement.preventDefault();
        choisir(filtrees.value[actif.value]);
      }
      break;
    case "Escape":
      evenement.preventDefault();
      fermer();
      break;
    case "Tab":
      fermer();
      break;
  }
};

// Défilement de l'option active dans la liste
const suivreActif = () => {
  document.getElementById(idOption(actif.value))?.scrollIntoView({ block: "nearest" });
};

const surClicDehors = (evenement) => {
  if (racine.value && !racine.value.contains(evenement.target)) fermer();
};

// « / » place le curseur dans la recherche, depuis n'importe où (sauf un champ)
const surRaccourci = (evenement) => {
  const cible = evenement.target;
  const dansUnChamp = cible.closest?.("input, textarea, select, [contenteditable]");
  if (evenement.key === "/" && !dansUnChamp) {
    evenement.preventDefault();
    champ.value?.focus();
  }
};

onMounted(() => {
  document.addEventListener("mousedown", surClicDehors);
  document.addEventListener("keydown", surRaccourci);
});
onBeforeUnmount(() => {
  document.removeEventListener("mousedown", surClicDehors);
  document.removeEventListener("keydown", surRaccourci);
});

watch(actif, suivreActif, { flush: "post" });
</script>

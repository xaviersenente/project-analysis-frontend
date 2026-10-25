// @ts-check
import { defineConfig } from "astro/config";

import vue from "@astrojs/vue";

import tailwindcss from "@tailwindcss/vite";
import vignettes from "./integrations/vignettes.mjs";
import notes from "./integrations/notes.mjs";

// https://astro.build/config
export default defineConfig({
  integrations: [vue(), vignettes(), notes()],
  vite: {
    plugins: [tailwindcss()],
  },
});

/**
 * Les types de l'interface, tirés du schéma du résultat (src/schema/resultat.js) : une seule
 * définition, que `npm run check` fait respecter aux composants.
 */
import type { z } from "zod";
import type { resultatSchema, critereSchema, promoSchema, occurrenceSchema } from "./schema/resultat.js";

export type Resultat = z.infer<typeof resultatSchema>;
export type Critere = z.infer<typeof critereSchema>;
export type Occurrence = z.infer<typeof occurrenceSchema>;
export type Promo = z.infer<typeof promoSchema>;
export type ProjetPromo = Promo["projets"][number];

export type Axe = Resultat["grille"]["axes"][number];
export type Note = Resultat["note"];
export type Blocs = NonNullable<Resultat["blocs"]>;
export type Ressources = NonNullable<Resultat["ressources"]>;
export type Image = Ressources["images"][number];
export type Police = Ressources["polices"][number];
export type Historique = NonNullable<Resultat["historique"]>;
export type Parcours = NonNullable<Resultat["parcours"]>;
export type PageParcourue = Parcours["pages"][number];
export type Soutenance = NonNullable<Resultat["soutenance"]>;
export type EnLigne = NonNullable<Resultat["enLigne"]>;
export type PageAnalysee = NonNullable<Resultat["pages"]>[number];
export type Langues = NonNullable<Resultat["langues"]>;
export type Maquette = NonNullable<NonNullable<Blocs["graphique"]>["maquette"]>;

/**
 * Schéma du résultat d'analyse, version 2 (CRITERES-SAE105-2026.md, étape 8)
 * Il fixe le contrat entre le backend (qui écrit un JSON par étudiant)
 * et l'interface (qui les lit au build). Correction P3.
 */
import { z } from "zod";

export const AXES = ["graphique", "ergonomie", "accessibilite", "methodologie"];
export const STATUTS = ["C", "R", "B", "I"];
export const VERDICTS = [
  "respecte",
  "non-respecte",
  "partiel",
  "non-mesurable",
  "a-juger",
];
export const METHODES = ["auto", "depot", "navigateur", "manuel"];
export const TYPES_ALERTE = [
  "site-inaccessible",
  "pages-404",
  "js-remplace-css",
  "historique-reecrit",
  "autre-auteur",
];

export const SLUG_REGEX = /^[a-z0-9-]+$/;

/** Une occurrence : où, et quoi (règle du projet : aucun total sans son détail) */
export const occurrenceSchema = z.object({
  fichier: z.string().min(1),
  ligne: z.number().int().positive().nullable(),
  colonne: z.number().int().positive().nullable(),
  extrait: z.string(),
  // Partie fautive de l'extrait : [début, fin[ en caractères
  surligne: z.tuple([z.number().int().min(0), z.number().int().min(0)]).nullable().optional(),
});

export const seuilSchema = z.object({
  operateur: z.enum(["≤", "≥", "=", "<", ">"]),
  nombre: z.number(),
  unite: z.string(),
});

export const critereSchema = z
  .object({
    id: z.string().regex(/^[GEAM]\d+$/),
    axe: z.enum(AXES),
    libelle: z.string().min(1),
    statut: z.enum(STATUTS),
    methode: z.enum(METHODES),
    verdict: z.enum(VERDICTS),
    // Valeur mesurée, dans l'unité du seuil (7 pour « 7 % »)
    valeur: z.number().nullable(),
    detailValeur: z.string().nullable().optional(),
    seuil: seuilSchema.nullable(),
    detailSeuil: z.string().optional(),
    // Points : contraintes et bonus seulement
    points: z.object({ obtenus: z.number().nullable(), max: z.number() }).nullable(),
    piste: z.string(),
    sourceCours: z.string(),
    // Raison obligatoire quand la mesure a échoué
    raison: z.string().optional(),
    occurrences: z.array(occurrenceSchema),
    totalOccurrences: z.number().int().min(0),
  })
  .refine((c) => c.verdict !== "non-mesurable" || Boolean(c.raison), {
    message: "Un critère « non mesurable » doit donner sa raison",
    path: ["raison"],
  });

const pointsAxeSchema = z.object({ obtenus: z.number(), max: z.number() });

export const resultatSchema = z.object({
  version: z.literal(2),
  source: z.object({
    depot: z.string(),
    ref: z.string(),
    sha: z.string(),
    raison: z.string(),
    analyseLe: z.iso.datetime({ offset: true }),
  }),
  projet: z.object({
    slug: z.string().regex(SLUG_REGEX),
    nom: z.string(),
    groupe: z.string(),
  }),
  // Lus dans le README de l'étudiant ; null si non renseigné
  liens: z.object({
    site: z.url().nullable(),
    depot: z.url().nullable(),
    figma: z.url().nullable(),
  }),
  note: z.object({
    base: z.number(),
    // 100, moins les points des critères non mesurables (jamais imputés à l'étudiant)
    max: z.number().max(100),
    bonus: z.number().min(0),
    totale: z.number().max(100),
    lettre: z.string(),
    // Points des critères « À juger », pas encore attribués
    aJuger: z.number().min(0),
    parAxe: z.object(Object.fromEntries(AXES.map((a) => [a, pointsAxeSchema]))),
  }),
  criteres: z.array(critereSchema),
  alertes: z.array(
    z.object({
      type: z.enum(TYPES_ALERTE),
      message: z.string(),
      details: z.string().optional(),
    })
  ),
  nonMesurable: z.array(z.object({ etape: z.string(), raison: z.string() })),
  // Précisés avec la vue par page, les ressources et la timeline
  pages: z.array(z.looseObject({ fichier: z.string() })).optional(),
  ressources: z.looseObject({}).optional(),
  historique: z.looseObject({}).optional(),
});

export const promoSchema = z.object({
  promo: z.string(),
  dateRendu: z.iso.datetime({ offset: true }),
  projets: z.array(
    z.object({
      slug: z.string().regex(SLUG_REGEX),
      nom: z.string(),
      groupe: z.string(),
    })
  ),
});

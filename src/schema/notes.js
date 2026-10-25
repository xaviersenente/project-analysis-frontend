/**
 * Notes de l'enseignant (mode local) : data/notes/<slug>.json, hors de Git.
 * Un fichier à part du résultat de l'analyse : une nouvelle analyse ne l'écrase jamais.
 */
import { z } from "zod";

export const VERDICTS_ENSEIGNANT = ["respecte", "partiel", "non-respecte"];

export const noteCritereSchema = z.object({
  // Contrainte à juger : les points attribués
  points: z.number().int().min(0).nullable().optional(),
  // Autre critère : le verdict de l'enseignant, qui remplace celui de l'outil
  verdict: z.enum(VERDICTS_ENSEIGNANT).nullable().optional(),
  // Commentaire ; obligatoire pour corriger un verdict de l'outil
  commentaire: z.string().nullable(),
  le: z.string(),
});

export const notesSchema = z.object({
  // Commentaire général, publié avec la note
  commentaire: z.string().nullable(),
  criteres: z.record(z.string().regex(/^[GEAM]\d+$/), noteCritereSchema),
});

export const NOTES_VIDES = { commentaire: null, criteres: {} };

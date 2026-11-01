/**
 * Notes de l'enseignant (mode local) : data/notes/<slug>.json, hors de Git.
 * Un fichier à part du résultat de l'analyse : une nouvelle analyse ne l'écrase jamais.
 */
import { z } from "zod";
import { ID_CRITERE_REGEX } from "./resultat.js";

export const VERDICTS_ENSEIGNANT = ["respecte", "partiel", "non-respecte"];

export const noteCritereSchema = z.object({
  // Contrainte à juger : les points attribués, au demi-point
  points: z.number().min(0).multipleOf(0.5).nullable().optional(),
  // Autre critère : le verdict de l'enseignant, qui remplace celui de l'outil
  verdict: z.enum(VERDICTS_ENSEIGNANT).nullable().optional(),
  // Critère avec une échelle (proposé par l'IA) : le niveau retenu par l'enseignant
  niveau: z.string().min(1).nullable().optional(),
  // Commentaire ; obligatoire pour corriger un verdict de l'outil, le niveau proposé par l'IA ou les points proposés
  commentaire: z.string().nullable(),
  le: z.string(),
});

export const notesSchema = z.object({
  // Commentaire général, publié avec la note
  commentaire: z.string().nullable(),
  criteres: z.record(z.string().regex(ID_CRITERE_REGEX), noteCritereSchema),
});

export const NOTES_VIDES = { commentaire: null, criteres: {} };

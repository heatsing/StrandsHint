import { Difficulty } from "@prisma/client";
import { z } from "zod";
import { slugify } from "./utils";

export const puzzleSchema = z.object({
  date: z.string().min(10),
  puzzleNumber: z.coerce.number().int().positive().optional().or(z.literal("").transform(() => undefined)),
  title: z.string().min(3),
  themeHint: z.string().min(3),
  difficulty: z.nativeEnum(Difficulty),
  spangram: z.string().min(3),
  spangramHint1: z.string().min(3),
  spangramHint2: z.string().min(3),
  spangramDirection: z.string().min(2),
  words: z.string().min(1),
  wordHints: z.string().min(1),
  spoilerLevelContent: z.string().min(10),
  seoTitle: z.string().min(5),
  seoDescription: z.string().min(20),
  slug: z.string().optional(),
  published: z.coerce.boolean().default(false),
});

export type PuzzleFormValues = z.infer<typeof puzzleSchema>;

export function normalizePuzzleInput(values: PuzzleFormValues) {
  const slug = values.slug?.trim() || slugify(`${values.date}-${values.title}`);
  return {
    ...values,
    date: new Date(`${values.date}T12:00:00.000Z`),
    spangram: values.spangram.trim().toUpperCase(),
    words: JSON.stringify(
      values.words
        .split(/\r?\n/)
        .map((word) => word.trim().toUpperCase())
        .filter(Boolean),
    ),
    wordHints: JSON.stringify(
      values.wordHints
        .split(/\r?\n/)
        .map((hint) => hint.trim())
        .filter(Boolean),
    ),
    slug,
  };
}

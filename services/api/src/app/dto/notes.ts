import { z } from 'zod';

export const NOTE_TITLE_MAX = 120;
export const NOTE_BODY_MAX = 2000;

export const createNoteSchema = z.object({
  title: z.string().min(1).max(NOTE_TITLE_MAX),
  body: z.string().max(NOTE_BODY_MAX).optional(),
});

export type CreateNoteDto = z.infer<typeof createNoteSchema>;

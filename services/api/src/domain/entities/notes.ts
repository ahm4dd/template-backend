import { NoteRow, NewNoteRow } from '../../infra/db/schema.ts';

// We just re-export drizzle's rows (drizzle is the source of truth)
// There should be no runtime overhead
export type Note = NoteRow;
export type NewNote = NewNoteRow;

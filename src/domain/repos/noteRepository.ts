import type { NewNote, Note } from '../entities/notes.ts';

export interface NoteRepository {
    create(note: NewNote): Promise<Note>;
    findById(id: string): Promise<Note | null>;
}

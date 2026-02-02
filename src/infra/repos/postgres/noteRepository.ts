import { randomUUID } from 'crypto';
import { notes } from '../../db/schema.ts';
import { eq } from 'drizzle-orm';
import { db } from '../../db/index.ts';
import type { NoteRepository } from '../../../domain/repos/noteRepository.ts';
import type { NewNote, Note } from '../../../domain/entities/notes.ts';
import type { DbClient } from '../../db/index.ts';

export class PostgresNoteRepository implements NoteRepository {
    private readonly dbClient: DbClient;

    constructor(dbClient: DbClient = db) {
        this.dbClient = dbClient;
    }

    async create(note: NewNote): Promise<Note> {
        const id = randomUUID();
        const [created] = await this.dbClient
            .insert(notes)
            .values({
                id,
                title: note.title,
                body: note.body,
            })
            .returning();
        return created;
    }

    async findById(id: string): Promise<Note | null> {
        const [found] = await this.dbClient.select().from(notes).where(eq(notes.id, id)).limit(1);
        if (!found) {
            return null;
        }

        return found;
    }
}

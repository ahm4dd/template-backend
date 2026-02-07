import type { NewNote, Note } from '../../domain/entities/notes.ts';
import type { NoteRepository } from '../../domain/repos/noteRepository.ts';

export class NotesService {
  private readonly repo: NoteRepository;

  constructor(repo: NoteRepository) {
    this.repo = repo;
  }

  /**
   * Creates a new note.
   */
  async createNote(note: NewNote): Promise<Note> {
    // Persist the note.
    const newNote = await this.repo.create(note);
    return newNote;
  }

  /**
   * Retrieves a note by id.
   */
  async getNote(id: string): Promise<Note | null> {
    return this.repo.findById(id);
  }
}

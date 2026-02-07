import type { Request, Response } from 'express';
import { createNoteSchema } from '../../app/dto/notes.ts';
import type { NotesService } from '../../app/services/notes.service.ts';
import { NotFoundError } from '@template/shared';

type NoteParams = {
  id: string;
};

export class NotesController {
  private readonly service: NotesService;

  constructor(service: NotesService) {
    this.service = service;
  }

  async createNote(req: Request, res: Response): Promise<void> {
    const input = createNoteSchema.parse(req.body);
    const note = await this.service.createNote(input);
    res.status(201).json({ data: note });
  }

  async getNote(req: Request<NoteParams>, res: Response): Promise<void> {
    const note = await this.service.getNote(req.params.id);
    if (!note) {
      throw new NotFoundError('Note not found');
    }

    res.status(200).json({ data: note });
  }
}

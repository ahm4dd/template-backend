import { Router } from 'express';
import type { NotesController } from '../controllers/notes.controller.ts';

export function createNotesRouter(controller: NotesController): Router {
  const router = Router();

  router.post('/', controller.createNote.bind(controller));
  router.get('/:id', controller.getNote.bind(controller));

  return router;
}

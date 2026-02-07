import express, { Router } from 'express';
import type { Express } from 'express';
import cors from 'cors';
import { NotesService } from '../app/services/notes.service.ts';
import type { NoteRepository } from '../domain/repos/noteRepository.ts';
import { PostgresNoteRepository } from '../infra/repos/postgres/noteRepository.ts';
import { config } from '../config/env.ts';
import { NotesController } from './controllers/notes.controller.ts';
import { errorHandler } from './middleware/errorHandler.ts';
import { authenticate } from './middleware/authenticate.ts';
import { requestId } from './middleware/requestId.ts';
import { createNotesRouter } from './routes/notes.route.ts';

export type AppDependencies = {
  controllers: {
    notes: NotesController;
  };
  services: {
    notes: NotesService;
  };
  repos: {
    notes: NoteRepository;
  };
};

type RouteDependencies = AppDependencies['controllers'];

type PartialAppDependencies = {
  controllers?: Partial<AppDependencies['controllers']>;
  services?: Partial<AppDependencies['services']>;
  repos?: Partial<AppDependencies['repos']>;
};

export function createApp(deps: PartialAppDependencies = {}): Express {
  const notesRepo = deps.repos?.notes ?? new PostgresNoteRepository();
  const notesService = deps.services?.notes ?? new NotesService(notesRepo);
  const notesController = deps.controllers?.notes ?? new NotesController(notesService);
  const corsOrigins = config.CORS_ORIGINS
    ? config.CORS_ORIGINS.split(',')
        .map((origin) => origin.trim())
        .filter(Boolean)
    : [];
  const corsOptions: cors.CorsOptions = {
    origin: corsOrigins.length > 0 ? corsOrigins : false,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };

  const app = express();

  app.use(requestId);
  app.use('/api/v1', cors(corsOptions));
  app.options('/api/v1/*splat', cors(corsOptions));
  app.use(express.urlencoded({ extended: true })); // 'extended: true' allows rich objects/arrays
  app.use(express.json());

  app.use('/api/v1', authenticate, createRoutes({ notes: notesController }));
  app.use(errorHandler);
  return app;
}

function createRoutes(routeControllers: RouteDependencies): Router {
  const router = Router();

  router.use('/notes', createNotesRouter(routeControllers.notes));

  return router;
}

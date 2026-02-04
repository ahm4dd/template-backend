import type { NextFunction, Request, Response } from 'express';
import { ZodError, z } from 'zod';
import { AppError, logger } from '@template/shared';

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
    if (res.headersSent) {
        return next(err);
    }

    if (err instanceof ZodError) {
        return res.status(400).json({
            error: {
                code: 'VALIDATION_ERROR',
                message: 'Invalid input',
                details: z.flattenError(err),
                requestId: req.id,
            },
        });
    }

    if (err instanceof AppError) {
        return res.status(err.httpStatus).json({
            error: {
                code: err.code,
                message: err.message,
                requestId: req.id,
            },
        });
    }

    logger.error({ err }, 'Unhandled error');
    return res.status(500).json({
        error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Unexpected error',
            requestId: req.id,
        },
    });
}

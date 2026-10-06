import type { NextFunction, Request, Response } from 'express'

type ErrorWithStatus = Error & { status?: number; code?: string }

export function errorMiddleware(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  const appError = error instanceof Error ? error as ErrorWithStatus : null
  const status = appError?.status && appError.status >= 400 && appError.status < 600 ? appError.status : 500
  const message = appError?.message || 'Internal server error'
  const code = appError?.code || (status === 500 ? 'INTERNAL_SERVER_ERROR' : 'BAD_REQUEST')
  return res.status(status).json({ code, message })
}

import { Request, Response, NextFunction } from 'express';

interface CachedResponse {
  statusCode: number;
  body: any;
  headers: Record<string, string>;
  createdAt: number;
  requestPayloadHash?: string;
}

// In-memory idempotency cache (In enterprise production, backed by Redis with TTL)
const idempotencyStore = new Map<string, CachedResponse>();
const idempotencyAuditLogs: Array<{
  key: string;
  timestamp: string;
  action: 'FIRST_EXECUTION' | 'IDEMPOTENT_REPLAY_INTERCEPTED';
  orderId?: string;
  totalAmount?: number;
}> = [];

export function getIdempotencyLogs() {
  return idempotencyAuditLogs;
}

export function clearIdempotencyStore() {
  idempotencyStore.clear();
  idempotencyAuditLogs.length = 0;
}

/**
 * Enterprise Idempotency Middleware for Order Creation & Payments
 * Solves: "Duplicate Payment & Order Deductions" under network retries
 */
export function idempotencyMiddleware(req: Request, res: Response, next: NextFunction) {
  const idempotencyKey = req.header('Idempotency-Key') || req.header('X-Idempotency-Key');

  if (!idempotencyKey) {
    // If no key provided, continue without protection (or throw 400 if strictly mandated)
    return next();
  }

  // Check if this key was already processed
  const cached = idempotencyStore.get(idempotencyKey);
  if (cached) {
    // Intercepted duplicate call!
    res.setHeader('Idempotent-Replay', 'true');
    res.setHeader('X-Cache-Lookup', 'HIT-IDEMPOTENT');

    // Add log
    idempotencyAuditLogs.unshift({
      key: idempotencyKey,
      timestamp: new Date().toISOString(),
      action: 'IDEMPOTENT_REPLAY_INTERCEPTED',
      orderId: cached.body?.data?.orderId,
      totalAmount: cached.body?.data?.totalAmount
    });

    const responseBody = {
      ...cached.body,
      isIdempotentReplay: true,
      meta: {
        ...(cached.body?.meta || {}),
        replayedFromCache: true,
        originalProcessedAt: new Date(cached.createdAt).toISOString(),
        idempotencyProtectionNotice: "Duplicate request intercepted. State was preserved without double deduction."
      }
    };

    return res.status(cached.statusCode).json(responseBody);
  }

  // Override res.json to capture response and store under idempotencyKey
  const originalJson = res.json.bind(res);
  res.json = (body: any): Response => {
    // Save to idempotency store if successful (2xx)
    if (res.statusCode >= 200 && res.statusCode < 300) {
      idempotencyStore.set(idempotencyKey, {
        statusCode: res.statusCode,
        body,
        headers: {},
        createdAt: Date.now()
      });

      idempotencyAuditLogs.unshift({
        key: idempotencyKey,
        timestamp: new Date().toISOString(),
        action: 'FIRST_EXECUTION',
        orderId: body?.data?.orderId,
        totalAmount: body?.data?.totalAmount
      });
    }

    res.setHeader('Idempotency-Key', idempotencyKey);
    return originalJson(body);
  };

  next();
}

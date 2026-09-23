import { Router, Request, Response, NextFunction } from 'express';
import { getCatalog } from '../data/products';

const router = Router();

/**
 * Legacy Anti-Pattern 1: Unstandardized Verb-in-URI
 * /getProductsList (Ignores pagination, ignores field selection, dumps 50-field raw payload)
 */
router.get('/getProductsList', (req: Request, res: Response) => {
  const allProducts = getCatalog();
  // Legacy system returned unstandardized raw array with zero pagination metadata
  res.status(200).json(allProducts);
});

/**
 * Legacy Anti-Pattern 2: Destructive action using HTTP GET
 * /deleteProductItem?id=xxx (Breaks HTTP semantics, dangerous web crawler hazard)
 */
router.get('/deleteProductItem', (req: Request, res: Response) => {
  const { id } = req.query;
  res.status(200).json({
    status: 'ok',
    deleted: id,
    warning: 'ANTI-PATTERN: Mutating resources via HTTP GET violates REST standards.'
  });
});

/**
 * Legacy Anti-Pattern 3: Raw Unhandled 500 Crash
 * Returns raw unformatted exception stack trace that crashes mobile app JSON parsers
 */
router.get('/simulateCrash', (req: Request, res: Response, next: NextFunction) => {
  // Simulates legacy unhandled NullPointerException / ReferenceError
  const legacyUncaughtError: any = new Error(
    "FATAL_NULL_POINTER_EXCEPTION: Legacy MySQL Pool Connection Dropped at com.daraz.legacy.dao.ProductDao.execute(ProductDao.java:412) -- Unhandled raw crash that breaks mobile parsing"
  );
  legacyUncaughtError.statusCode = 500;
  legacyUncaughtError.errorCode = "RAW_LEGACY_SERVER_CRASH";
  next(legacyUncaughtError);
});

export default router;

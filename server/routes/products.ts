import { Router, Request, Response, NextFunction } from 'express';
import { 
  getCatalog, 
  findProductById, 
  addProduct, 
  updateProduct, 
  deleteProduct,
  resetCatalogToDefault 
} from '../data/products';
import { AppError } from '../middleware/errorHandler';
import { applyFieldSelection } from '../utils/fieldSelector';

const router = Router();

/**
 * GET /api/v1/products
 * Noun-based collection endpoint.
 * Supports filtering (?category=...), search (?search=...), sorting (?sort=price_asc),
 * pagination (?page=1&limit=5), and field selection (?fields=title,price).
 */
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    let items = getCatalog();

    // 1. Filtering by category
    const { category, subCategory, brand, inStock } = req.query;
    if (typeof category === 'string' && category.trim()) {
      items = items.filter(p => p.category.toLowerCase() === category.trim().toLowerCase());
    }
    if (typeof subCategory === 'string' && subCategory.trim()) {
      items = items.filter(p => p.subCategory.toLowerCase() === subCategory.trim().toLowerCase());
    }
    if (typeof brand === 'string' && brand.trim()) {
      items = items.filter(p => p.brand.toLowerCase() === brand.trim().toLowerCase());
    }
    if (inStock === 'true') {
      items = items.filter(p => p.stock > 0);
    }

    // 2. Search by keyword
    const search = req.query.search;
    if (typeof search === 'string' && search.trim()) {
      const q = search.trim().toLowerCase();
      items = items.filter(p => 
        p.title.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q)) ||
        p.sku.toLowerCase().includes(q)
      );
    }

    // 3. Sorting
    const sort = (req.query.sort as string) || 'default';
    if (sort === 'price_asc') {
      items = [...items].sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      items = [...items].sort((a, b) => b.price - a.price);
    } else if (sort === 'rating_desc') {
      items = [...items].sort((a, b) => b.rating - a.rating);
    } else if (sort === 'newest') {
      items = [...items].sort((a, b) => new Date(b.auditLog.createdAt).getTime() - new Date(a.auditLog.createdAt).getTime());
    }

    // 4. Pagination
    const total = items.length;
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit as string, 10) || 10));
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedItems = items.slice(startIndex, startIndex + limit);

    // 5. Overfetching Solution: Field Selection (?fields=title,price,thumbnailUrl)
    const fieldsQuery = req.query.fields as string | undefined;
    const { filtered, meta: fieldMeta } = applyFieldSelection(paginatedItems, fieldsQuery);

    res.status(200).json({
      success: true,
      data: {
        items: filtered,
        pagination: {
          total,
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        },
        payloadOptimization: fieldMeta
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/v1/products/:id
 * Individual resource endpoint.
 * Supports sparse fieldsets via ?fields=title,price.
 * Throws 404 with standardized error if not found.
 */
router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const product = findProductById(id);

    if (!product) {
      throw new AppError(
        404,
        'PRODUCT_NOT_FOUND',
        `Product with ID '${id}' was not found in catalog.`,
        { requestedId: id, availableCategories: ['Electronics', 'Groceries', 'Home & Kitchen', 'Fashion'] }
      );
    }

    const fieldsQuery = req.query.fields as string | undefined;
    const { filtered, meta: fieldMeta } = applyFieldSelection(product, fieldsQuery);

    res.status(200).json({
      success: true,
      data: filtered,
      meta: {
        payloadOptimization: fieldMeta
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/v1/products
 * Creates a new product resource.
 * Strict client data validation returning 400 Bad Request on invalid payload.
 * Returns 201 Created on success with Location header.
 */
router.post('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = req.body;
    const validationErrors: Array<{ field: string; issue: string }> = [];

    // Client validation rules
    if (!body || typeof body !== 'object') {
      throw new AppError(400, 'MALFORMED_JSON_PAYLOAD', 'Request body must be a valid JSON object');
    }

    if (!body.title || typeof body.title !== 'string' || body.title.trim().length < 3) {
      validationErrors.push({
        field: 'title',
        issue: 'Product title is required and must contain at least 3 characters.'
      });
    }

    if (body.price === undefined || typeof body.price !== 'number' || body.price <= 0) {
      validationErrors.push({
        field: 'price',
        issue: 'Price must be a valid positive number greater than 0.'
      });
    }

    if (!body.category || typeof body.category !== 'string' || body.category.trim().length < 2) {
      validationErrors.push({
        field: 'category',
        issue: 'Category is required (e.g., Electronics, Groceries, Fashion, Home & Kitchen).'
      });
    }

    if (body.stock !== undefined && (typeof body.stock !== 'number' || body.stock < 0)) {
      validationErrors.push({
        field: 'stock',
        issue: 'Stock quantity cannot be negative.'
      });
    }

    if (validationErrors.length > 0) {
      throw new AppError(
        400,
        'VALIDATION_FAILED',
        'One or more fields failed validation requirements.',
        validationErrors
      );
    }

    const created = addProduct(body);

    res.setHeader('Location', `/api/v1/products/${created.id}`);
    res.status(201).json({
      success: true,
      data: created,
      meta: {
        message: 'Product resource successfully created.',
        statusCode: 201,
        location: `/api/v1/products/${created.id}`
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/v1/products/:id
 * Idempotent Resource Replacement.
 * Calling this endpoint multiple times with the exact same payload
 * leaves the server state completely identical and idempotent.
 */
router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const body = req.body;

    // Validate required fields for full resource replacement
    const validationErrors: Array<{ field: string; issue: string }> = [];
    if (!body.title || typeof body.title !== 'string' || body.title.trim().length < 3) {
      validationErrors.push({ field: 'title', issue: 'PUT requires title with >= 3 characters.' });
    }
    if (body.price === undefined || typeof body.price !== 'number' || body.price <= 0) {
      validationErrors.push({ field: 'price', issue: 'PUT requires valid price > 0.' });
    }
    if (!body.category) {
      validationErrors.push({ field: 'category', issue: 'PUT requires a category.' });
    }

    if (validationErrors.length > 0) {
      throw new AppError(400, 'VALIDATION_FAILED', 'PUT payload invalid', validationErrors);
    }

    const updated = updateProduct(id, body, true);

    if (!updated) {
      throw new AppError(
        404,
        'PRODUCT_NOT_FOUND',
        `Cannot update: Product with ID '${id}' does not exist.`
      );
    }

    res.status(200).json({
      success: true,
      data: updated,
      meta: {
        isIdempotent: true,
        message: 'Product fully replaced via idempotent PUT operation.'
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/v1/products/:id
 * Proper HTTP DELETE verb on noun URI.
 * Returns 200 with deletion summary or 204 No Content.
 */
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const deleted = deleteProduct(id);

    if (!deleted) {
      throw new AppError(
        404,
        'PRODUCT_NOT_FOUND',
        `Cannot delete: Product with ID '${id}' was not found.`
      );
    }

    res.status(200).json({
      success: true,
      meta: {
        message: `Product '${id}' successfully removed from catalog.`,
        deletedId: id,
        timestamp: new Date().toISOString()
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/v1/products/reset
 * Helper to reset catalog back to initial state
 */
router.post('/catalog/reset', (req: Request, res: Response) => {
  resetCatalogToDefault();
  res.status(200).json({
    success: true,
    message: 'Catalog successfully restored to pristine initial dataset.'
  });
});

export default router;

import { Router, Request, Response, NextFunction } from 'express';
import { Order, OrderItem } from '../types';
import { findProductById } from '../data/products';
import { AppError } from '../middleware/errorHandler';
import { idempotencyMiddleware, getIdempotencyLogs, clearIdempotencyStore } from '../middleware/idempotency';

const router = Router();

// In-memory orders collection
let orders: Order[] = [];

/**
 * POST /api/v1/orders
 * Creates a new order. Protected by enterprise idempotency middleware.
 * If the mobile client times out on flaky 3G/4G and retries with the same Idempotency-Key,
 * this endpoint returns the saved order without duplicating charges or stock deductions.
 */
router.post('/', idempotencyMiddleware, (req: Request, res: Response, next: NextFunction) => {
  try {
    const { customer, items, paymentMethod } = req.body;
    const idempotencyKey = (req.header('Idempotency-Key') || req.header('X-Idempotency-Key')) as string | undefined;

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new AppError(400, 'EMPTY_ORDER_ITEMS', 'Order must contain at least one item');
    }

    if (!customer || !customer.name || !customer.phone) {
      throw new AppError(400, 'INCOMPLETE_CUSTOMER_INFO', 'Customer name and phone number are required for delivery');
    }

    // Calculate item pricing
    const processedItems: OrderItem[] = [];
    let subtotal = 0;

    for (const item of items) {
      const product = findProductById(item.productId);
      const unitPrice = product ? product.price : (Number(item.unitPrice) || 1000);
      const quantity = Math.max(1, Number(item.quantity) || 1);
      const itemSubtotal = unitPrice * quantity;

      processedItems.push({
        productId: item.productId || 'custom-item',
        title: product ? product.title : (item.title || 'Item'),
        unitPrice,
        quantity,
        subtotal: itemSubtotal
      });

      subtotal += itemSubtotal;
    }

    const shippingFee = subtotal > 5000 ? 0 : 250;
    const tax = Math.round(subtotal * 0.05); // 5% GST
    const totalAmount = subtotal + shippingFee + tax;

    const orderId = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 900 + 100)}`;

    const newOrder: Order = {
      orderId,
      idempotencyKey,
      customer: {
        customerId: customer.customerId || `CUST-${Math.floor(Math.random() * 9000 + 1000)}`,
        name: customer.name,
        email: customer.email || `${customer.name.toLowerCase().replace(/\s+/g, '')}@example.pk`,
        phone: customer.phone,
        city: customer.city || 'Karachi',
        shippingAddress: customer.shippingAddress || 'House 14, Block 5, Gulshan-e-Iqbal'
      },
      items: processedItems,
      subtotal,
      tax,
      shippingFee,
      totalAmount,
      currency: 'PKR',
      paymentMethod: paymentMethod || 'JazzCash',
      paymentStatus: 'PAID',
      orderStatus: 'CONFIRMED',
      createdAt: new Date().toISOString(),
      processedAt: new Date().toISOString()
    };

    orders.unshift(newOrder);

    res.status(201).json({
      success: true,
      data: newOrder,
      meta: {
        idempotencyProtected: Boolean(idempotencyKey),
        idempotencyKeyProvided: idempotencyKey || null,
        message: 'Order placed successfully and payment captured once.'
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/v1/orders
 * Returns list of orders and recent idempotency audit logs
 */
router.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: {
      orders,
      idempotencyAuditLogs: getIdempotencyLogs()
    }
  });
});

/**
 * POST /api/v1/orders/reset
 * Resets orders and idempotency cache for live simulation
 */
router.post('/reset', (req: Request, res: Response) => {
  orders = [];
  clearIdempotencyStore();
  res.status(200).json({
    success: true,
    message: 'Orders and Idempotency store cleared successfully.'
  });
});

export default router;

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import productsRouter from './server/routes/products';
import ordersRouter from './server/routes/orders';
import legacyRouter from './server/routes/legacy';
import graphqlRouter from './server/routes/graphql';
import { globalErrorHandler, notFoundHandler } from './server/middleware/errorHandler';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // 1. Core middlewares
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // CORS and API telemetry headers
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Idempotency-Key, X-Idempotency-Key');
    res.setHeader('X-API-Version', 'v1.0.0');
    res.setHeader('X-Architecture', 'RESTful-Standardized-and-GraphQL');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // 2. Health & System Discovery
  app.get('/api/health', (req, res) => {
    res.status(200).json({
      status: 'UP',
      architecture: 'Enterprise E-Commerce API (Daraz/Bazaar Modernization)',
      timestamp: new Date().toISOString(),
      modules: {
        module1_rest_modeling: 'ACTIVE (Noun URIs: /api/v1/products, Verbs: GET/POST/PUT/DELETE, Pagination, Filtering)',
        module2_consistent_errors: 'ACTIVE (400 Bad Request validation, 404 Standardized, 201 Created)',
        module3_overfetching_solution: 'ACTIVE (GraphQL: /graphql, Sparse Fieldsets: ?fields=title,price)',
        idempotency_protection: 'ACTIVE (Idempotency-Key header on /api/v1/orders prevents double deductions)'
      }
    });
  });

  // 3. API Routers
  app.use('/api/v1/products', productsRouter);
  app.use('/api/v1/orders', ordersRouter);
  app.use('/api/v1/legacy', legacyRouter);
  app.use('/graphql', graphqlRouter);

  // 4. API 404 catch-all for /api/* routes only
  app.use('/api/*', notFoundHandler);

  // 5. Global API Error Handler
  app.use(globalErrorHandler);

  // 6. Vite middleware for frontend client & dev server
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Modern E-Commerce API Server running on http://0.0.0.0:${PORT}`);
    console.log(`📦 REST Endpoints:  /api/v1/products [GET, POST, PUT, DELETE]`);
    console.log(`🛡️  Idempotent Order: /api/v1/orders [POST with Idempotency-Key]`);
    console.log(`⚡ GraphQL Endpoint: /graphql [POST query]`);
  });
}

startServer();

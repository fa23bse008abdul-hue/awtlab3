# E-Commerce Platform API Modernization
### High-Scale Architecture (Daraz / Bazaar Technologies Analogy)

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.21-blue.svg)](https://expressjs.com/)
[![GraphQL](https://img.shields.io/badge/GraphQL-16.8-magenta.svg)](https://graphql.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📌 Executive Summary & Problem Background

As e-commerce platforms like **Daraz** and **Bazaar Technologies** rapidly expand across emerging markets with flaky mobile connectivity (2G/3G/4G) and millions of daily active users, legacy backend architectures trigger critical production failures:

1. **Unstandardized URIs & Server Crashes**:
   - Legacy RPC endpoints mixed verbs into URIs (`/getProductsList`, `/deleteProductItem`).
   - Unhandled exceptions resulted in raw `500 Internal Server Error` HTML/stack dumps that crashed mobile JSON parsers.
2. **Duplicate Payment & Order Deductions**:
   - Flaky 3G/4G connections caused network dropouts immediately after mobile users tapped "Checkout / Pay with JazzCash/Easypaisa".
   - Client retries hit non-idempotent endpoints, creating **multiple duplicate orders** and debiting customer wallets multiple times.
3. **The REST Over-Fetching Dilemma**:
   - To render a lightweight home banner or flash sale carousel containing just the **Title** and **Price**, mobile apps called `/api/v1/products/123`.
   - The server dumped a 50+ field enterprise JSON payload (heavy warehouse SKU maps, internal vendor costs, raw markdown, bin locations, shipping policies, audit logs) totaling ~18 KB per item.
   - For 10 products on a mobile viewport, ~180 KB was transferred instead of ~2.5 KB—draining cellular data allowances and mobile battery life.

This repository implements the modernized enterprise-grade API architecture resolving all three challenges.

---

## 🏗️ Architecture & Modules Overview

### Module 1: RESTful Architecture & Resource Modeling
- **Strictly Noun-Based URIs**: All product operations reside under the uniform resource path `/api/v1/products` and `/api/v1/products/:id`.
- **Accurate HTTP Verbs**:
  - `GET`: Safe, idempotent retrieval with filtering, sorting, and pagination.
  - `POST`: Non-idempotent creation returning `201 Created` with `Location` header.
  - `PUT`: **Idempotent** state replacement—repeated identical calls yield the exact same resource state without side-effects or duplication.
  - `DELETE`: Resource removal returning `200 OK` or `204 No Content`.
- **Query Parameter Handling**:
  - Filtering: `?category=Electronics&brand=Samsung`
  - Pagination: `?page=1&limit=5` (with metadata: `total`, `totalPages`, `hasNextPage`)
  - Sorting: `?sort=price_asc`, `?sort=price_desc`, `?sort=rating_desc`
  - Search: `?search=phone`

### Module 2: Standardized JSON Error Schema & Status Codes
Every error response returns a consistent, machine-readable envelope with zero raw 500 crashes:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "error_code": "VALIDATION_FAILED",
    "message": "One or more fields failed validation requirements.",
    "details": [
      { "field": "price", "issue": "Price must be a valid positive number greater than 0." },
      { "field": "title", "issue": "Product title is required and must contain at least 3 characters." }
    ],
    "timestamp": "2026-09-22T10:15:00.000Z",
    "path": "/api/v1/products",
    "method": "POST"
  }
}
```

- **`400 Bad Request`**: Client-side validation failures (e.g., negative prices, missing mandatory fields).
- **`404 Not Found`**: Non-existent resource lookups (`PRODUCT_NOT_FOUND`) with actionable error details.
- **`201 Created`**: Successful resource creation with `Location` header.
- **`200 OK`**: Successful idempotent updates and retrievals.

### Module 3: Over-Fetching Solutions (GraphQL & Sparse Fieldsets)
We provide **two enterprise solutions** enabling client applications to dictate the exact response structure:

#### Solution A: GraphQL Endpoint (`POST /graphql`)
Clients write precise queries requesting only required fields:
```graphql
query GetBannerProducts {
  products(limit: 5) {
    id
    title
    price
    thumbnailUrl
  }
}
```
- **Payload Size Reduction**: **~98.4% bandwidth savings** (from ~18,500 bytes down to ~280 bytes per product).

#### Solution B: REST Sparse Fieldsets (`?fields=title,price`)
For RESTful clients unable to adopt GraphQL:
```http
GET /api/v1/products/prod-101?fields=title,price
```
Server dynamically strips all remaining 45+ fields, preserving bandwidth and client parsing overhead.

### Module 4: Idempotency & Order Deduplication
- Mobile clients send an `Idempotency-Key: <UUID>` header with checkout requests:
  ```http
  POST /api/v1/orders
  Idempotency-Key: ord-uuid-7491-bazaar
  ```
- If network drops and the mobile app automatically retries, the server recognizes the `Idempotency-Key`, suppresses redundant processing, and replays the original response with header `Idempotent-Replay: true`.
- **Result**: Zero double charges and zero duplicate orders.

---

## 🚀 Quickstart & Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [npm](https://www.npmjs.com/) (v9.0.0 or higher)

### 1. Installation
Clone the repository and install all dependencies:
```bash
git clone https://github.com/your-org/ecommerce-api-modernization.git
cd ecommerce-api-modernization
npm install
```

### 2. Running in Development Mode
Starts the full-stack server (Express backend + Interactive Developer Console at `http://localhost:3000`):
```bash
npm run dev
```

### 3. Production Build & Start
```bash
# Build frontend assets and bundle the backend with esbuild
npm run build

# Start the production Node.js server
npm start
```
The server will bind to `http://0.0.0.0:3000`.

---

## 📡 API Reference & cURL Examples

### 1. List Products (with Filtering & Pagination)
```bash
curl -X GET "http://localhost:3000/api/v1/products?category=Electronics&page=1&limit=5&sort=price_asc"
```

### 2. Sparse Fieldset (Over-fetching Solution via REST)
```bash
curl -X GET "http://localhost:3000/api/v1/products/prod-101?fields=title,price,thumbnailUrl"
```

### 3. Create Product (Validation & 201 Created)
```bash
curl -X POST "http://localhost:3000/api/v1/products" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Bazaar Fresh Organic Honey 500g",
    "price": 1250,
    "category": "Groceries",
    "stock": 100
  }'
```

### 4. Trigger 400 Bad Request (Validation Failure)
```bash
curl -X POST "http://localhost:3000/api/v1/products" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "AB",
    "price": -50,
    "category": ""
  }'
```

### 5. Idempotent PUT (Resource Update)
```bash
curl -X PUT "http://localhost:3000/api/v1/products/prod-101" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Samsung Galaxy S25 Ultra 5G (512GB - Updated)",
    "price": 379999,
    "category": "Electronics"
  }'
```

### 6. Idempotent Order Creation (Network Retry Safety)
```bash
curl -X POST "http://localhost:3000/api/v1/orders" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: test-order-uuid-9901" \
  -d '{
    "customer": {
      "name": "Hamza Tariq",
      "phone": "+923001234567",
      "city": "Lahore"
    },
    "items": [
      { "productId": "prod-103", "quantity": 2 }
    ],
    "paymentMethod": "JazzCash"
  }'
```
*Repeating this request with the same `Idempotency-Key` returns `Idempotent-Replay: true` without deducting payment again.*

### 7. GraphQL Query (Solving Over-fetching)
```bash
curl -X POST "http://localhost:3000/graphql" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { products(limit: 3) { id title price thumbnailUrl } }"
  }'
```

---

## 📊 Bandwidth Savings & Cellular Impact Benchmark

| Metric | Legacy REST (`/getProductsList`) | Modern Sparse REST (`?fields=title,price`) | GraphQL Query (`/graphql`) |
| :--- | :--- | :--- | :--- |
| **Payload per item** | ~18,500 bytes (50+ fields) | ~340 bytes (3 fields) | ~260 bytes (3 fields) |
| **10 Items Payload** | **185 KB** | **3.4 KB** | **2.6 KB** |
| **Bandwidth Reduction** | Base | **98.1% Savings** | **98.6% Savings** |
| **Daily Savings (500k DAU)**| 92.5 GB transferred | 1.7 GB transferred | 1.3 GB transferred |
| **Mobile Battery Drain** | High (JSON parsing of 500 keys) | Negligible | Negligible |

---

## 🧪 Interactive Developer Portal
Open `http://localhost:3000` in any web browser to access the built-in **Modern Architecture Workbench**:
- **REST API Explorer**: Interactive verb tester (GET, POST, PUT, DELETE) with real-time status code, headers, and response visualizer.
- **Error Simulation Matrix**: Instantly reproduce and inspect 400 Bad Request, 404 Not Found, and legacy unhandled crash comparisons.
- **Over-Fetching Benchmark Lab**: Real-time side-by-side payload comparison and byte savings calculator.
- **Idempotency Simulator**: Trigger simulated network failures and test retry deduplication live.
- **GraphQL Playground**: Execute dynamic queries directly against the schema.

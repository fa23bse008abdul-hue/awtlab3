#🛒 E-Commerce Platform API Modernization

High-Scale API Architecture for Modern E-Commerce Platforms

A production-oriented API modernization project built with Node.js, Express.js, TypeScript, and GraphQL, designed to address common challenges in high-scale e-commerce systems operating over unreliable mobile networks.

📌 Overview

Modern e-commerce platforms such as Daraz and Bazaar Technologies need APIs that can handle millions of users while remaining reliable on unstable 2G/3G/4G networks.

Legacy API architectures commonly introduce problems such as:

❌ Non-standard RPC-style URLs

❌ Unstructured server errors

❌ Duplicate orders and payment deductions

❌ Excessive API response payloads

❌ Poor mobile performance

❌ Difficult-to-maintain API contracts

This project demonstrates a modern API architecture that addresses these problems using:

✅ RESTful resource modeling

✅ Standard HTTP methods and status codes

✅ Centralized JSON error handling

✅ GraphQL field selection

✅ REST sparse fieldsets

✅ Idempotency keys for order creation

✅ Filtering, searching, sorting, and pagination

✅ Interactive API developer portal

🏗️ Architecture
                         ┌──────────────────────┐
                         │   Web / Mobile App   │
                         └──────────┬───────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
              REST API                         GraphQL API
                    │                               │
                    └───────────────┬───────────────┘
                                    │
                         ┌──────────▼──────────┐
                         │   Express Server    │
                         │     TypeScript      │
                         └──────────┬──────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
       Product Service        Order Service        Error Handler
              │                     │                     │
              │              Idempotency Layer             │
              │                     │                     │
              └─────────────────────┼─────────────────────┘
                                    │
                         ┌──────────▼──────────┐
                         │   Data / Storage    │
                         └─────────────────────┘

🚀 Key Features
1. RESTful API Architecture

The API follows resource-oriented REST principles instead of action-based RPC URLs.

❌ Legacy
/getProductsList
/deleteProductItem
/updateProduct

✅ Modern
GET    /api/v1/products
GET    /api/v1/products/:id
POST   /api/v1/products
PUT    /api/v1/products/:id
DELETE /api/v1/products/:id


This provides a consistent and predictable API contract.

2. Product Filtering, Search & Pagination
Filtering
GET /api/v1/products?category=Electronics&brand=Samsung

Pagination
GET /api/v1/products?page=1&limit=5


Example pagination metadata:

{
  "page": 1,
  "limit": 5,
  "total": 100,
  "totalPages": 20,
  "hasNextPage": true
}

Sorting
GET /api/v1/products?sort=price_asc

GET /api/v1/products?sort=price_desc

GET /api/v1/products?sort=rating_desc

Search
GET /api/v1/products?search=phone

🛡️ 3. Standardized Error Handling

All API errors follow a consistent JSON structure.

Instead of returning raw HTML or stack traces, the server returns machine-readable errors.

Example
{
  "success": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "error_code": "VALIDATION_FAILED",
    "message": "One or more fields failed validation requirements.",
    "details": [
      {
        "field": "price",
        "issue": "Price must be a valid positive number greater than 0."
      },
      {
        "field": "title",
        "issue": "Product title is required and must contain at least 3 characters."
      }
    ],
    "timestamp": "2026-09-22T10:15:00.000Z",
    "path": "/api/v1/products",
    "method": "POST"
  }
}

Supported Status Codes
Status	Usage
200 OK	Successful retrieval/update
201 Created	Resource successfully created
400 Bad Request	Validation/client error
404 Not Found	Resource does not exist
500 Internal Server Error	Unexpected server error
📦 4. Solving REST Over-Fetching

Traditional REST APIs often return much more information than a client actually needs.

For example, a mobile product card may only require:

{
  "title": "Samsung Galaxy S25",
  "price": 379999,
  "thumbnailUrl": "/images/s25.jpg"
}


Instead of returning dozens of unnecessary fields such as warehouse data, vendor costs, SKU mappings, shipping policies, and audit information.

This project provides two solutions.

🔹 Solution A — GraphQL

Clients can request exactly the fields they need.

Query
query GetBannerProducts {
  products(limit: 5) {
    id
    title
    price
    thumbnailUrl
  }
}

Response
{
  "data": {
    "products": [
      {
        "id": "prod-101",
        "title": "Samsung Galaxy S25",
        "price": 379999,
        "thumbnailUrl": "/images/s25.jpg"
      }
    ]
  }
}

🔹 Solution B — REST Sparse Fieldsets

REST clients can use the fields parameter.

GET /api/v1/products/prod-101?fields=title,price,thumbnailUrl


Response:

{
  "title": "Samsung Galaxy S25",
  "price": 379999,
  "thumbnailUrl": "/images/s25.jpg"
}


This allows existing REST clients to reduce bandwidth without migrating to GraphQL.

🔐 5. Idempotency & Order Deduplication

One of the most important problems in mobile e-commerce is duplicate requests caused by unstable network connections.

Problem
User clicks Pay
       ↓
Order created
       ↓
Payment processed
       ↓
Network connection drops
       ↓
Mobile app retries request
       ↓
Duplicate order/payment ❌

Solution

Clients send a unique Idempotency-Key.

POST /api/v1/orders
Idempotency-Key: ord-uuid-7491-bazaar


The server stores the result associated with the key.

If the same request is retried:

Request #1
    ↓
Process Order
    ↓
Store Result
    ↓
Return Response

Request #2
Same Idempotency-Key
    ↓
Existing Result Found
    ↓
Replay Original Response
    ↓
No Duplicate Order


The replay response contains:

Idempotent-Replay: true


This makes order creation safe against network retries.

📡 API Examples
Get Products
curl -X GET \
"http://localhost:3000/api/v1/products?category=Electronics&page=1&limit=5&sort=price_asc"

Get Specific Fields
curl -X GET \
"http://localhost:3000/api/v1/products/prod-101?fields=title,price,thumbnailUrl"

Create Product
curl -X POST \
"http://localhost:3000/api/v1/products" \
-H "Content-Type: application/json" \
-d '{
  "title": "Bazaar Fresh Organic Honey 500g",
  "price": 1250,
  "category": "Groceries",
  "stock": 100
}'


Expected:

201 Created

Validation Error
curl -X POST \
"http://localhost:3000/api/v1/products" \
-H "Content-Type: application/json" \
-d '{
  "title": "AB",
  "price": -50,
  "category": ""
}'


Expected:

400 Bad Request

Idempotent Order
curl -X POST \
"http://localhost:3000/api/v1/orders" \
-H "Content-Type: application/json" \
-H "Idempotency-Key: test-order-uuid-9901" \
-d '{
  "customer": {
    "name": "Customer",
    "phone": "+923001234567",
    "city": "Lahore"
  },
  "items": [
    {
      "productId": "prod-103",
      "quantity": 2
    }
  ],
  "paymentMethod": "JazzCash"
}'


Repeating the request with the same key returns the previously generated result instead of creating another order.

GraphQL
curl -X POST \
"http://localhost:3000/graphql" \
-H "Content-Type: application/json" \
-d '{
  "query": "query { products(limit: 3) { id title price thumbnailUrl } }"
}'

📊 Performance Benchmark

The project demonstrates the impact of reducing unnecessary API data.

Metric	Legacy REST	Sparse REST	GraphQL
Payload / item	~18,500 B	~340 B	~260 B
10 items	~185 KB	~3.4 KB	~2.6 KB
Bandwidth reduction	Baseline	~98.1%	~98.6%
Mobile parsing	High	Low	Low
Example
Legacy REST
18,500 B × 10
       ↓
~185 KB

Sparse REST
340 B × 10
       ↓
~3.4 KB

GraphQL
260 B × 10
       ↓
~2.6 KB


The reduction is especially useful for mobile users on limited or unstable cellular connections.

🧪 Interactive Developer Portal

The project includes a built-in developer portal available at:

http://localhost:3000

REST API Explorer

Test:

GET

POST

PUT

DELETE

and inspect:

HTTP status codes

Response headers

JSON responses

Error Simulation Matrix

Test and compare:

400 Bad Request

404 Not Found

Standardized API errors

Server failure scenarios

Over-Fetching Benchmark Lab

Compare:

Legacy REST
      ↓
Sparse REST
      ↓
GraphQL


and visualize payload-size savings.

Idempotency Simulator

Simulate:

Request → Network Failure → Retry → Deduplication

GraphQL Playground

Execute GraphQL queries directly against the API.

🛠️ Technology Stack
Technology	Purpose
Node.js	Backend runtime
Express.js	REST API framework
TypeScript	Type-safe development
GraphQL	Flexible data querying
npm	Package management
esbuild	Production bundling
JSON	API data format
HTTP/REST	Resource communication
📁 Project Structure
ecommerce-api-modernization/
│
├── src/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── middleware/
│   ├── graphql/
│   ├── models/
│   ├── types/
│   └── app.ts
│
├── public/
│   └── developer-portal/
│
├── package.json
├── tsconfig.json
└── README.md

⚙️ Installation
Prerequisites

Node.js v18+

npm v9+

Clone Repository
git clone https://github.com/your-org/ecommerce-api-modernization.git

cd ecommerce-api-modernization

Install Dependencies
npm install

▶️ Running the Project
Development
npm run dev


Open:

http://localhost:3000

Production Build
npm run build


Then:

npm start


The production server runs on:

http://0.0.0.0:3000

🎯 Project Objectives

This project demonstrates the following modern backend concepts:

 RESTful API design

 Resource-based URLs

 Correct HTTP methods

 HTTP status codes

 Centralized error handling

 JSON error envelopes

 Filtering

 Searching

 Sorting

 Pagination

 GraphQL

 Sparse fieldsets

 Idempotency keys

 Duplicate order prevention

 Mobile bandwidth optimization

 Interactive API testing

📈 Expected Benefits

The modernized architecture provides:

Better API consistency through resource-oriented endpoints.

Improved client reliability through standardized errors.

Lower bandwidth usage through GraphQL and sparse fieldsets.

Safer payment/order retries through idempotency.

Better mobile performance through smaller JSON payloads.

Improved maintainability through TypeScript and modular architecture.

Better developer experience through the interactive API portal.

🔮 Future Improvements

The current project can be extended with:

PostgreSQL or MongoDB persistence

Redis-based distributed idempotency storage

JWT/OAuth authentication

Role-based access control

Redis caching

Message queues such as Kafka or RabbitMQ

Distributed tracing

Rate limiting

API monitoring and metrics

Docker and Kubernetes deployment

Automated unit and integration testing

CI/CD pipelines

📝 Conclusion

This project demonstrates the modernization of a traditional e-commerce backend into a structured, scalable, and mobile-friendly API architecture.

The combination of REST, GraphQL, TypeScript, standardized error handling, sparse fieldsets, and idempotency addresses several important challenges faced by modern e-commerce applications.

The architecture is designed with high-scale and unreliable mobile connectivity in mind, making it suitable as a practical demonstration of modern enterprise API design.

📄 License

This project is licensed under the MIT License.

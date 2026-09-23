# 🛒 E-Commerce Platform API Modernization
## High-Scale API Architecture for Modern E-Commerce Platforms
A production-oriented E-Commerce API modernization project built with Node.js, Express.js, TypeScript, REST, and GraphQL.

This project modernizes a traditional e-commerce backend to address common problems faced by large-scale platforms operating over unreliable mobile networks.

# 🎯 Problem Statement
Modern e-commerce platforms need APIs that are:

Scalable

Consistent

Mobile-friendly

Reliable during network failures

Easy for frontend/mobile developers to consume

Safe against duplicate requests

Legacy API architectures commonly suffer from:

❌ Non-standard RPC-style URLs such as /getProductsList

❌ Incorrect HTTP method usage

❌ Unstructured server errors

❌ Duplicate orders caused by network retries

❌ Excessive REST response payloads

❌ Poor mobile performance

❌ Difficult-to-maintain API contracts

This project provides a modern API architecture that solves these problems.

✅ REQUIREMENTS COMPLETION STATUS
Requirement	Status	Implementation
Noun-based REST URIs	✅ COMPLETED	/api/v1/products
GET endpoint	✅ COMPLETED	GET /api/v1/products
POST endpoint	✅ COMPLETED	POST /api/v1/products
PUT endpoint	✅ COMPLETED	PUT /api/v1/products/:id
DELETE endpoint	✅ COMPLETED	DELETE /api/v1/products/:id
PUT idempotency	✅ COMPLETED	Repeated PUT requests maintain the same resource state
Filtering	✅ COMPLETED	?category=Electronics
Searching	✅ COMPLETED	?search=phone
Sorting	✅ COMPLETED	?sort=price_asc
Pagination	✅ COMPLETED	?page=1&limit=5
400 Bad Request	✅ COMPLETED	Validation errors
404 Not Found	✅ COMPLETED	Missing product/resource
201 Created	✅ COMPLETED	Successful product creation
Standard JSON errors	✅ COMPLETED	Structured error envelope
GraphQL	✅ COMPLETED	/graphql
REST sparse fieldsets	✅ COMPLETED	?fields=title,price,thumbnailUrl
Order idempotency	✅ COMPLETED	Idempotency-Key
Duplicate order prevention	✅ COMPLETED	Previous result replay
Interactive API portal	✅ COMPLETED	Local developer portal
Local setup instructions	✅ COMPLETED	Installation and run instructions
Postman collection	⚠️ ADD LINK	Add shared Postman URL before submission
Public GitHub repository	⚠️ VERIFY	Confirm repository visibility before submission

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
       Product Routes         Order Routes          Error Handler
              │                     │                     │
              │              Idempotency Layer             │
              │                     │                     │
              └─────────────────────┼─────────────────────┘
                                    │
                         ┌──────────▼──────────┐
                         │   Data / Storage    │
                         └─────────────────────┘

📋 MODULE 1 — RESTful Architecture & Resource Modeling
✅ COMPLETED
The API follows resource-oriented REST principles using noun-based URIs.

❌ Legacy RPC-style URLs
/getProductsList
/deleteProductItem
/updateProduct

✅ Modern RESTful URLs
GET    /api/v1/products
GET    /api/v1/products/:id
POST   /api/v1/products
PUT    /api/v1/products/:id
DELETE /api/v1/products/:id

The API uses the correct HTTP method for each operation.

HTTP Methods
Method	Endpoint	Purpose
GET	/api/v1/products	Get all products
GET	/api/v1/products/:id	Get a specific product
POST	/api/v1/products	Create a product
PUT	/api/v1/products/:id	Update a product
DELETE	/api/v1/products/:id	Delete a product

✅ PUT Idempotency
The product update endpoint follows idempotent PUT semantics.

PUT /api/v1/products/prod-101
Content-Type: application/json

{
  "title": "Samsung Galaxy S25",
  "price": 379999,
  "category": "Electronics"
}

Sending the same PUT request multiple times results in the same resource state rather than creating duplicate resources.

🔎 Product Filtering
✅ COMPLETED
Products can be filtered using query parameters.

GET /api/v1/products?category=Electronics

Multiple filters can be combined:

GET /api/v1/products?category=Electronics&brand=Samsung

📄 Product Pagination
✅ COMPLETED
Large product catalogs can be paginated.

GET /api/v1/products?page=1&limit=5

Example pagination metadata:

{
  "page": 1,
  "limit": 5,
  "total": 100,
  "totalPages": 20,
  "hasNextPage": true
}

Pagination prevents the entire product catalog from being returned in a single response.

🔍 Product Search
✅ COMPLETED
Products can be searched using the search query parameter.

GET /api/v1/products?search=phone

↕️ Product Sorting
✅ COMPLETED
Products can be sorted using query parameters.

GET /api/v1/products?sort=price_asc

GET /api/v1/products?sort=price_desc

GET /api/v1/products?sort=rating_desc

🛡️ MODULE 2 — Consistent Error Schema & Status Codes
✅ COMPLETED
The API uses a standardized JSON error structure instead of returning raw HTML or unstructured errors.

Example:

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

HTTP Status Codes
✅ COMPLETED
Status Code	Usage
200 OK	Successful retrieval/update
201 Created	Resource successfully created
400 Bad Request	Invalid client data/validation error
404 Not Found	Resource does not exist
500 Internal Server Error	Unexpected server error

❌ 400 Bad Request — Validation Error
✅ COMPLETED
Invalid client data returns 400 Bad Request.

Example:

POST /api/v1/products
Content-Type: application/json

{
  "title": "AB",
  "price": -50,
  "category": ""
}

Expected:

HTTP/1.1 400 Bad Request

The API returns a structured JSON validation error.

❌ 404 Not Found
✅ COMPLETED
If a product does not exist, the API returns:

HTTP/1.1 404 Not Found

Example standardized response:

{
  "success": false,
  "error": {
    "error_code": "NOT_FOUND",
    "message": "Product not found",
    "timestamp": "2026-09-22T10:15:00.000Z"
  }
}

✅ 201 Created
✅ COMPLETED
When a new product is successfully created:

HTTP/1.1 201 Created

This clearly indicates successful resource creation.

📦 MODULE 3 — Over-Fetching Solution
✅ COMPLETED
The REST over-fetching problem is addressed using two approaches:

GraphQL field selection

REST sparse fieldsets

These approaches allow clients to request only the data they actually need.

🔹 Solution A — GraphQL
✅ COMPLETED
The project provides a GraphQL endpoint:

POST /graphql

Example query:

query GetBannerProducts {
  products(limit: 5) {
    id
    title
    price
    thumbnailUrl
  }
}

Example response:

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

The client controls which fields are returned.

🔹 Solution B — REST Sparse Fieldsets
✅ COMPLETED
REST clients can request specific fields using the fields parameter.

GET /api/v1/products/prod-101?fields=title,price,thumbnailUrl

Example response:

{
  "title": "Samsung Galaxy S25",
  "price": 379999,
  "thumbnailUrl": "/images/s25.jpg"
}

This reduces unnecessary response data while allowing existing REST clients to continue using REST.

🔐 Idempotency & Duplicate Order Prevention
✅ COMPLETED
Unreliable mobile networks can cause clients to retry requests.

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
Duplicate order ❌

Solution
Clients provide an Idempotency-Key.

POST /api/v1/orders
Idempotency-Key: ord-uuid-7491-bazaar

The server stores the result associated with the idempotency key.

If the same request is received again:

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

Replay responses contain:

Idempotent-Replay: true

This protects order creation from duplicate processing caused by network retries.

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

Repeating the same request with the same idempotency key returns the previously generated result instead of creating another order.

GraphQL
curl -X POST \
"http://localhost:3000/graphql" \
-H "Content-Type: application/json" \
-d '{
  "query": "query { products(limit: 3) { id title price thumbnailUrl } }"
}'

📊 Payload Optimization Benchmark
The project demonstrates the effect of reducing unnecessary API response data.

Metric	Legacy REST	Sparse REST	GraphQL
Payload / item	~18,500 B	~340 B	~260 B
10 items	~185 KB	~3.4 KB	~2.6 KB
Bandwidth reduction	Baseline	~98.1%	~98.6%
Mobile parsing	High	Low	Low

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

The smaller responses reduce unnecessary cellular data transfer and client-side processing.

🧪 Interactive Developer Portal
✅ COMPLETED
The project includes a browser-based developer portal.

After starting the application, open:

http://localhost:3000

The portal provides interactive API testing functionality.

REST API Explorer
The portal can be used to test:

GET

POST

PUT

DELETE

and inspect:

HTTP status codes

Response headers

JSON responses

Error responses

Error Simulation
The portal can demonstrate:

400 Bad Request

404 Not Found

Standardized API errors

Server failure scenarios

Over-Fetching Benchmark
Compare:

Legacy REST
     ↓
Sparse REST
     ↓
GraphQL

Idempotency Simulator
Demonstrates:

Request
   ↓
Network Failure
   ↓
Retry
   ↓
Idempotency Check
   ↓
Original Result

GraphQL Testing
GraphQL queries can be executed directly against the API.

🛠️ Technology Stack
Technology	Purpose
Node.js	Backend runtime
Express.js	REST API framework
TypeScript	Type-safe development
GraphQL	Flexible data querying
React / TSX	Developer portal UI
Vite	Frontend development/build tooling
npm	Package management
JSON	API data format
HTTP/REST	Resource communication

📁 Actual Project Structure
The current project structure is:

ecommerce-api-modernization/
│
├── .gitignore
├── index.html
├── metadata.json
├── package.json
├── package-lock.json
├── README.md
├── server.ts
├── tsconfig.json
├── vite.config.ts
│
├── server/
│   ├── data/
│   ├── graphql/
│   ├── middleware/
│   ├── routes/
│   ├── utils/
│   └── types.ts
│
├── src/
│   ├── App.tsx
│   ├── components/
│   ├── index.css
│   ├── main.tsx
│   └── types/
│
└── dist/

Backend
server/
├── data/
├── graphql/
├── middleware/
├── routes/
├── utils/
└── types.ts

Developer Portal
src/
├── App.tsx
├── components/
├── index.css
├── main.tsx
└── types/

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

🧪 API Testing Checklist
REST Endpoints
✅ GET all products

✅ GET product by ID

✅ POST product

✅ PUT product

✅ DELETE product

Query Features
✅ Filtering

✅ Searching

✅ Sorting

✅ Pagination

✅ Sparse field selection

Error Handling
✅ 400 Bad Request

✅ 404 Not Found

✅ 500 Internal Server Error handling

✅ Standardized JSON error schema

✅ Validation details

Advanced Features
✅ GraphQL

✅ Idempotency keys

✅ Duplicate order prevention

✅ Interactive API testing

✅ Payload optimization

📋 SUBMISSION CHECKLIST
Submission Requirement	Status
GitHub repository is public	⚠️ VERIFY BEFORE SUBMISSION
README.md with local setup instructions	✅ COMPLETED
GET endpoint implemented	✅ COMPLETED
POST endpoint implemented	✅ COMPLETED
PUT endpoint implemented	✅ COMPLETED
DELETE endpoint implemented	✅ COMPLETED
REST endpoints tested locally	✅ COMPLETED
Error handling tested locally	✅ COMPLETED
GraphQL implemented	✅ COMPLETED
Field selector implemented	✅ COMPLETED
Filtering implemented	✅ COMPLETED
Pagination implemented	✅ COMPLETED
Idempotency implemented	✅ COMPLETED
Interactive API documentation/testing	✅ COMPLETED
Shared Postman collection	⚠️ ADD LINK BEFORE SUBMISSION
Ready for live lab viva	✅ YES

🔗 API Documentation / Postman
Interactive Developer Portal
Run the project and open:

http://localhost:3000

The portal provides interactive REST and GraphQL API testing.

Shared Postman Collection
Add your public Postman collection link here before submission:

POSTMAN_COLLECTION_URL_HERE

🎓 Live Lab Viva Demonstration
The following sequence can be used during the viva.

1. Start the application
npm run dev

Open:

http://localhost:3000

2. Demonstrate REST Resource Modeling
Show:

GET    /api/v1/products
GET    /api/v1/products/:id
POST   /api/v1/products
PUT    /api/v1/products/:id
DELETE /api/v1/products/:id

3. Demonstrate Filtering and Pagination
GET /api/v1/products?category=Electronics&page=1&limit=5

4. Demonstrate Validation
Send invalid product data and show:

400 Bad Request

with the standardized JSON error response.

5. Demonstrate Missing Resource
Request an invalid product ID and show:

404 Not Found

6. Demonstrate Product Creation
Create a valid product and show:

201 Created

7. Demonstrate Over-Fetching Solution
Show:

GET /api/v1/products/prod-101?fields=title,price,thumbnailUrl

Then demonstrate the equivalent GraphQL query.

8. Demonstrate Idempotency
Send an order request with:

Idempotency-Key: test-order-uuid-9901

Repeat the same request and demonstrate that the existing result is replayed instead of creating a duplicate order.

🎯 Project Objectives — COMPLETED
The project demonstrates:

✅ RESTful API design

✅ Resource-based URLs

✅ Correct HTTP methods

✅ Idempotent PUT updates

✅ HTTP status codes

✅ Centralized error handling

✅ Standardized JSON error envelopes

✅ Filtering

✅ Searching

✅ Sorting

✅ Pagination

✅ GraphQL

✅ REST sparse fieldsets

✅ Idempotency keys

✅ Duplicate order prevention

✅ Mobile bandwidth optimization

✅ Interactive API testing

📈 Expected Benefits
The modernized architecture provides:

Better API consistency through resource-oriented endpoints.

Improved error handling through standardized JSON responses.

Lower bandwidth usage through GraphQL and sparse fieldsets.

Safer order retries through idempotency keys.

Better mobile performance through smaller JSON payloads.

Improved maintainability through TypeScript and modular architecture.

Better developer experience through the interactive API portal.

🔮 Future Improvements
The current implementation can be extended with:

PostgreSQL or MongoDB persistence

Redis-based distributed idempotency storage

JWT/OAuth authentication

Role-based access control

Redis caching

Kafka or RabbitMQ message queues

Distributed tracing

Rate limiting

API monitoring and metrics

Docker and Kubernetes deployment

Automated unit and integration testing

CI/CD pipelines

📝 Conclusion
This project demonstrates the modernization of a traditional e-commerce backend into a structured, reliable, and mobile-friendly API architecture.

The implementation directly addresses the three major API modernization requirements:

RESTful Resource Modeling
          +
Consistent Error Handling
          +
Correct HTTP Status Codes
          +
GraphQL / Sparse Fieldsets
          +
Filtering & Pagination
          +
Idempotency
          ↓
Modern E-Commerce API

The project provides a practical demonstration of modern enterprise API design for e-commerce applications operating under high traffic and unreliable mobile connectivity.

📄 License
This project is licensed under the MIT License.

# Bandhon Noors v2 — System Architecture

**Document:** `docs/01-architecture.md`  
**Project:** Bandhon Noors v2  
**Status:** Initial Architecture Specification  
**Visibility:** Private/local documentation only — never deploy this file publicly.

---

## 1. Purpose of This Document

This document defines the technical architecture for Bandhon Noors v2 before application code is created.

It explains:

- how the repository will be organized,
- which application owns which responsibility,
- how the storefront, admin web app, mobile admin app, backend, database, and media storage communicate,
- where authentication and authorization are enforced,
- how product images and videos flow through the system,
- how inventory and orders are protected from frontend manipulation,
- and how the system will eventually be deployed.

This file is architectural guidance. It is not executable code.

---

## 2. Core Architectural Principle

Bandhon Noors v2 will use one central backend API.

```text
Customer Website
      |
Admin Website
      |
Admin Mobile App
      |
      v
   FastAPI
      |
      +-------------------+
      |                   |
      v                   v
 PostgreSQL          Object Storage
      |
      v
 Business Data
```

The customer website, admin website, and mobile app are clients.

They do not directly read from or write to PostgreSQL.

They communicate with FastAPI, and FastAPI decides whether an operation is valid.

---

## 3. Planned Repository Structure

The repository should eventually follow a structure similar to:

```text
bandhon-noors/
|
├── frontend/
│   └── customer storefront
|
├── admin-web/
│   └── browser-based administration
|
├── admin-mobile/
│   └── React Native / Expo application
|
├── backend/
│   └── FastAPI application
|
├── docs/
│   ├── 00-project-overview.md
│   ├── 01-architecture.md
│   └── ...
|
├── infrastructure/
│   └── deployment and environment configuration
|
├── scripts/
│   └── migration and maintenance scripts
|
├── .gitignore
├── .env.example
├── README.md
└── docker-compose.yml
```

The exact folders will be created gradually.

Documentation remains local/private and must not be part of the public website build.

---

## 4. Application Boundaries

### 4.1 Customer Storefront

Planned stack:

- Next.js
- React
- TypeScript
- Tailwind CSS

Primary responsibilities:

- homepage,
- navigation,
- category pages,
- product listings,
- product details,
- image/video gallery,
- image zoom,
- cart,
- wishlist,
- customer login,
- customer account,
- checkout,
- order history,
- guest order tracking,
- and customer-facing validation/messages.

The storefront may display information supplied by the backend, but it must not be the authoritative source for:

- product prices,
- delivery charges,
- inventory,
- discounts,
- payment validity,
- order totals,
- permissions,
- or user roles.

---

## 5. Admin Web Application

The admin web application will be browser-based.

Planned stack:

- Next.js
- React
- TypeScript
- Tailwind CSS

Primary responsibilities:

- admin login,
- dashboard,
- product creation/editing,
- category management,
- product images/videos,
- stock management,
- low-stock and out-of-stock views,
- order management,
- customer lookup,
- bKash/Nagad payment verification,
- shipping configuration,
- user/role management where permitted,
- audit log viewing,
- and selected business settings.

The admin web app is an interface only.

It must not bypass FastAPI security rules.

---

## 6. Admin Mobile Application

Planned stack:

- React Native
- Expo

Primary responsibilities:

- secure admin login,
- mobile product creation,
- camera/gallery image upload,
- image quality checks,
- crop/reposition/zoom controls,
- product video upload where supported,
- stock updates,
- variant inventory,
- low-stock alerts,
- out-of-stock alerts,
- order viewing,
- order status updates,
- payment verification,
- customer information needed for fulfillment,
- and mobile dashboard views.

The mobile app uses the same backend API as the web applications.

This avoids duplicated business logic.

---

## 7. Backend Application

Planned stack:

- Python
- FastAPI
- Pydantic
- SQLAlchemy
- Alembic

FastAPI is the central security and business-logic layer.

It is responsible for:

- request validation,
- authentication,
- authorization,
- user roles,
- product management,
- product-code generation,
- category management,
- pricing,
- stock validation,
- stock movement recording,
- checkout calculation,
- delivery charge calculation,
- order creation,
- payment state,
- customer accounts,
- wishlists,
- guest order tracking,
- media authorization,
- audit logging,
- and business configuration.

The backend is authoritative.

---

## 8. Backend Module Design

The backend should eventually contain modules similar to:

```text
backend/
└── app/
    ├── auth/
    ├── users/
    ├── admin/
    ├── products/
    ├── categories/
    ├── variants/
    ├── inventory/
    ├── media/
    ├── cart/
    ├── wishlist/
    ├── checkout/
    ├── orders/
    ├── payments/
    ├── shipping/
    ├── customers/
    ├── audit/
    ├── settings/
    └── core/
```

These names may change slightly during implementation.

Each module should have a clear responsibility.

---

## 9. Database Ownership

PostgreSQL is the primary structured data store.

FastAPI is the only application layer allowed to perform normal business writes to PostgreSQL.

The frontend applications must never connect directly to the database.

This protects:

- credentials,
- inventory,
- prices,
- customer information,
- order data,
- admin permissions,
- and payment records.

---

## 10. Planned Database Domains

The database will eventually include entities for:

- users,
- admin profiles,
- roles,
- permissions,
- customers,
- customer addresses,
- categories,
- products,
- product variants,
- product media,
- size charts,
- inventory balances,
- stock movements,
- carts,
- cart items,
- wishlists,
- orders,
- order items,
- payments,
- shipping methods/zones,
- application settings,
- audit logs,
- sessions/tokens as required,
- and notification records where appropriate.

A dedicated database design document will define the exact tables and relationships.

---

## 11. Internal IDs vs Business Codes

Database records should use immutable internal identifiers, preferably UUIDs.

Example:

```text
Internal ID:
4b38f0cb-14d7-4f80-8c54-2a75b70e3a8f
```

Products also receive a separate human-readable business code.

Example:

```text
BN-WOM-SAR-0082
```

The UUID is for internal relationships.

The product code is for business use.

This separation avoids breaking database relationships when categories or display names change.

---

## 12. Product Code Generation Flow

Product codes must be generated by the backend.

Example flow:

```text
Admin creates product
        |
        v
FastAPI validates category/subcategory
        |
        v
Backend reserves next valid sequence
        |
        v
Backend generates product code
        |
        v
Database stores product
        |
        v
Admin receives created product
```

The sequence generator must be concurrency-safe.

If Rumana and Raton create products at nearly the same moment, duplicate product codes must still be impossible.

---

## 13. Inventory Architecture

Inventory must not be represented only as a number that gets overwritten.

The system should track both:

- current inventory balance,
- inventory movement history.

Example:

```text
Product / Variant
        |
        +--> Current stock: 12
        |
        +--> Stock movements
              +10 New shipment
               -2 Order #BN1042
               -1 Manual correction
               +5 Restock
```

This allows inventory discrepancies to be investigated.

---

## 14. Simple and Variant Inventory

### Simple Product

```text
Product
  |
  +--> Stock balance
```

### Variant Product

```text
Product
  |
  +--> Variant A
  |      +--> Stock balance
  |
  +--> Variant B
  |      +--> Stock balance
  |
  +--> Variant C
         +--> Stock balance
```

Variant stock should be independent.

The parent product may display a total stock count calculated from all active variants.

---

## 15. Low-Stock and Out-of-Stock Logic

The backend determines stock state.

Possible states:

```text
IN_STOCK
LOW_STOCK
OUT_OF_STOCK
```

A default low-stock threshold should exist.

A product or variant may override that threshold.

The frontend only displays the backend result.

This keeps stock rules consistent across:

- customer website,
- admin website,
- mobile app,
- and future integrations.

---

## 16. Cart and Checkout Security

The browser must never send a trusted final price.

The client should send identifiers and quantities.

Example:

```text
product_id
variant_id
quantity
delivery_zone
payment_method
```

The backend then:

1. loads the current product,
2. validates the selected variant,
3. checks stock,
4. loads the current price,
5. calculates the subtotal,
6. applies valid business rules,
7. calculates delivery charge,
8. calculates the final total,
9. creates the order.

This prevents users from modifying JavaScript or network requests to submit fake prices.

---

## 17. Shipping Calculation

For Phase 1:

```text
Bangladesh
├── Inside Dhaka
└── Outside Dhaka
```

Each zone has an admin-configurable delivery charge.

The backend owns the delivery-charge calculation.

The frontend may display the expected fee, but the backend validates it when checkout is submitted.

---

## 18. Payment Architecture

Phase 1 payment methods:

- Cash on Delivery
- Manual bKash
- Manual Nagad

Payment method should be represented as structured backend data.

Example states may include:

```text
UNPAID
PAYMENT_SUBMITTED
PAYMENT_VERIFICATION_PENDING
PAID
PAYMENT_REJECTED
REFUNDED
```

Exact payment and order states will be defined later.

SSLCOMMERZ must be addable as a future payment provider without rewriting the order system.

This means payment logic should be isolated behind a clear payment service/provider boundary.

---

## 19. Authentication Architecture

Customer authentication and admin authentication may share core infrastructure, but admin access must receive stricter controls.

A typical authenticated request flow:

```text
User logs in
    |
    v
FastAPI verifies credentials
    |
    v
Secure authenticated session/token established
    |
    v
Client makes protected request
    |
    v
FastAPI verifies identity
    |
    v
FastAPI checks permission
    |
    v
Operation allowed or rejected
```

The backend checks authorization on every protected operation.

---

## 20. Admin Roles

Initial roles:

```text
Super Admin
└── Aronnya

Admin
├── Rumana
├── Raton
└── Antor
```

The backend must enforce permission boundaries.

A hidden button is not security.

Example:

Even if an Admin manually sends an HTTP request attempting to make themselves Super Admin, the backend must reject it.

---

## 21. Authentication Storage Principles

The final authentication implementation will be defined in the security document.

General requirements:

- passwords stored only as secure hashes,
- no plain-text passwords,
- secure session/token handling,
- short-lived access where appropriate,
- secure refresh/session invalidation,
- account disable/revoke support,
- login throttling,
- strong admin security,
- MFA support for admins,
- HTTPS in production.

Sensitive authentication material must never appear in public frontend source code.

---

## 22. Audit Logging Flow

Important admin changes should pass through an audit service.

Example:

```text
Rumana changes stock
        |
        v
FastAPI validates permission
        |
        v
Inventory updated
        |
        +--> Stock movement created
        |
        +--> Audit log created
```

Audit logs should answer:

- who did it,
- what happened,
- which record was affected,
- when it happened,
- and relevant before/after information where appropriate.

---

## 23. Product Media Architecture

Product image/video binaries should not be stored directly inside PostgreSQL.

Recommended flow:

```text
Admin phone/browser
        |
        v
FastAPI / authorized upload flow
        |
        v
Image validation
        |
        +--> resolution check
        +--> type check
        +--> size check
        +--> security validation
        |
        v
Object Storage
        |
        +--> original
        +--> optimized variants
        |
        v
CDN / media delivery
        |
        v
Customer storefront
```

PostgreSQL stores media metadata and URLs/keys, not large image binaries.

---

## 24. Image Processing Architecture

For product images:

```text
Original upload
      |
      v
Validation
      |
      v
Admin crop / reposition / zoom preference
      |
      v
Processing
      |
      +--> original preserved
      +--> storefront large version
      +--> medium version
      +--> thumbnail
      +--> WebP/AVIF where practical
```

The original should be preserved when practical so future image-processing rules do not require re-uploading the source photo.

---

## 25. Image Quality Rules

Initial target:

- recommended upload: around 2000 × 2000 pixels or higher,
- tentative minimum: around 1200 × 1200 pixels,
- consistent storefront ratio: 1:1,
- low-resolution uploads should be rejected or explicitly warned against.

These values are configuration, not permanent hard-coded assumptions.

Real Bandhon Noors photography should be tested before finalizing the exact limits.

---

## 26. Customer Product Media Experience

Customer product page media flow:

```text
Product page
   |
   +--> primary image
   |
   +--> thumbnails
   |
   +--> optional video
   |
   v
Tap / click image
   |
   v
Full-screen gallery
   |
   +--> zoom
   +--> pinch-to-zoom on mobile
   +--> previous / next image
```

The full-size image should remain sharp enough to support useful zoom.

---

## 27. API Design

The system will initially use REST APIs.

Example conceptual endpoints:

```text
GET    /api/products
GET    /api/products/{id}
POST   /api/admin/products
PATCH  /api/admin/products/{id}

GET    /api/categories

POST   /api/auth/login
POST   /api/auth/logout

POST   /api/checkout
GET    /api/orders/{id}

POST   /api/admin/inventory/adjust
GET    /api/admin/inventory/alerts
```

These are examples only.

The actual API contract will be designed later.

---

## 28. API Versioning

The API should be prepared for versioning.

Example:

```text
/api/v1/...
```

This gives the project room to introduce incompatible future API changes without immediately breaking older mobile apps.

Whether `/api/v1` is introduced from the first endpoint will be decided before backend routes are created.

---

## 29. Configuration Architecture

Business settings should not be scattered throughout source code.

Examples of configuration:

- Inside Dhaka delivery charge,
- Outside Dhaka delivery charge,
- default low-stock threshold,
- minimum upload resolution,
- supported image types,
- store contact details,
- payment instructions,
- maintenance settings.

Configuration should be divided into:

### Environment Configuration

Technical/secrets:

```text
DATABASE_URL
SECRET_KEY
STORAGE_CREDENTIALS
EMAIL_CREDENTIALS
```

### Business Configuration

Editable values:

```text
Inside Dhaka charge
Outside Dhaka charge
Low-stock threshold
Payment instructions
```

Business settings should eventually be manageable by permitted admins.

---

## 30. Environment Separation

Three environments are planned:

```text
LOCAL
   |
   v
STAGING
   |
   v
PRODUCTION
```

### Local

Developer machine.

Can use local containers and test credentials.

### Staging

Near-production environment.

Used for:

- migration testing,
- deployment testing,
- checkout testing,
- admin acceptance testing,
- mobile integration testing.

### Production

Live customer environment.

Uses real:

- domain,
- database,
- media,
- users,
- orders,
- payment settings,
- monitoring,
- backups.

Production secrets must not be reused casually in local development.

---

## 31. Deployment Architecture — Initial Direction

Exact hosting providers will be chosen later.

A likely production shape:

```text
                         Internet
                            |
                            v
                      Cloudflare/CDN
                            |
                +-----------+-----------+
                |                       |
                v                       v
         Customer Frontend         Admin Frontend
                |                       |
                +-----------+-----------+
                            |
                            v
                         FastAPI
                            |
              +-------------+-------------+
              |             |             |
              v             v             v
         PostgreSQL       Redis      Object Storage
```

The admin mobile app connects securely to the same FastAPI API.

---

## 32. HTTPS / SSL

HTTPS is mandatory in production.

This is separate from SSLCOMMERZ.

HTTPS protects:

- passwords,
- customer phone numbers,
- addresses,
- authenticated sessions,
- payment references,
- order data,
- and admin operations.

The deployment documentation will include certificate and domain setup.

---

## 33. Private Documentation Rule

The `docs/` directory is private project reference material.

It must not be exposed through the production storefront or admin application.

Possible safeguards include:

- excluding docs from frontend build contexts,
- not copying docs into public web directories,
- deployment configuration that only deploys required application directories,
- access control on private repositories,
- and build verification.

Keeping docs in source control does not mean serving them publicly.

---

## 34. Secrets and Source Control

The repository must not contain real secrets.

Do not commit:

- production database passwords,
- API private keys,
- storage secrets,
- SMTP passwords,
- JWT/session signing secrets,
- payment gateway secret keys,
- production admin passwords.

Instead:

```text
.env          -> private, ignored
.env.example  -> safe template, committed
```

---

## 35. Logging Architecture

The system should produce useful logs without leaking secrets.

Planned log areas:

- backend application logs,
- authentication failures,
- application errors,
- database errors,
- background-job failures,
- media-processing failures,
- deployment logs.

Sensitive values should be redacted.

---

## 36. Error Monitoring

Production should eventually include centralized error monitoring.

The purpose is to detect issues such as:

- failed checkouts,
- API exceptions,
- media-processing failures,
- broken frontend requests,
- mobile app crashes,
- background-task failures.

Exact provider selection will come later.

---

## 37. Backups

Backups are part of architecture, not an afterthought.

At minimum:

```text
PostgreSQL
   -> scheduled backups

Object Storage
   -> provider redundancy/versioning where appropriate

Configuration
   -> reproducible infrastructure and documented settings
```

The project must also document restore procedures.

A backup that has never been tested for restoration should not be treated as sufficient.

---

## 38. Background Processing

Some work should not block the user's request.

Examples:

- image optimization,
- generating multiple image sizes,
- sending notifications,
- some email processing,
- future reporting jobs.

These operations may eventually use:

- Redis,
- a worker queue,
- background workers.

The first version should remain as simple as possible while keeping this future path open.

---

## 39. Notification Architecture

Potential admin notifications:

- new order,
- payment awaiting verification,
- low stock,
- out of stock.

Potential customer notifications:

- order received,
- order confirmed,
- shipped,
- delivered.

Channels may later include:

- in-app,
- push notifications,
- email,
- SMS.

Notification delivery should be isolated from core order logic so a notification failure does not corrupt an order.

---

## 40. Testing Boundaries

Each layer will need tests.

### Backend

- unit tests,
- API tests,
- permission tests,
- inventory tests,
- order-total tests,
- checkout tests.

### Frontend

- component tests where valuable,
- form validation tests,
- critical customer flows.

### Admin

- permission-sensitive screens,
- product creation,
- inventory operations.

### End-to-End

Important workflows:

```text
Create product
-> publish
-> customer adds to cart
-> checkout
-> order created
-> stock reduced
-> admin confirms order
```

---

## 41. Failure Isolation

The architecture should avoid one optional service breaking the entire store.

Examples:

- image optimization failure should not corrupt the product record,
- notification failure should not delete an order,
- analytics failure should not block checkout,
- future courier API failure should not destroy shipment state.

Core commerce data must remain consistent.

---

## 42. Data Validation

Validation should happen at multiple levels:

```text
Frontend
   -> user-friendly immediate validation

FastAPI / Pydantic
   -> authoritative request validation

Database
   -> integrity constraints
```

Example:

An invalid negative product price should be rejected by the backend even if someone bypasses the frontend form.

---

## 43. Database Transactions

Operations that change several related records should use database transactions.

Example order creation may involve:

- order,
- order items,
- payment record,
- stock reservation/deduction,
- stock movements.

If a critical part fails, the system should avoid leaving half-created business state.

Exact transaction behavior will be defined in the database and order documents.

---

## 44. Concurrency

The architecture must account for multiple admins and customers acting at the same time.

Important concurrency-sensitive operations include:

- product-code generation,
- inventory deduction,
- order creation,
- payment verification,
- stock adjustments.

The database and backend must prevent duplicate codes and unintended overselling.

---

## 45. Performance Principles

Initial performance priorities:

- optimized product images,
- CDN media delivery,
- database indexes,
- pagination,
- efficient product queries,
- caching only where useful,
- avoiding oversized frontend JavaScript,
- lazy loading media where appropriate.

The first version should prioritize correctness and simplicity before premature optimization.

---

## 46. SEO Architecture

The customer storefront should support:

- server-renderable product/category pages,
- metadata,
- canonical URLs,
- structured product information where appropriate,
- sitemap generation,
- robots configuration,
- redirects from old WordPress URLs.

Admin pages should not be indexed by search engines.

---

## 47. WordPress Migration Boundary

The old WordPress system is a source system during migration.

The new architecture should not depend on WordPress at runtime after migration.

Migration flow:

```text
WordPress
   |
   v
Export / migration scripts
   |
   v
Validation
   |
   v
PostgreSQL + Object Storage
   |
   v
Bandhon Noors v2
```

The migration should be repeatable in staging before final production cutover.

---

## 48. What Must Never Happen

The architecture should prevent these anti-patterns.

Do not:

- connect React directly to PostgreSQL,
- put database credentials in browser code,
- trust prices sent by the browser,
- trust admin role claims sent by the client,
- hard-code shipping charges in UI files,
- manually edit production database rows for normal operations,
- use product codes as fragile relational primary keys,
- store plain-text passwords,
- commit secrets,
- serve internal docs publicly,
- accept arbitrary uploads without validation,
- reduce stock only in frontend state,
- rely on hidden buttons as authorization.

---

## 49. Build Order From Here

Recommended sequence:

```text
1. Project overview
   COMPLETE

2. Architecture
   THIS DOCUMENT

3. Local development setup

4. Repository root files

5. Backend project skeleton

6. PostgreSQL development environment

7. Backend configuration

8. Database connection

9. Database models/migrations foundation

10. Authentication

11. Roles and permissions

12. Categories

13. Products

14. Product codes

15. Variants

16. Inventory

17. Media

18. Orders

19. Payments

20. Shipping

21. Customer storefront

22. Admin web

23. Admin mobile

24. Migration

25. Production deployment
```

Individual files will still be created one at a time.

---

## 50. Next File

The next private documentation file should be:

```text
docs/02-local-development.md
```

It will define the development-machine setup before we create live project code.

It should cover:

- required software,
- Git,
- Python,
- Node.js,
- package managers,
- PostgreSQL approach,
- Docker,
- editor recommendations,
- repository location,
- environment files,
- basic command conventions,
- and how to verify the workstation is ready.

After the local development setup is documented, we can create the first real repository files.

---

## 51. Architecture Status

This architecture is intentionally modular but not unnecessarily complex.

The guiding principle is:

> Keep the user-facing experience simple, keep business rules centralized, and keep the system understandable enough that Bandhon Noors can maintain and extend it over time.

This document may evolve, but architectural changes should be deliberate and recorded.

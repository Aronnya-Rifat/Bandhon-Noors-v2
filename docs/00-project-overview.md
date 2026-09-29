# Bandhon Noors v2 — Project Overview

**Document:** `docs/00-project-overview.md`  
**Project:** Bandhon Noors v2  
**Status:** Initial Specification  
**Primary Purpose:** Define the authoritative scope, goals, architecture, users, business rules, and development principles for the Bandhon Noors v2 platform.

---

## 1. Project Summary

Bandhon Noors v2 is a complete rebuild of the existing Bandhon Noors WordPress ecommerce website.

The new system will be a custom ecommerce platform with:

- a modern customer-facing web storefront,
- a Python backend API,
- a PostgreSQL database,
- a web-based administration system,
- a mobile administration application,
- product and inventory management,
- customer accounts and guest checkout,
- order management,
- manual bKash and Nagad payment handling,
- Cash on Delivery,
- configurable Bangladesh delivery charges,
- wishlist support,
- guest order tracking,
- secure administrative access,
- audit logging,
- product media processing,
- low-stock and out-of-stock alerts,
- and extensive technical and operational documentation.

The purpose of the rebuild is to give Bandhon Noors full control over its ecommerce platform instead of depending on WordPress plugins and limitations.

---

## 2. Primary Goals

The system must be:

1. **Easy to operate**
   - Products, stock, images, orders, and customers must be manageable without touching the database directly.
   - Daily business operations should be possible from both the admin website and mobile admin application.

2. **Secure**
   - Authentication and authorization must be enforced by the backend.
   - Administrative actions must be auditable.
   - Passwords must never be stored in plain text.
   - Production traffic must use HTTPS.

3. **Maintainable**
   - The project must use a clear folder structure.
   - Business logic must not be duplicated unnecessarily.
   - Major architectural decisions must be documented.

4. **Scalable**
   - The architecture should allow future additions such as international shipping, automated payments, promotions, courier integrations, and additional product categories.

5. **Well documented**
   - Every important file should be explained.
   - Setup, testing, deployment, hosting, database migrations, backups, media storage, security, and production maintenance must be documented.

---

## 3. Development Method

Bandhon Noors v2 will be built **one file at a time**.

For every important source file, documentation or explanation should cover:

- what the file does,
- why the file exists,
- how its important code works,
- how it connects to the rest of the system,
- what security considerations apply,
- how to test it,
- and what should be understood before moving to the next file.

The project should avoid adding code that is not understood or does not have a defined purpose.

---

## 4. Planned Technology Stack

### Customer Web Application

- **Framework:** Next.js
- **Language:** TypeScript
- **UI:** React
- **Styling:** Tailwind CSS
- **Server communication:** REST API
- **Data fetching:** TanStack Query or equivalent

Next.js is preferred over a plain React single-page application because the public storefront benefits from SEO, server rendering, metadata control, routing, and optimized page delivery.

### Backend

- **Language:** Python
- **Framework:** FastAPI
- **Validation:** Pydantic
- **ORM:** SQLAlchemy
- **Database migrations:** Alembic

The backend is the authoritative source for:

- authentication,
- authorization,
- products,
- pricing,
- inventory,
- checkout calculations,
- shipping calculations,
- payments,
- orders,
- customer data,
- and administrative actions.

### Database

- **Database:** PostgreSQL

PostgreSQL will store structured application data such as:

- users,
- admin accounts,
- products,
- variants,
- categories,
- inventory,
- stock movements,
- orders,
- payments,
- shipping information,
- wishlists,
- audit logs,
- and settings.

### Admin Mobile Application

- **Framework:** React Native
- **Tooling:** Expo
- **Backend:** Same FastAPI API used by the website and admin web interface

### Supporting Services

Planned supporting services may include:

- Redis for caching, queues, and selected temporary data,
- object storage for product images and videos,
- CDN delivery for optimized media,
- Docker for repeatable environments,
- GitHub Actions or equivalent for CI/CD,
- error monitoring,
- server/application logs,
- automated database backups.

Exact infrastructure providers will be selected later.

---

## 5. High-Level Architecture

```text
                         BANDHON NOORS v2
                                |
             +------------------+------------------+
             |                                     |
      Customer Website                      Administration
       Next.js / React                 +-----------+-----------+
             |                         |                       |
             |                    Admin Website          Admin Mobile App
             |                    Next.js/React         React Native/Expo
             |                         |                       |
             +-------------------------+-----------------------+
                                       |
                                  FastAPI API
                                       |
                 +---------------------+----------------------+
                 |                     |                      |
            PostgreSQL              Redis              Object Storage
             Database          Cache / Queues        Images / Videos
```

There will be **one central backend API**.

The customer website, admin website, and mobile admin app must not implement separate copies of the same business rules.

---

## 6. Visual Design Direction

The primary Bandhon Noors v2 visual identity will use:

- **Pink** as the primary brand color,
- **White** as the primary background/base color,
- **Brown** as a selective accent,
- and **pastel colors** for selected sections, campaigns, decorative components, or future collection-specific designs.

Pink and white remain the main visual theme.

The frontend will use reusable design tokens for:

- colors,
- spacing,
- typography,
- borders,
- shadows,
- radii,
- button styles,
- form controls,
- and responsive breakpoints.

This allows the brand appearance to change later without editing colors throughout individual components.

---

## 7. Initial Product Categories

### Baby

- Frock
- Kurti
- Pant
- Saree
- Three Piece
- Tops

### Jute Products

- Bag
- File Folder
- Laptop Bag
- Purse
- Table Runner
- Tissue Box
- Tote Bag

### Men

- Fatua
- Lungi
- Punjabi
- Shawl
- T-Shirt

### Women

- Kurti
- Lehenga
- Saree
- Shawl
- Three Piece
- T-Shirt

### Pearl Ornaments

- Earrings
- Necklace
- Bracelet

Pearl Ornaments is a new Bandhon Noors product line.

### Home

- Bed Cover

The old label "Miscellaneous" should not be required in the new customer-facing navigation. A clearer label such as "Home" or "Home & Living" is preferred.

Categories and subcategories must be editable through administration rather than permanently hard-coded.

---

## 8. Product Types

The platform must support both:

### 8.1 Simple Products

A simple product has a single stock pool.

Example:

```text
Pearl Necklace
Price: ৳1,500
Stock: 15
```

### 8.2 Variant Products

A variant product can have combinations such as size and color, with separate inventory per variant.

Example:

```text
Punjabi

M / Pink   = 8 units
L / Pink   = 5 units
XL / Pink  = 2 units
M / White  = 7 units
```

The architecture should not permanently restrict variants to only size and color. Additional product attributes should be possible later.

---

## 9. Core Product Information

A product must support the following primary information:

- Product Name
- Description
- Price
- Weight
- Size Chart
- Images
- Videos

The system will also require operational fields such as:

- category,
- subcategory,
- product type,
- product code,
- stock,
- low-stock threshold,
- publication status,
- timestamps,
- and variant information when applicable.

A size chart may be optional for products where it does not apply.

Videos are optional.

---

## 10. Product Media Requirements

Product media is an important part of the storefront.

### Images

The system must:

- reject or warn about images below the accepted quality threshold,
- prevent low-resolution images from being silently published,
- preserve the original uploaded image,
- generate optimized display versions,
- support modern formats such as WebP/AVIF where appropriate,
- use consistent storefront image dimensions,
- allow controlled crop/reposition/zoom during upload,
- and support high-resolution zoom on the customer product page.

A recommended starting point is:

- preferred source image: approximately 2000 × 2000 pixels or higher,
- initial minimum accepted dimension: approximately 1200 × 1200 pixels,
- standardized storefront display ratio: 1:1 square.

These exact image rules are configuration decisions and may be adjusted after real Bandhon Noors media is tested.

### Customer Image Viewer

Customers should be able to:

- tap or click a product image,
- open a larger image viewer,
- zoom the image,
- pinch-to-zoom on supported mobile devices,
- and move between gallery images.

### Videos

Products may include video.

Video upload limits, supported formats, processing, and storage rules will be defined later.

---

## 11. Inventory Management

Inventory must be easy to manage from both the admin web application and the mobile app.

Admins should not directly edit PostgreSQL records.

### Required Inventory Features

- simple-product stock,
- variant-level stock,
- automatic order-related stock adjustment,
- manual stock adjustment,
- low-stock alerts,
- out-of-stock alerts,
- configurable low-stock thresholds,
- inventory history,
- stock movement records,
- prevention of overselling,
- and admin-visible inventory dashboards.

### Low Stock

The system should support:

- a global default low-stock threshold,
- optional product-specific or variant-specific overrides.

Example:

```text
Default low-stock threshold: 5

Product A: use default
Product B: warning threshold = 10
Product C: warning threshold = 2
```

### Stock Movement Ledger

Stock changes should be recorded rather than only replacing a number.

A stock movement may include:

- product or variant,
- quantity added or removed,
- reason,
- source,
- order reference when applicable,
- administrator responsible,
- and timestamp.

This allows the business to investigate discrepancies.

---

## 12. Product Code System

Product codes must be generated dynamically.

Administrators should not normally need to invent product codes manually.

The initial human-readable format is:

```text
BN-CATEGORY-SUBCATEGORY-SEQUENCE
```

Example:

```text
BN-MEN-PNJ-0047
BN-WOM-SAR-0082
BN-PRL-BRC-0017
```

Possible category codes:

```text
BAB = Baby
JUT = Jute Products
MEN = Men
WOM = Women
HOM = Home
PRL = Pearl Ornaments
```

Possible subcategory codes include:

```text
FRK = Frock
KRT = Kurti
PNT = Pant
SAR = Saree
3PC = Three Piece
TOP = Tops

BAG = Bag
FLD = File Folder
LPB = Laptop Bag
PUR = Purse
TBR = Table Runner
TSB = Tissue Box
TOT = Tote Bag

FAT = Fatua
LNG = Lungi
PNJ = Punjabi
SHL = Shawl
TSH = T-Shirt

LHG = Lehenga

EAR = Earrings
NCK = Necklace
BRC = Bracelet

BDC = Bed Cover
```

Variant codes may extend the parent product code.

Example:

```text
BN-MEN-PNJ-0047-L-PNK
```

The product code must **not** be used as the database primary identity.

The system should use an immutable internal identifier, such as a UUID, and treat the human-readable product code as a separate unique business identifier.

This prevents category renaming or display changes from damaging database relationships.

---

## 13. Customer Features — Phase 1

Phase 1 should include:

- product browsing,
- category browsing,
- product search,
- filtering where appropriate,
- product image galleries,
- image zoom,
- video support,
- size charts,
- simple and variant products,
- cart,
- wishlist,
- guest checkout,
- customer accounts,
- saved customer information where appropriate,
- order history,
- order tracking,
- and guest order tracking using order number and phone number.

The storefront should follow familiar ecommerce interaction patterns unless Bandhon Noors explicitly requires custom behavior.

---

## 14. Payments — Phase 1

Phase 1 payment methods:

1. Cash on Delivery
2. Manual bKash
3. Manual Nagad

For manual digital payments, the system may support a workflow such as:

```text
Customer selects bKash/Nagad
        |
Customer receives payment instructions
        |
Customer submits payment reference / transaction ID
        |
Order enters verification-pending state
        |
Admin verifies payment
        |
Order is confirmed
```

The exact operational workflow will be defined before the payment module is implemented.

### Deferred Payment Features

The architecture should allow future support for:

- SSLCOMMERZ,
- card payments,
- automated payment verification,
- and additional payment providers.

SSLCOMMERZ is intentionally deferred from Phase 1.

---

## 15. Shipping — Phase 1

Phase 1 shipping is Bangladesh-only.

Two primary shipping zones are required:

- Inside Dhaka
- Outside Dhaka

Each zone must have an administrator-configurable delivery charge.

Shipping charges must not be hard-coded into frontend components.

The backend must calculate and validate the delivery fee and order total.

### Deferred Shipping Features

Future features may include:

- international shipping,
- courier integrations,
- automated shipment tracking,
- free-shipping rules,
- and additional location-based delivery zones.

---

## 16. Offers and Promotions

Advanced offers and promotional systems are not required for the initial phase.

Future capabilities may include:

- coupon codes,
- percentage discounts,
- fixed discounts,
- seasonal campaigns,
- featured collections,
- flash sales,
- free-delivery rules,
- and promotion scheduling.

The database and application architecture should not prevent these features from being added later.

---

## 17. Administrative Users

Initial administrative accounts:

| Person | Role |
|---|---|
| Aronnya | Super Admin |
| Rumana | Admin |
| Raton | Admin |
| Antor | Admin |

### Super Admin

The Super Admin has full system control.

Expected capabilities include:

- manage admin accounts,
- manage permissions,
- manage products,
- manage inventory,
- manage customers,
- manage orders,
- manage payment verification,
- manage shipping configuration,
- manage website settings,
- view audit logs,
- manage system-level configuration where appropriate.

### Admin

Admins manage normal store operations.

Expected capabilities include:

- products,
- product media,
- inventory,
- customers,
- orders,
- payment verification,
- order status updates,
- and selected content/settings.

Admins must not automatically receive permission to:

- remove the Super Admin,
- promote themselves to Super Admin,
- disable critical security controls,
- or modify protected system-level settings.

Permissions will ultimately be enforced by the backend.

---

## 18. Admin Mobile Application — Phase 1

The admin mobile app should support the majority of daily store operations.

Planned features include:

- secure admin login,
- product creation,
- product editing,
- product image uploads,
- product video uploads where practical,
- mobile camera integration,
- image quality validation,
- crop/reposition/zoom controls,
- simple-product inventory,
- variant inventory,
- inventory adjustments,
- low-stock alerts,
- out-of-stock alerts,
- order viewing,
- customer details required for order processing,
- payment verification,
- order status changes,
- and a business dashboard.

Push notifications may include:

- new orders,
- low-stock alerts,
- out-of-stock alerts,
- and other important operational events.

Exact push-notification behavior will be defined later.

---

## 19. Order Management

The initial order lifecycle should support states similar to:

```text
Pending
   |
Confirmed
   |
Processing
   |
Packed
   |
Shipped
   |
Delivered
```

Additional states may include:

- Payment Verification Pending
- Cancelled
- Returned
- Refunded

The final state machine and permitted transitions must be defined before the order module is implemented.

Inventory behavior for cancellation, return, and failed payment must also be explicitly defined.

---

## 20. Security Principles

Security is part of the initial architecture, not a later add-on.

The project must follow principles including:

- HTTPS in production,
- secure password hashing,
- backend-enforced authorization,
- role-based access control,
- input validation,
- safe database queries through the ORM,
- secure handling of environment variables and secrets,
- rate limiting for sensitive endpoints,
- login throttling,
- secure file upload validation,
- audit logging,
- protected administrative routes,
- secure session/token handling,
- controlled CORS configuration,
- and dependency updates.

Administrative accounts should support stronger security controls, including MFA when implemented.

The frontend must never be treated as a security boundary.

For example, hiding an admin button is not sufficient authorization. The backend must independently verify that the authenticated user has permission to perform the action.

---

## 21. Audit Logging

Important administrative actions should be recorded.

Examples include:

- product creation,
- product deletion,
- price changes,
- stock changes,
- order status changes,
- payment verification,
- shipping configuration changes,
- administrative account changes,
- and permission changes.

An audit record should generally contain:

- actor,
- action,
- affected resource,
- relevant before/after information where appropriate,
- timestamp,
- and supporting request metadata where appropriate and safe.

Audit logs should not store secrets or sensitive authentication credentials.

---

## 22. Customer-Facing Navigation

The planned primary storefront navigation may include:

```text
Home
New Arrivals
Women
Men
Baby
Jute Products
Pearl Ornaments
Home
```

Subcategories should appear in dropdown, mega-menu, or expandable mobile navigation.

Exact navigation presentation will be defined during frontend design.

---

## 23. SEO and Existing WordPress Migration

The existing WordPress website will remain available until the new system is ready for migration and cutover.

Migration may include:

- products,
- product descriptions,
- categories,
- images,
- customer data where legally and operationally appropriate,
- orders where needed,
- reviews if retained,
- and selected website content.

Existing URLs should be mapped carefully.

Where URLs change, permanent redirects should be created to preserve SEO value and avoid broken links.

The migration process must be tested before the existing site is replaced.

---

## 24. Environments

The project should eventually maintain separate environments for:

### Local Development

Used by developers while writing and testing code.

### Staging

Used to test near-production behavior before a release.

### Production

The live Bandhon Noors customer platform.

Environment-specific secrets and configuration must not be committed directly to source control.

---

## 25. Documentation Requirements

The repository should eventually contain documentation similar to:

```text
docs/
├── 00-project-overview.md
├── 01-architecture.md
├── 02-local-development.md
├── 03-database.md
├── 04-security.md
├── 05-api.md
├── 06-frontend.md
├── 07-admin-web.md
├── 08-mobile-app.md
├── 09-media.md
├── 10-testing.md
├── 11-deployment.md
├── 12-domain-and-ssl.md
├── 13-backups.md
├── 14-monitoring.md
├── 15-production-operations.md
└── architecture-decisions/
```

Documentation must cover both software development and operations.

Required operational documentation includes:

- local setup,
- dependency installation,
- environment variables,
- database creation,
- database migrations,
- media storage,
- build procedures,
- deployment,
- domain/DNS setup,
- SSL/HTTPS,
- server configuration,
- backups,
- restore procedures,
- monitoring,
- logs,
- updates,
- rollback procedures,
- and production maintenance.

---

## 26. Architecture Decision Records

Important architectural choices should be recorded as Architecture Decision Records (ADRs).

Examples:

```text
ADR-001 — Use PostgreSQL as the primary database
ADR-002 — Use FastAPI for the backend API
ADR-003 — Use Next.js for the customer storefront
ADR-004 — Use React Native with Expo for the admin mobile app
ADR-005 — Store product media in object storage
ADR-006 — Separate database UUIDs from human-readable product codes
ADR-007 — Use backend-enforced role-based authorization
```

Each ADR should explain:

- the decision,
- the context,
- alternatives considered,
- reasons for the selected approach,
- and important consequences.

---

## 27. Deferred Features

The following are intentionally outside the initial Phase 1 scope but should remain possible later:

- SSLCOMMERZ integration,
- automated card payments,
- international shipping,
- advanced promotional campaigns,
- advanced coupons/offers,
- courier API integrations,
- loyalty programs,
- advanced analytics,
- additional administrative roles,
- additional product categories,
- automated marketing workflows,
- and other future business features.

Deferred does not mean rejected. It means these features should not delay the first stable platform.

---

## 28. Phase 1 Definition

Bandhon Noors v2 Phase 1 aims to provide a secure, manageable ecommerce platform capable of replacing the major day-to-day functionality currently handled by WordPress.

Phase 1 should provide:

- modern responsive storefront,
- pink-and-white design system,
- product categories,
- simple products,
- variant products,
- dynamically generated product codes,
- high-quality product media,
- product image zoom,
- size charts,
- inventory management,
- low-stock/out-of-stock alerts,
- customer accounts,
- guest checkout,
- cart,
- wishlist,
- guest order tracking,
- COD,
- manual bKash,
- manual Nagad,
- Dhaka/outside-Dhaka shipping charges,
- orders,
- admin website,
- mobile admin app,
- Super Admin/Admin authorization,
- audit logging,
- secure backend API,
- database migrations,
- testing,
- documentation,
- backups,
- monitoring,
- and production deployment procedures.

---

## 29. Core Engineering Rules

The following rules should guide implementation:

1. Business-critical calculations belong on the backend.
2. The frontend must never be trusted to determine final prices or authorization.
3. Product stock must be validated before orders are finalized.
4. Human-readable product codes must be unique but separate from internal database identity.
5. Product images must meet defined quality standards.
6. Original uploaded media should be preserved when practical.
7. Daily administration should not require direct database access.
8. Configuration that business staff may need to change should be admin-configurable rather than hard-coded.
9. Secrets must never be committed to the repository.
10. Database schema changes must use migrations.
11. Important administrative actions must be auditable.
12. The system must be testable locally before deployment.
13. Production changes should pass through a controlled release process.
14. Backups are incomplete until restore procedures are documented and tested.
15. Every major architectural decision should have a documented reason.

---

## 30. Next Document

The next planned file is:

```text
docs/01-architecture.md
```

It will define the technical architecture in greater detail, including:

- repository structure,
- application boundaries,
- customer frontend,
- admin frontend,
- mobile app,
- backend modules,
- database responsibilities,
- API boundaries,
- media flow,
- authentication flow,
- deployment topology,
- and how the applications communicate.

No application code should be required before the architecture document is understood.

---

## 31. Document Status

This document is the initial authoritative overview of Bandhon Noors v2.

It may be updated when business requirements change, but major changes should be intentional and documented rather than introduced accidentally during implementation.

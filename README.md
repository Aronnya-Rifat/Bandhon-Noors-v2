# Bandhon Noors v2

A custom ecommerce platform for Bandhon Noors, replacing the existing WordPress-based store with a fully controlled web, backend, and admin ecosystem.

---

## Project Status

**Current stage:** Foundation and architecture

The project is being built **one file at a time** with documentation and explanations for each meaningful file.

The current focus is:

- project structure,
- development environment,
- repository configuration,
- backend foundation,
- database foundation,
- security,
- and deployment planning.

---

## Main Goals

Bandhon Noors v2 is being designed to provide:

- a modern customer-facing ecommerce website,
- a Python/FastAPI backend,
- PostgreSQL database,
- a web admin panel,
- a React Native admin mobile app,
- easy product and inventory management,
- simple and variant products,
- dynamically generated product codes,
- low-stock and out-of-stock alerts,
- high-quality image/video support,
- guest and customer checkout,
- Cash on Delivery,
- manual bKash and Nagad payments,
- Dhaka and outside-Dhaka delivery charges,
- wishlist,
- order tracking,
- secure admin permissions,
- audit logs,
- private technical documentation,
- and documented hosting/deployment procedures.

---

## Planned Technology Stack

### Customer Website

- Next.js
- React
- TypeScript
- Tailwind CSS

### Admin Website

- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend

- Python
- FastAPI
- Pydantic
- SQLAlchemy
- Alembic

### Database

- PostgreSQL

### Admin Mobile App

- React Native
- Expo

### Supporting Infrastructure

Planned supporting technologies may include:

- Docker
- Redis
- object storage for product media
- CDN
- monitoring
- automated backups
- CI/CD

Supporting services will be introduced only when needed.

---

## Repository Structure

Planned structure:

```text
bandhon-noors/
|
├── backend/
│   └── FastAPI backend
|
├── frontend/
│   └── customer-facing Next.js storefront
|
├── admin-web/
│   └── browser-based admin application
|
├── admin-mobile/
│   └── React Native / Expo admin application
|
├── docs/
│   └── private technical documentation
|
├── infrastructure/
│   └── deployment and hosting configuration
|
├── scripts/
│   └── migration and maintenance scripts
|
├── .gitignore
├── .env.example
├── README.md
└── docker-compose.yml
```

Folders will be created gradually as they become necessary.

---

## Important Architecture Rule

All client applications communicate with the backend.

```text
Customer Website
Admin Website
Admin Mobile App
        |
        v
     FastAPI
        |
        +-------------------+
        |                   |
        v                   v
   PostgreSQL          Media Storage
```

The frontend applications must never connect directly to PostgreSQL.

FastAPI is responsible for validating:

- authentication,
- permissions,
- prices,
- inventory,
- shipping charges,
- checkout totals,
- payments,
- orders,
- and protected admin actions.

---

## Product Model

The platform will support:

### Simple Products

Example:

```text
Pearl Necklace
Price: ৳1,500
Stock: 15
```

### Variant Products

Example:

```text
Punjabi

M / Pink   = 8
L / Pink   = 5
XL / Pink  = 2
M / White  = 7
```

Variant inventory will be tracked independently.

---

## Core Product Information

Products will support:

- Product Name
- Description
- Price
- Weight
- Size Chart
- Images
- Videos
- Category
- Subcategory
- Product Type
- Product Code
- Stock
- Low-stock threshold
- Publication status
- Variants where applicable

---

## Product Media

Product images must meet quality requirements.

Planned behavior:

- minimum-resolution validation,
- original image preservation,
- controlled crop/reposition/zoom,
- standardized storefront dimensions,
- optimized output sizes,
- modern image formats where useful,
- customer tap/click zoom,
- pinch-to-zoom on supported mobile devices.

Low-resolution product images should not be silently accepted.

---

## Initial Product Categories

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

### Home

- Bed Cover

Categories will be editable from administration rather than permanently hard-coded.

---

## Product Codes

Product codes will be generated dynamically by the backend.

Example:

```text
BN-MEN-PNJ-0047
BN-WOM-SAR-0082
BN-PRL-BRC-0017
```

Variant example:

```text
BN-MEN-PNJ-0047-L-PNK
```

Human-readable product codes are separate from internal immutable database IDs.

---

## Inventory

The inventory system will support:

- simple-product stock,
- variant stock,
- low-stock alerts,
- out-of-stock alerts,
- configurable thresholds,
- stock adjustment history,
- stock movement records,
- order-related stock deduction,
- protection against overselling.

Daily inventory management should not require direct database access.

---

## Admin Users

Initial administrative users:

| Person | Role |
|---|---|
| Aronnya | Super Admin |
| Rumana | Admin |
| Raton | Admin |
| Antor | Admin |

The backend will enforce permission boundaries.

---

## Phase 1 Payments

Phase 1 payment methods:

- Cash on Delivery
- manual bKash
- manual Nagad

Future support is planned for:

- SSLCOMMERZ
- card payments
- automated payment verification

SSLCOMMERZ is not required for the initial version.

---

## Phase 1 Shipping

Initial shipping is Bangladesh-only.

Required shipping zones:

- Inside Dhaka
- Outside Dhaka

Delivery charges must be configurable by an authorized admin.

International shipping will be considered later.

---

## Customer Features

Planned Phase 1 customer features include:

- product browsing,
- categories,
- search,
- filtering,
- product image/video gallery,
- image zoom,
- size charts,
- cart,
- wishlist,
- guest checkout,
- customer accounts,
- saved customer information where appropriate,
- order history,
- and guest order tracking using order number and phone number.

---

## Visual Direction

Primary theme:

- Pink
- White

Selective accent colors:

- Brown
- Pastels

The project will use reusable design tokens so colors and branding can be updated without editing many individual components.

---

## Private Documentation

The `docs/` folder contains internal project documentation.

It is intended for local/private use only.

It must **never be served as part of the public website**.

Current documentation:

```text
docs/
├── 00-project-overview.md
├── 01-architecture.md
└── 02-local-development.md
```

Future documentation will cover:

- database design,
- security,
- API design,
- frontend architecture,
- admin web,
- mobile app,
- media handling,
- testing,
- deployment,
- domain and HTTPS,
- backups,
- monitoring,
- production maintenance.

Documentation must never contain real production secrets.

---

## Secrets

Never commit real secrets.

Examples of information that must remain private:

- production database passwords,
- API secrets,
- storage credentials,
- email credentials,
- payment gateway secrets,
- authentication signing keys,
- admin passwords.

Real values will be stored using environment variables or secure hosting configuration.

A safe `.env.example` file will document required settings.

---

## Local Development

Detailed instructions are available in:

```text
docs/02-local-development.md
```

Core tools will include:

- Git
- Python
- Node.js
- npm
- Docker
- Docker Compose
- PostgreSQL
- a modern code editor
- a modern browser

---

## Development Method

The project follows these rules:

1. Build one file at a time.
2. Show live code/configuration while it is being created.
3. Explain what each important file does.
4. Explain why the file exists.
5. Explain how it connects to the rest of the system.
6. Explain how to test it.
7. Keep business-critical rules in the backend.
8. Keep secrets out of source control.
9. Use database migrations for schema changes.
10. Keep private docs out of public deployment.
11. Document hosting, backups, monitoring, and production maintenance.
12. Prefer understandable architecture over unnecessary complexity.

---

## Current Files

At this stage:

```text
bandhon-noors/
├── .gitignore
├── README.md
└── docs/
    ├── 00-project-overview.md
    ├── 01-architecture.md
    └── 02-local-development.md
```

---

## Next Planned File

The next planned root configuration file is:

```text
.env.example
```

Exact project path:

```text
bandhon-noors/.env.example
```

It will define the safe template for configuration values the project will eventually require without containing any real credentials.

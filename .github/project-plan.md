## 1. Database Design (UUID-based)

### 1.0 users

- id (UUID, PK) -- update the user PK to UUID

---

### 1.1 shops

- id (UUID, PK)
- code (string, unique) (e.g. DHK, MIR)
- next_order_sequence (integer, default 1)
- name
- address
- phone
- website (nullable)
- is_active
- created_at
- updated_at

---

### 1.2 customers

- id (UUID, PK)
- phone (string, 11 digits, unique, global)
- name
- address
- created_at
- updated_at

---

### 1.3 product_types

- id (UUID, PK)
- name
- is_active
- created_at
- updated_at

---

### 1.4 product_sizes

- id (UUID, PK)
- product_type_id (UUID, FK → product_types.id)
- size_label (e.g. 28, 30, M, L, XL, Custom)
- sort_order
- is_active
- created_at
- updated_at

---

### 1.5 orders

- id (UUID, PK)
- order_number (string, unique) (e.g. DHK-000123) (generated from shop.code + shop.next_order_sequence)
- shop_id (UUID, FK → shops.id)
- customer_id (UUID, FK → customers.id)
- delivery_date (date)
- delivery_address (text, nullable)
- total_amount (decimal) (snapshot; calculated server-side)
- advance_paid (decimal, default 0) (snapshot; calculated from payments)
- discount_amount (decimal, default 0)
- discount_type (enum: fixed, percentage)
- due_amount (decimal) (snapshot; calculated server-side)
- status (enum: pending, delivered, cancelled)
- created_at
- updated_at

---

### 1.6 order_items

- id (UUID, PK)
- order_id (UUID, FK → orders.id)
- product_type_id (UUID, FK → product_types.id)
- product_size_id (UUID, FK → product_sizes.id)
- quantity (integer, min 1, default 1)
- price (decimal)
- notes (text, nullable)
- line_total (decimal) (snapshot; calculated server-side)
- created_at
- updated_at

---

### 1.7 payments

- id (UUID, PK)
- order_id (UUID, FK → orders.id)
- method (string: cash, bkash, nagad, bank)
- amount (decimal)
- transaction_id (nullable)
- account_number (nullable)
- paid_at (datetime)
- created_at
- updated_at

Notes:

- Refunds are deferred for now (will be added later).
- Multiple payments are allowed until the total amount is fully paid.

---

### 1.8 roles (spatie)

- I installed spatie (https://spatie.be/docs/laravel-permission/v6/introduction).

---

## 2. Actual Implementation Plan

---

## Step 1: Project Setup

- Install Laravel
- Configure MySQL
- Enable UUID as primary key (users + all domain tables)
- Install Inertia v2 + React
- Setup Tailwind v4 and shadcn/ui
- Install spatie/laravel-permission

---

## Step 2: Authentication & Roles

- Configure spatie roles
- Create roles:
    - Administrator
    - Salesperson
    - Production Manager
    - Quality Controller
- Seed permissions
- Assign permissions to roles

---

## Step 3: Migrations & Models

- Create migrations for all tables
- Use UUIDs in all models (Laravel HasUuids)
- Define relationships between models
- Update spatie permission pivot tables to support UUID users (model_has_roles/model_has_permissions model_id)

---

## Step 4: Request Validation

- Create Form Request classes:
    - StoreOrderRequest
    - UpdateOrderRequest
    - StoreOrderItemRequest
    - StorePaymentRequest
- Enforce quantity ≥ 1
- Validate size belongs to product type
- Validate discount and advance ≥ 0
- Validate customer phone is 11 digits
- Validate order_number is generated server-side (never trusted from client)

---

## Step 5: Repository Layer

- Create repositories for:
    - Shop
    - Customer
    - ProductType
    - ProductSize
    - Order
    - OrderItem
    - Payment
- Repositories handle database reads/writes only (no business rules)

---

## Step 6: Service Layer

- OrderService:
    - Customer detection by phone
    - Order creation & update
    - Price calculation
    - Discount handling (fixed / percentage)
    - Due calculation
    - OrderNumber generation (global, safe under concurrency): lock shop row and increment next_order_sequence
- PaymentService:
    - Payment validation
    - Payment storage

---

## Step 7: Order Creation Flow

- Load required master data
- Auto-fill customer by phone
- Add multiple order items
- Quantity default 1 (min 1)
- Apply discount and advance
- Save order and related data
- Ensure totals are calculated server-side and stored as snapshots

---

## Step 8: Order Update Flow

- Edit order, items, payment
- Recalculate totals
- Persist updated data
- Ensure print reflects latest state
- Payment edit is not allowed for now

---

## Step 9: Printing System

- Single printable layout
- Copy types:
    - Customer Copy
    - Office Copy
    - Tailor Copy (hide ALL money fields: line prices, totals, advance, due, payment details)
- Render dynamically from database
- Trigger print via UI buttons

---

## Step 10: Access Control

- Protect routes with permissions
- Restrict print and edit actions
- Role-based visibility for print copies

---

## 3. MVP Execution Plan (Recommended)

1. UUID Foundation

- Convert users.id to UUID
- Update sessions.user_id to UUID
- Update spatie pivot tables (model_has_roles/model_has_permissions) to use UUID model_id

2. Core Master Data

- Shops (with code + next_order_sequence)
- Customers (phone unique globally)
- Product Types / Sizes

3. Orders + Payments

- Orders + Order Items + Payments
- Global order_number generation: e.g. DHK-000123 (6 digits, increments by 1)

4. UI Screens (match the screenshots)

- New Order screen (phone lookup, shop select, dynamic items, payment method)
- Order details screen with 3 print buttons

5. Tests (Pest)

- Order number increments correctly
- Customer phone uniqueness and validation
- Tailor copy hides all money fields

Note: For MVP speed, repositories should be thin wrappers around Eloquent queries, while services orchestrate transactions and calculations.

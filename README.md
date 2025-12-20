# CRM Order Management System

A CRM order example application built with Laravel 12, Inertia.js, React 19, ShadCN/ui, and Tailwind CSS 4 for managing orders, customers, products, and payments.

## Features

### Order Management

- Create, view, edit, and delete orders
- Order status tracking (Pending, Processing, Completed, Cancelled)
- Multiple payment methods (Cash, Credit Card, Debit Card, Bank Transfer)
- Discount types (None, Percentage, Fixed Amount)
- Order statistics dashboard
- Add payments to orders

### Customer Management

- Create, view, edit, and delete customers
- Customer profile with contact information
- Customer lookup by phone number
- Track customer orders

### Product Management

- Product types management (create, edit, delete)
- Product sizes management (create, edit, delete)
- Organize products by categories

### Shop Management

- Multi-shop support
- Create, view, edit, and delete shops
- Associate orders with specific shops

### User Management

- Create, view, edit, and delete users
- Assign and remove user roles
- User permissions management

### Roles & Permissions

- Role management (create, edit, delete roles)
- Permission management
- Granular permission control for all features

### Settings

- Profile management (update name, email)
- Password change
- Two-factor authentication settings
- Appearance settings

### Modern UI/UX

- Responsive design with Tailwind CSS 4
- Dark mode support
- React 19 with Inertia.js for seamless page transitions
- Modern UI components (Radix UI, Headless UI)
- TypeScript support
- Form validation with React Hook Form

## Requirements

- PHP 8.2 or higher
- Composer
- Node.js 18 or higher
- npm or yarn
- Database (MySQL or SQLite)

## Installation

### 1. Clone the repository

```bash
git clone git@github.com:SagorIslamOfficial/crm-order.git
cd crm-order
```

### 2. Install PHP dependencies

```bash
composer install
```

### 3. Install Node.js dependencies

```bash
npm install
```

### 4. Setup environment

```bash
cp .env.example .env
php artisan key:generate
```

### 5. Configure database

Edit the `.env` file and set your database credentials:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=crm_order
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

For SQLite (simpler for local development):

```env
DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/to/database.sqlite
```

### 6. Create database (if using SQLite)

```bash
touch database/database.sqlite
```

### 7. Run migrations

```bash
php artisan migrate
```

### 8. Seed database (optional)

```bash
php artisan db:seed
```

This will create sample data including:

- Roles and permissions
- Shops
- Product types and sizes
- Customers
- Sample orders

## Running the Application

### Development Mode

#### Option 1: Using composer script (recommended)

This starts the Laravel server, queue worker, logs, and Vite dev server concurrently:

```bash
composer run dev
```

#### Option 2: Manual start

Open separate terminal windows for each:

**Terminal 1 - Laravel server:**

```bash
php artisan serve
```

**Terminal 2 - Frontend assets:**

```bash
npm run dev
```

### Access the application

Open your browser and navigate to:

```
http://localhost:8000
```

### Production Build

Build frontend assets for production:

```bash
npm run build
```

## Default Login

After seeding the database, you can login with default credentials (if created by your seeders). Check `database/seeders/DatabaseSeeder.php` for default users.

## Testing

### Run all tests

```bash
php artisan test
```

### Run specific test file

```bash
php artisan test tests/Feature/OrderTest.php
```

### Run with coverage

```bash
php artisan test --coverage
```

## Code Quality

### Format PHP code

```bash
vendor/bin/pint
```

### Format JavaScript/React code

```bash
npm run format
```

### Lint JavaScript/React code

```bash
npm run lint
```

### TypeScript type checking

```bash
npm run types
```

## Development Tools

### Laravel Pail (Log viewer)

```bash
php artisan pail
```

### Generate Wayfinder routes (after route changes)

```bash
php artisan wayfinder:generate
```

### Clear application cache

```bash
php artisan optimize:clear
```

## Tech Stack

- **Backend:** Laravel 12
- **Frontend:** React 19, Inertia.js 2, TypeScript
- **Styling:** Tailwind CSS 4
- **UI Components:** Radix UI, Headless UI, ShadCN/ui
- **Authentication:** Laravel Fortify
- **Permissions:** Spatie Laravel Permission
- **Testing:** Pest 4
- **Dev Tools:** Vite, Laravel Pint, ESLint, Prettier

## License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

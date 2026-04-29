# ClickMart — React Ecommerce Frontend

> A modern, feature-rich ecommerce storefront and admin panel built with React 19 + Redux Toolkit + Vite. It connects to the [ClickMart Spring Boot Backend](../../Ecommerce_Backend/README.md).

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features & Flows](#features--flows)
- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Run Instructions](#run-instructions)
- [Routing Overview](#routing-overview)
- [State Management](#state-management)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Build Tool | Vite 8 |
| State Management | Redux Toolkit 2 + React Redux 9 |
| Routing | React Router DOM 6 |
| HTTP Client | Axios 1 (with request/response interceptors) |
| Charts | Chart.js 4 + react-chartjs-2 |
| PDF Export | jsPDF 4 + jspdf-autotable |
| Notifications | React Toastify 10 |
| Styling | Vanilla CSS (custom design system in `index.css`) |
| Linting | ESLint 9 + eslint-plugin-react-hooks |

---

## Project Structure

```
react-ecommerce/
├── index.html                     # Root HTML entry point
├── vite.config.js                 # Vite build & dev server config
├── eslint.config.js               # ESLint configuration
├── package.json                   # NPM dependencies & scripts
├── .env                           # Local environment variables (git-ignored)
├── .env.example                   # Environment variable template
└── src/
    ├── main.jsx                   # App entry — BrowserRouter + Redux Provider
    ├── App.jsx                    # Root route tree (public, protected, admin)
    ├── App.css                    # App-level styles
    ├── index.css                  # Global design system (variables, utilities)
    │
    ├── config/
    │   └── api.jsx                # Axios instance with JWT interceptors
    │
    ├── store/
    │   └── store.jsx              # Redux store — all slice reducers combined
    │
    ├── components/
    │   ├── layout/
    │   │   ├── Navbar.jsx         # Top navigation bar
    │   │   ├── Footer.jsx         # Site footer
    │   │   └── SideMenu.jsx       # Mobile slide-out menu
    │   └── common/
    │       ├── ErrorBoundary.jsx  # Class component — catches render errors
    │       └── BackToTop.jsx      # Scroll-to-top floating button
    │
    ├── features/
    │   ├── auth/
    │   │   ├── components/
    │   │   │   ├── Login.jsx           # Login form
    │   │   │   ├── ForgotPassword.jsx  # OTP-based password reset flow
    │   │   │   ├── ProtectedRoute.jsx  # Redirects unauthenticated users
    │   │   │   └── AdminRoute.jsx      # Redirects non-admin users
    │   │   └── slices/
    │   │       └── authSlice.jsx       # Auth state: user, token, login/logout thunks
    │   │
    │   ├── home/
    │   │   └── components/
    │   │       └── Home.jsx            # Landing page with featured products
    │   │
    │   ├── products/
    │   │   ├── components/
    │   │   │   ├── Products.jsx        # Product listing with filters & search
    │   │   │   └── ProductDetail.jsx   # Product page with reviews & add-to-cart
    │   │   └── slices/
    │   │       ├── productSlice.jsx    # Products list, detail, pagination
    │   │       ├── categorySlice.jsx   # Category list
    │   │       ├── wishlistSlice.jsx   # Wishlist add/remove
    │   │       └── reviewSlice.jsx     # Product reviews
    │   │
    │   ├── cart/
    │   │   ├── components/
    │   │   │   └── Cart.jsx            # Cart page (items, quantities, totals)
    │   │   └── slices/
    │   │       └── cartSlice.jsx       # Cart CRUD thunks & state
    │   │
    │   ├── checkout/
    │   │   ├── components/
    │   │   │   └── Checkout.jsx        # Address selection, coupon, delivery, payment
    │   │   └── slices/
    │   │       └── couponSlice.jsx     # Coupon validation state
    │   │
    │   ├── orders/
    │   │   ├── components/
    │   │   │   ├── Orders.jsx          # Order history list
    │   │   │   ├── OrderDetail.jsx     # Single order detail view
    │   │   │   └── OrderSuccess.jsx    # Post-payment confirmation page
    │   │   └── slices/
    │   │       └── orderSlice.jsx      # Order fetch & place thunks
    │   │
    │   ├── profile/
    │   │   ├── components/
    │   │   │   └── Profile.jsx         # User profile, addresses, tickets, notifications
    │   │   └── slices/
    │   │       ├── addressSlice.jsx    # Saved addresses CRUD
    │   │       ├── ticketSlice.jsx     # Support ticket CRUD
    │   │       └── notificationSlice.jsx # In-app notification state
    │   │
    │   ├── admin/
    │   │   ├── components/
    │   │   │   ├── AdminLayout.jsx     # Admin shell with sidebar navigation
    │   │   │   ├── AdminDashboard.jsx  # Revenue charts, order stats, top products
    │   │   │   ├── AdminProducts.jsx   # Product CRUD with image upload
    │   │   │   ├── AdminCategories.jsx # Category management
    │   │   │   ├── AdminOrders.jsx     # Order list & status management
    │   │   │   ├── AdminOrderDetail.jsx# Single order admin view
    │   │   │   ├── AdminCustomers.jsx  # Customer list & details
    │   │   │   ├── AdminInventory.jsx  # Stock level management
    │   │   │   ├── AdminCoupons.jsx    # Coupon creation & management
    │   │   │   └── AdminTickets.jsx    # Support ticket queue
    │   │   └── slices/
    │   │       └── adminSlice.jsx      # Admin thunks (dashboard, customers, etc.)
    │   │
    │   └── support/
    │       └── components/
    │           ├── About.jsx           # About page
    │           ├── Contact.jsx         # Contact form
    │           ├── FAQ.jsx             # FAQ accordion
    │           ├── Privacy.jsx         # Privacy policy
    │           └── Terms.jsx           # Terms of service
    │
    ├── styles/                         # Additional CSS modules / shared styles
    └── utils/                          # Helper functions (formatters, validators, etc.)
```

---

## Features & Flows

### 1. Authentication Flow
```
User → /login                    → Login form → POST /api/auth/login
                                    JWT token stored in Redux state + localStorage
User → ProtectedRoute            → Checks Redux auth state; redirects to /login if absent
User → AdminRoute                → Also checks role === 'ADMIN'; redirects if not admin
User → /forgot-password          → Email entered → OTP sent → OTP verified → password reset
```

### 2. Product Browsing Flow
```
User → /products                 → Fetches product list with optional:
                                    • Category filter
                                    • Price range filter
                                    • Sort (price, name, rating)
                                    • Search query
User → /product/:id              → Fetches product detail + reviews
                                    • "Add to Cart" dispatches cartSlice thunk
                                    • "Add to Wishlist" dispatches wishlistSlice thunk
```

### 3. Cart & Checkout Flow
```
User → /cart                     → Displays cart items (from cartSlice)
                                    • Update quantity → PATCH /api/cart/{id}
                                    • Remove item    → DELETE /api/cart/{id}

User → /checkout (ProtectedRoute)
  Step 1: Select / add delivery address (addressSlice)
  Step 2: Apply coupon code         → POST /api/coupons/validate
  Step 3: Select delivery option    → GET /api/delivery-options
  Step 4: Razorpay payment          → POST /api/payments/create-order
                                    → Razorpay UI opens
                                    → On success: POST /api/payments/verify
                                    → Redirect to /order-success/:orderNumber
```

### 4. Orders Flow
```
User → /orders (ProtectedRoute)  → GET /api/orders → order history list
User → /orders/:orderNumber      → GET /api/orders/{orderNumber} → detail view
```

### 5. Profile Flow
```
User → /profile (ProtectedRoute)
  • View/edit personal info (name, email, phone)
  • Manage saved addresses (add, set default, delete)
  • View/raise support tickets
  • View notifications
  • Change password
```

### 6. Admin Flow
```
Admin → /admin (AdminRoute)      → AdminDashboard: revenue charts, stats
Admin → /admin/products          → Add/edit/delete products (with Cloudinary image upload)
Admin → /admin/categories        → Create/update categories
Admin → /admin/orders            → View all orders, update status
Admin → /admin/orders/:id        → Order detail view
Admin → /admin/customers         → Browse customer list
Admin → /admin/inventory         → Update stock quantities
Admin → /admin/coupons           → Create/manage discount coupons
Admin → /admin/tickets           → Respond to customer support tickets
```

---

## Prerequisites

| Tool | Version | Notes |
|---|---|---|
| **Node.js** | 18+ (LTS recommended) | [Download Node.js](https://nodejs.org/) |
| **npm** | 9+ | Comes with Node.js |
| **Git** | Any | For cloning the repo |

> The **ClickMart Backend** must be running locally for API calls to work.  
> See [Ecommerce_Backend README](../../Ecommerce_Backend/README.md) for setup instructions.

---

## Environment Setup

### Step 1 — Copy the Environment Template

```bash
# From the react-ecommerce/ directory
cp .env.example .env
```

### Step 2 — Fill in Your Values

Edit `.env`:

```env
# Backend API base URL (default: Spring Boot runs on 8080)
VITE_API_BASE_URL=http://localhost:8080/api

# App name shown in the UI
VITE_APP_NAME=ClickMart

# Razorpay public key (optional — only needed for payment flow)
# VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
```

> ⚠️ **Never commit `.env` to Git.** It is already listed in `.gitignore`.

---

## Run Instructions

### Install Dependencies

```bash
# From the react-ecommerce/ directory
npm install
```

### Start Development Server

```bash
npm run dev
```

The app will be available at **`http://localhost:5173`** by default (Vite default port).

### Other Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local dev server with HMR |
| `npm run build` | Build optimised production bundle to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint on the entire `src/` directory |

---

## Routing Overview

| Route | Component | Access |
|---|---|---|
| `/` | `Home` | Public |
| `/products` | `Products` | Public |
| `/product/:id` | `ProductDetail` | Public |
| `/cart` | `Cart` | Public |
| `/login` | `Login` | Public |
| `/forgot-password` | `ForgotPassword` | Public |
| `/about` | `About` | Public |
| `/contact` | `Contact` | Public |
| `/faq` | `FAQ` | Public |
| `/privacy` | `Privacy` | Public |
| `/terms` | `Terms` | Public |
| `/profile` | `Profile` | 🔒 Authenticated |
| `/orders` | `Orders` | 🔒 Authenticated |
| `/orders/:orderNumber` | `OrderDetail` | 🔒 Authenticated |
| `/checkout` | `Checkout` | 🔒 Authenticated |
| `/order-success/:orderNumber` | `OrderSuccess` | 🔒 Authenticated |
| `/admin` | `AdminDashboard` | 🔐 Admin only |
| `/admin/products` | `AdminProducts` | 🔐 Admin only |
| `/admin/categories` | `AdminCategories` | 🔐 Admin only |
| `/admin/orders` | `AdminOrders` | 🔐 Admin only |
| `/admin/orders/:orderNumber` | `AdminOrderDetail` | 🔐 Admin only |
| `/admin/customers` | `AdminCustomers` | 🔐 Admin only |
| `/admin/inventory` | `AdminInventory` | 🔐 Admin only |
| `/admin/coupons` | `AdminCoupons` | 🔐 Admin only |
| `/admin/tickets` | `AdminTickets` | 🔐 Admin only |
| `*` | 404 Page | Public |

---

## State Management

The Redux store combines the following slices:

| Slice Key | File | Manages |
|---|---|---|
| `auth` | `authSlice.jsx` | Current user, JWT token, login/logout |
| `products` | `productSlice.jsx` | Product list, selected product, pagination |
| `categories` | `categorySlice.jsx` | Category list |
| `cart` | `cartSlice.jsx` | Cart items, quantities, totals |
| `orders` | `orderSlice.jsx` | Order history, order placement |
| `addresses` | `addressSlice.jsx` | Saved delivery addresses |
| `wishlist` | `wishlistSlice.jsx` | Wishlist items |
| `coupons` | `couponSlice.jsx` | Coupon validation result |
| `admin` | `adminSlice.jsx` | Admin dashboard data, customer list |
| `tickets` | `ticketSlice.jsx` | Support tickets |
| `notifications` | `notificationSlice.jsx` | In-app notifications |
| `reviews` | `reviewSlice.jsx` | Product reviews & ratings |

### Axios Interceptor (`config/api.jsx`)
- Automatically attaches the `Authorization: Bearer <token>` header to every request.
- Handles `401 Unauthorized` responses globally — clears auth state and redirects to `/login`.

---

## Notes

- The frontend assumes the backend is running on port `8080`. Change `VITE_API_BASE_URL` in `.env` if needed.
- Razorpay's checkout script is loaded dynamically at runtime — ensure you are connected to the internet when testing payments.
- The `ErrorBoundary` component wraps the entire route tree and gracefully handles any uncaught render errors.
- Admin routes are protected by both authentication check (`ProtectedRoute`) and role check (`AdminRoute`).

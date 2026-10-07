# 🍔 BiteGo — "Good Food. Fast Delivery."

A complete, modern, production-style full-stack food delivery web application built with **React (Vite) + Tailwind CSS** on the frontend and **Node.js + Express + MongoDB (Mongoose)** on the backend.

---

## 📌 Table of Contents
1. [Project Overview](#-project-overview)
2. [Key Features](#-key-features)
3. [Technology Stack](#-technology-stack)
4. [Folder Structure](#-folder-structure)
5. [Installation & Setup](#-installation--setup)
6. [MongoDB Configuration](#-mongodb-configuration)
7. [Environment Variables](#-environment-variables)
8. [Running the Application](#-running-the-application)
9. [Database Seeding](#-database-seeding)
10. [REST API Documentation](#-rest-api-documentation)
11. [Default Test Credentials & Coupons](#-default-test-credentials--coupons)
12. [Future Improvements](#-future-improvements)

---

## 🌟 Project Overview

**BiteGo** is designed to deliver a high-end food discovery and ordering experience inspired by leading food platforms like Swiggy and Zomato, featuring custom orange & charcoal aesthetics, smooth micro-interactions, responsive card layouts, and full role-based access control (Customers, Restaurant Owners, and Platform Admins).

---

## ✨ Key Features

### 👤 Customer Experience (15 Core Pages)
1. **Home Page (`/`)**: Hero banner with live search, 10 food category badges, curated popular restaurants, top recommended dishes, promotional discount cards, and "How BiteGo Works" guide.
2. **Restaurant Listing (`/restaurants`)**: Advanced filter controls by cuisine, minimum star rating, sort order (rating, delivery time, price for two, popularity), and real-time search.
3. **Restaurant Details (`/restaurants/:id`)**: Rich restaurant cover banner, detailed address & delivery time metadata, categorized menu sections (Starters, Main Course, Pizza, Burgers, Desserts, Beverages), and veg/non-veg tags.
4. **Food Search Page (`/search`)**: Dedicated multi-dimensional search across dish names, restaurants, categories, and cuisines.
5. **Interactive Cart (`/cart`)**: Real-time quantity increment/decrement, cross-restaurant conflict detection, coupon validation engine with discount calculation, automatic delivery fee and GST tax computation.
6. **Checkout (`/checkout`)**: Saved and custom delivery address form, Cash on Delivery (COD) & Online Card Payment simulation, live price breakdown, and order placement.
7. **Auth Pages (`/login`, `/register`)**: JWT-based login and registration with bcrypt password hashing, form validation, and one-click demo credentials filling.
8. **User Profile (`/profile`)**: Manage personal details, phone number, and default delivery addresses.
9. **My Orders (`/orders`)**: List past and active orders with date, amount, restaurant, and color-coded status badges.
10. **Order Details & Live Tracker (`/orders/:id`)**: Multi-step visual progress pipeline (`Pending` → `Confirmed` → `Preparing` → `Out for Delivery` → `Delivered`), order cancellation (for pending orders), and post-delivery review ratings.
11. **Favorites (`/favorites`)**: One-click heart bookmarking to quickly access and reorder from preferred eateries.
12. **About Us (`/about`)**: Company vision, culinary partner milestones, and stats counter.
13. **Contact (`/contact`)**: Customer helpline, support email, office headquarters, and inquiry form.
14. **404 Not Found (`*`)**: Custom food-themed error page with quick links back to home.

### 🛡️ Admin Dashboard (`/admin/dashboard`)
- **System KPIs**: Real-time counters for Total Users, Active Restaurants, Total Orders, and Delivered Revenue.
- **Manage Users (`/admin/users`)**: Search accounts, promote/demote roles (`user`, `restaurantOwner`, `admin`), and delete accounts.
- **Manage Restaurants (`/admin/restaurants`)**: Add new partner restaurants with image URLs, cuisine tags, and opening status.
- **Manage Foods (`/admin/foods`)**: Browse and create platform food items tied to restaurants.
- **Manage Orders (`/admin/orders`)**: Filter by lifecycle status and update order status across all kitchens.
- **Manage Coupons (`/admin/coupons`)**: Create promo codes with percentage or flat discounts, min order constraints, max discount caps, and expiry dates.

### 👨‍🍳 Restaurant Owner Portal (`/owner/dashboard`)
- **Kitchen Overview**: Pending orders needing immediate attention, total volume, and gross sales.
- **Manage Menu (`/owner/menu`)**: Create, edit, and delete dishes; toggle dish stock availability (`In Stock` / `Out of Stock`).
- **Live Kitchen Orders (`/owner/orders`)**: Real-time incoming order cards with customer delivery addresses, items list, and status advancement controls.
- **Store Settings (`/owner/settings`)**: Toggle store open/closed status, update cuisine, pricing for two, average delivery time, and contact address.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, React Router DOM v6, Axios, Lucide React, React Hot Toast |
| **Backend** | Node.js (ES Modules), Express.js, JWT (`jsonwebtoken`), bcryptjs, Multer, Morgan, CORS |
| **Database** | MongoDB, Mongoose ODM |
| **Design System** | Tailored Warm Orange (`#f97316`), Dark Charcoal (`#111827`), Inter & Plus Jakarta Sans typography |

---

## 📁 Folder Structure

```
Food Delivery/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # MongoDB connection & non-crashing fallback
│   │   ├── controllers/
│   │   │   ├── admin.controller.js
│   │   │   ├── auth.controller.js
│   │   │   ├── cart.controller.js
│   │   │   ├── coupon.controller.js
│   │   │   ├── food.controller.js
│   │   │   ├── order.controller.js
│   │   │   ├── restaurant.controller.js
│   │   │   ├── review.controller.js
│   │   │   └── user.controller.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js     # JWT verification & role authorization
│   │   │   ├── error.middleware.js    # Global Express error handler
│   │   │   └── upload.middleware.js   # Multer local image uploader
│   │   ├── models/
│   │   │   ├── Cart.js
│   │   │   ├── Coupon.js
│   │   │   ├── Food.js
│   │   │   ├── Order.js
│   │   │   ├── Restaurant.js
│   │   │   ├── Review.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── admin.routes.js
│   │   │   ├── auth.routes.js
│   │   │   ├── cart.routes.js
│   │   │   ├── coupon.routes.js
│   │   │   ├── food.routes.js
│   │   │   ├── order.routes.js
│   │   │   ├── restaurant.routes.js
│   │   │   ├── review.routes.js
│   │   │   └── user.routes.js
│   │   ├── utils/
│   │   │   └── generateToken.js
│   │   ├── app.js                     # Express app setup, CORS, static uploads
│   │   └── server.js                  # Server entry point
│   ├── uploads/                       # Multer image storage directory
│   ├── .env.example
│   ├── .env
│   ├── package.json
│   └── seed.js                        # Database seeder with realistic Indian food data
│
├── frontend/
│   ├── src/
│   │   ├── admin/                     # Admin dashboard views
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── ManageCoupons.jsx
│   │   │   ├── ManageFoods.jsx
│   │   │   ├── ManageOrders.jsx
│   │   │   ├── ManageRestaurants.jsx
│   │   │   └── ManageUsers.jsx
│   │   ├── components/                # Reusable UI components
│   │   │   ├── CartItem.jsx
│   │   │   ├── CategoryCard.jsx
│   │   │   ├── FoodCard.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── RestaurantCard.jsx
│   │   ├── context/                   # Global React Contexts
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   ├── owner/                     # Restaurant partner views
│   │   │   ├── ManageMenu.jsx
│   │   │   ├── OwnerDashboard.jsx
│   │   │   ├── OwnerOrders.jsx
│   │   │   └── RestaurantSettings.jsx
│   │   ├── pages/                     # Public and Customer pages
│   │   │   ├── About.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Favorites.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── NotFound.jsx
│   │   │   ├── OrderDetails.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── RestaurantDetails.jsx
│   │   │   ├── Restaurants.jsx
│   │   │   └── Search.jsx
│   │   ├── services/
│   │   │   └── api.js                 # Axios instance with JWT interceptor
│   │   ├── App.jsx                    # Route registration & providers
│   │   ├── index.css                  # Tailwind styles & theme tokens
│   │   └── main.jsx
│   ├── .env.example
│   ├── .env
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

---

## ⚙️ Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (Local installation or free MongoDB Atlas cluster)

### 1. Clone or Open the Workspace
```bash
cd "Food Delivery"
```

### 2. Backend Setup
```bash
cd backend
npm install
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

---

## 🍃 MongoDB Configuration

You can use either a **Local MongoDB** or **MongoDB Atlas Cloud**.

### Option A: MongoDB Atlas (Cloud — Recommended)
1. Sign up for a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free M0 cluster.
3. Under **Security → Database Access**, create a user with read/write privileges.
4. Under **Network Access**, add IP address `0.0.0.0/0` (allow access from anywhere).
5. Click **Connect → Drivers**, copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/bitego?retryWrites=true&w=majority
   ```
6. Paste the string into `backend/.env` under `MONGO_URI`.

### Option B: Local MongoDB
Ensure your local MongoDB daemon is running:
```bash
mongod
```
The connection URI will be:
```
MONGO_URI=mongodb://127.0.0.1:27017/bitego
```

> **Note**: If MongoDB is not yet running, BiteGo's backend starts gracefully without crashing and logs informative instructions in the console.

---

## 🔐 Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/bitego
JWT_SECRET=bitego_super_secret_jwt_key_2026_dev_prod_token
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Running the Application

### Start Backend:
```bash
cd backend
npm run dev
```
Backend runs at: **http://localhost:5000** (Health check: `http://localhost:5000/api/health`)

### Start Frontend:
```bash
cd frontend
npm run dev
```
Frontend runs at: **http://localhost:5173**

---

## 🌱 Database Seeding

BiteGo includes a comprehensive seed script providing **10+ authentic restaurants**, **50+ food items**, **8 users**, and **5 promotional coupons**.

With MongoDB running and configured in `backend/.env`, run:
```bash
cd backend
npm run seed
```

Output:
```
✅ Connected to MongoDB
🗑️ Cleared existing data
👤 Users created: 8 (including admin + 2 owners)
🏪 Created 10 restaurants
🍛 Created 50+ food items
🎫 Created 5 coupons
✅ Database seeded successfully!
```

---

## 🔑 Default Test Credentials & Coupons

### Seeded Accounts
| Role | Email | Password | Access Rights |
|---|---|---|---|
| **Admin** | `admin@bitego.com` | `admin123` | Full admin control, users, stores, orders, coupons |
| **Restaurant Owner 1** | `owner1@bitego.com` | `owner123` | Manage "Spice Garden" menu, dispatch live orders |
| **Restaurant Owner 2** | `owner2@bitego.com` | `owner123` | Manage "Royal Dum Biryani" menu & orders |
| **Customer** | `john@example.com` | `user123` | Browse, order, favorite, review, checkout |
| **Customer** | `ananya@example.com` | `user123` | Regular customer account |

*(Tip: On the `/login` page, you can click the quick "Fill User", "Fill Admin", or "Fill Owner" demo buttons to instantly populate credentials!)*

### Seeded Coupons
- `WELCOME50` — 50% OFF up to ₹150 (Min order: ₹199)
- `SPICE20` — 20% OFF up to ₹100 (Min order: ₹249)
- `FIRST15` — 15% OFF up to ₹80 (Min order: ₹300)
- `DRAGON60` — Flat ₹60 OFF (Min order: ₹499)
- `LOYAL10` — 10% OFF up to ₹50 (Min order: ₹150)

---

## 📡 REST API Documentation

### Auth & User (`/api/auth`, `/api/users`)
- `POST /api/auth/register` — Register a customer or restaurant owner
- `POST /api/auth/login` — Sign in and receive JWT token
- `GET /api/auth/me` — Fetch currently authenticated user
- `PUT /api/users/profile` — Update address, name, or phone number
- `GET /api/users/favorites` — Fetch user's saved favorite restaurants
- `POST /api/users/favorites/:restaurantId` — Toggle restaurant in favorites

### Restaurants (`/api/restaurants`)
- `GET /api/restaurants` — Search & filter restaurants (supports `?search=`, `?cuisine=`, `?rating=`, `?sort=`)
- `GET /api/restaurants/owner/mine` — Retrieve owner's associated restaurant
- `GET /api/restaurants/:id` — Get restaurant profile and details
- `POST /api/restaurants` — Create restaurant (Admin/Owner)
- `PUT /api/restaurants/:id` — Update restaurant details
- `DELETE /api/restaurants/:id` — Delete restaurant (Admin)

### Food Items (`/api/foods`)
- `GET /api/foods` — Filter foods by `?restaurant=`, `?category=`, `?search=`
- `GET /api/foods/:id` — Single food item details
- `POST /api/foods` — Add new food item (Admin/Owner)
- `PUT /api/foods/:id` — Update food or toggle availability
- `DELETE /api/foods/:id` — Remove food item

### Cart & Orders (`/api/cart`, `/api/orders`)
- `GET /api/cart` — Fetch persistent user cart
- `POST /api/cart` — Add item to cart
- `PUT /api/cart/:itemId` — Modify item quantity
- `DELETE /api/cart/:itemId` — Remove item or clear cart
- `POST /api/orders` — Create new order
- `GET /api/orders` — Retrieve user's order history
- `GET /api/orders/restaurant` — Retrieve incoming orders for restaurant owner
- `GET /api/orders/:id` — Order status and receipt
- `PUT /api/orders/:id/status` — Advance or cancel order status

### Coupons & Reviews (`/api/coupons`, `/api/reviews`)
- `GET /api/coupons` — List available promo codes
- `POST /api/coupons/apply` — Validate code against cart total
- `POST /api/coupons` — Create promotional coupon (Admin)
- `DELETE /api/coupons/:id` — Remove coupon (Admin)
- `POST /api/reviews` — Submit 1-5 star review and comment
- `GET /api/reviews/restaurant/:restaurantId` — List verified reviews

### Admin Management (`/api/admin`)
- `GET /api/admin/stats` — Metrics (users, restaurants, orders, total revenue, 7-day sales)
- `GET /api/admin/users` — List all registered users
- `PUT /api/admin/users/:id/role` — Update user role
- `DELETE /api/admin/users/:id` — Delete user account
- `GET /api/admin/orders` — Global orders query
- `GET /api/admin/reviews` — Global review monitoring

---

## 🔮 Future Improvements
- [ ] Integration with Razorpay / Stripe for live card & UPI payments.
- [ ] Push notifications using WebSockets (Socket.io) for instant kitchen order dispatch alerts.
- [ ] Cloudinary direct cloud media uploads for production deployments.
- [ ] Live Google Maps delivery partner tracking.

---

Made with ❤️ for BiteGo — Good Food. Fast Delivery.

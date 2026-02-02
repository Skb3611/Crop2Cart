# FreshLocal - Local Farmer Marketplace (Student Project)

Welcome to **FreshLocal**! 🌾🛒

This project is a full-stack web application designed to connect local farmers directly with buyers in their area. Think of it as a "local Amazon" for fresh produce, helping farmers get better prices and buyers get fresher food.

It is built using modern web technologies and is a great example of how to build a real-world application with **Next.js**, **PostgreSQL**, and **Tailwind CSS**.

---

## 📖 What is this Project?

FreshLocal solves a simple problem: Farmers often struggle to reach local customers, and customers often can't find fresh, local produce easily.

**Key Concepts:**
*   **Hyper-local**: Uses GPS to only show products within a 10km radius.
*   **Role-based Access**: Different dashboards for **Farmers**, **Buyers**, and **Admins**.
*   **Real-time Logic**: Inventory management and order status tracking.

---

## 📂 Project Structure Explained

Understanding the folder structure is key to navigating the code. Here is a breakdown of the most important directories:

```text
Crop2Cart/
├── app/                  # 🚀 Main Application Logic (Next.js App Router)
│   ├── api/              # Backend API routes (handling database requests)
│   ├── components/       # Page-specific components
│   ├── globals.css       # Global styles
│   ├── layout.js         # Main layout wrapper (navbar, footer, etc.)
│   └── page.js           # The homepage
│
├── components/           # 🧩 Reusable UI Components
│   ├── auth/             # Login and Register forms
│   ├── dashboard/        # Dashboards for Admin, Buyer, and Farmer
│   ├── home/             # Landing page components
│   └── ui/               # Shadcn UI library components (Buttons, Inputs, etc.)
│
├── lib/                  # 🛠️ Helper Functions & Utilities
│   ├── auth.js           # Authentication logic (handling passwords/sessions)
│   ├── gps.js            # GPS distance calculation logic
│   ├── prisma.js         # Database connection client
│   └── utils.js          # General utility functions
│
├── prisma/               # 🗄️ Database Configuration
│   ├── schema.prisma     # Defines the database tables and relationships
│   └── seed.js           # Script to populate the DB with dummy data
│
└── public/               # 🖼️ Static Assets (images, icons)
```

---

## ✨ Key Features

### 🛒 For Buyers
*   **Find Nearby Food**: Automatically finds farmers within 10km of your location.
*   **Easy Shopping**: Add items to cart and checkout.
*   **Flexible Payments**: Pay via Cash on Delivery or Online (Simulated).

### 👨‍🌾 For Farmers
*   **Manage Products**: Add, edit, or remove your crops.
*   **Order Management**: See new orders and mark them as packed/delivered.
*   **Location Tagging**: Set your farm's exact GPS location.

### 🛡️ For Admins
*   **Verification**: Approve new farmers to ensure safety.
*   **Oversight**: View platform statistics and manage users.

---

## �️ Dashboard Features

### 👨‍🌾 Farmer Dashboard
Designed for farmers to manage their inventory and sales.
*   **Products Tab**:
    *   View all your listed crops.
    *   **Add Product**: Upload new items with details like Name, Category (Fruit, Vegetable, Grain), Price, and Quantity.
    *   **Edit/Delete**: Update prices or remove out-of-stock items.
*   **Orders Tab**:
    *   View incoming orders from buyers.
    *   **Status Updates**: Mark orders as "Packed" or "Delivered".

### 🛒 Buyer Dashboard
The shopping interface for customers.
*   **Products Tab**:
    *   **GPS Filtering**: Automatically shows products from farmers within 10km.
    *   **Categories**: Filter by Vegetables, Fruits, Grains, etc.
    *   **Cart**: Add items and proceed to checkout.
*   **Orders Tab**:
    *   Track the status of your purchases (Pending, Packed, Delivered).

### 👮 Admin Dashboard
The control center for platform administrators.
*   **Approvals Tab**: Review and verify new farmer registrations (safety check).
*   **Users Tab**: View a list of all registered Buyers and Farmers.
*   **Stats Overview**: See total users, total orders, and platform activity.

---

## 🔌 API Reference

The backend provides a RESTful API powered by Next.js Route Handlers.

### 🔐 Authentication
*   `POST /api/auth/register`: Create a new account (Farmer/Buyer).
*   `POST /api/auth/login`: Sign in and receive a JWT token.
*   `GET /api/auth/me`: Get current user details.

### 📦 Products
*   `GET /api/products`: Fetch products.
    *   *Query Params*: `latitude`, `longitude` (for location filtering), `category`.
*   `POST /api/products`: Create a new product listing (Farmers only).
*   `PUT /api/products/:id`: Update an existing product.
*   `DELETE /api/products/:id`: Remove a product.
*   `GET /api/products/my`: Get all products listed by the logged-in farmer.

### 🛍️ Orders
*   `POST /api/orders`: Place a new order (Buyers only).
*   `GET /api/orders/buyer`: Get purchase history for the logged-in buyer.
*   `GET /api/orders/farmer`: Get incoming sales for the logged-in farmer.

### ⚙️ Admin
*   `GET /api/admin/stats`: Fetch platform-wide statistics.
*   `GET /api/admin/farmers/pending`: List farmers waiting for approval.
*   `GET /api/admin/users`: List all users on the platform.

---

## �🛠️ Tech Stack (And Why We Used It)

*   **Next.js 14**: A powerful React framework that handles both the Frontend (UI) and Backend (API) in one place.
*   **Tailwind CSS**: For styling the app quickly without writing raw CSS files.
*   **Shadcn/UI**: A library of beautiful, pre-made components to make the app look professional.
*   **Prisma & PostgreSQL**: Prisma makes interacting with the database easy using simple commands instead of complex SQL queries.
*   **JWT (JSON Web Tokens)**: Securely handles user login and sessions.

---

## 🔐 Demo Credentials

Use these accounts to test the different roles in the application:

| Role | Email | Password | Location Context |
|------|-------|----------|------------------|
| **Admin** | `admin@freshlocal.com` | `admin123` | Can approve farmers |
| **Farmer** | `farmer1@example.com` | `farmer123` | Mumbai (19.0760, 72.8777) |
| **Buyer** | `buyer@example.com` | `buyer123` | Mumbai (19.1136, 72.8697) |

---

## �📦 Installation & Setup Guide

If you want to run this project on your local machine, follow these steps.

### Prerequisites
*   **Node.js 18+** installed.
*   **PostgreSQL** installed and running.

### Step 1: Install Dependencies
Open your terminal in the project folder and run:
```bash
yarn install
```

### Step 2: Database Setup
The project is configured to use a local PostgreSQL database. The connection string is in the `.env` file.
```bash
# This sets up the database tables
npx prisma migrate dev

# This fills the database with sample data (Admin, Farmers, Products)
npx prisma db seed
```

### Step 3: Run the Server
Start the development server:
```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app!

### 📚 API Endpoints
The backend API is available at `http://localhost:3000/api`.
*   `POST /api/auth/register` - Register new user
*   `POST /api/auth/login` - Login user

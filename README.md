# InventoryPro - Inventory Management System

A modern, full-stack inventory management system built with React, Node.js, Express, and MongoDB. This application allows users to efficiently manage products, categories, and stock with secure authentication.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [License](#license)

---

## ✨ Features

### Authentication
- User Registration
- User Login
- User Logout
- JWT-based secure authentication
- Protected routes for authenticated users

### Dashboard
- Total Products count
- Total Categories count
- Total Stock Quantity
- Low Stock Items count
- Out of Stock Items count

### Product Management (CRUD)
- Add new product
- View all products with pagination
- View product details
- Edit product information
- Delete product with confirmation modal

### Product Fields
- Product Name
- SKU (Unique)
- Category (Linked to Categories)
- Description
- Quantity
- Unit Price
- Supplier Name
- Status (Auto-updated: In Stock / Low Stock / Out of Stock)
- Date Added (Auto)
- Last Updated (Auto)

### Inventory Features
- Automatic stock status based on quantity
- Search products by name or SKU
- Filter by category
- Filter by stock status
- Sort by product name, quantity, or price
- Pagination for product listing

### Categories
- Create categories
- Edit categories
- Delete categories
- Assign products to categories

### Stock Management
- Increase stock with transaction notes
- Reduce stock with transaction notes
- View stock history
- Prevent negative inventory values

### Validation
- Required fields validation
- Unique SKU validation
- Numeric field validation
- Positive quantity and price validation
- Meaningful error messages

### UI/UX
- Fully responsive design
- Modern and intuitive UI with green theme
- Loading indicators
- Success and error toast notifications
- Form validation with error messages
- Empty state handling
- Confirmation modals for delete operations

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2.0 | UI Framework |
| Vite | 5.0.0 | Build Tool |
| Tailwind CSS | 3.4.0 | Styling |
| React Router DOM | 6.20.0 | Routing |
| Axios | 1.6.0 | HTTP Client |
| React Hot Toast | 2.4.0 | Notifications |
| React Icons | 4.12.0 | Icons |
| Headless UI | 1.7.0 | Accessible Components |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | Runtime |
| Express.js | 4.18.2 | Web Framework |
| MongoDB | 7.5.0 | Database |
| Mongoose | 7.5.0 | ODM |
| JWT | 9.0.2 | Authentication |
| Bcryptjs | 2.4.3 | Password Hashing |
| Express Validator | 7.0.1 | Input Validation |
| Cors | 2.8.5 | Cross-Origin Resource Sharing |
| Dotenv | 16.3.1 | Environment Variables |
| Helmet | 7.0.0 | Security Headers |
| Morgan | 1.10.0 | Logging |
| Cookie Parser | 1.4.6 | Cookie Parsing |

---

## 📁 Project Structure
inventory-management-system/
│
├── backend/
│ ├── src/
│ │ ├── config/
│ │ │ └── database.js # MongoDB connection
│ │ ├── models/
│ │ │ ├── User.js # User schema
│ │ │ ├── Product.js # Product schema
│ │ │ ├── Category.js # Category schema
│ │ │ └── InventoryTransaction.js # Transaction schema
│ │ ├── controllers/
│ │ │ ├── authController.js # Auth logic
│ │ │ ├── productController.js # Product CRUD
│ │ │ ├── categoryController.js # Category CRUD
│ │ │ └── inventoryController.js # Stock management
│ │ ├── routes/
│ │ │ ├── authRoutes.js # Auth endpoints
│ │ │ ├── productRoutes.js # Product endpoints
│ │ │ ├── categoryRoutes.js # Category endpoints
│ │ │ └── inventoryRoutes.js # Inventory endpoints
│ │ ├── middleware/
│ │ │ ├── auth.js # JWT verification
│ │ │ ├── validation.js # Input validation
│ │ │ └── errorHandler.js # Global error handler
│ │ ├── utils/
│ │ │ ├── helpers.js # Helper functions
│ │ │ └── validators.js # Custom validators
│ │ └── app.js # Express app config
│ ├── .env.example # Environment variables template
│ ├── package.json # Dependencies
│ └── server.js # Entry point
│
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ │ ├── common/ # Reusable components
│ │ │ │ ├── Button.jsx
│ │ │ │ ├── Input.jsx
│ │ │ │ ├── Card.jsx
│ │ │ │ ├── Modal.jsx
│ │ │ │ ├── Loader.jsx
│ │ │ │ ├── Navbar.jsx
│ │ │ │ ├── PrivateRoute.jsx
│ │ │ │ └── ConfirmModal.jsx
│ │ │ ├── auth/ # Auth components
│ │ │ │ ├── Login.jsx
│ │ │ │ └── Register.jsx
│ │ │ ├── products/ # Product components
│ │ │ │ ├── ProductForm.jsx
│ │ │ │ ├── ProductCard.jsx
│ │ │ │ ├── ProductFilters.jsx
│ │ │ │ └── ProductPagination.jsx
│ │ │ ├── categories/ # Category components
│ │ │ │ ├── CategoryForm.jsx
│ │ │ │ └── CategoryCard.jsx
│ │ │ ├── inventory/ # Inventory components
│ │ │ │ ├── StockAdjustment.jsx
│ │ │ │ └── StockHistory.jsx
│ │ │ └── dashboard/ # Dashboard components
│ │ │ ├── StatsCard.jsx
│ │ │ ├── QuickActions.jsx
│ │ │ ├── RecentActivity.jsx
│ │ │ └── StatusCard.jsx
│ │ ├── context/
│ │ │ └── AuthContext.jsx # Auth state management
│ │ ├── hooks/
│ │ │ ├── useAuth.js
│ │ │ ├── useProducts.js
│ │ │ ├── useCategories.js
│ │ │ ├── useInventory.js
│ │ │ └── useToast.js
│ │ ├── pages/
│ │ │ ├── LoginPage.jsx
│ │ │ ├── RegisterPage.jsx
│ │ │ ├── DashboardPage.jsx
│ │ │ ├── ProductsPage.jsx
│ │ │ ├── ProductDetailPage.jsx
│ │ │ ├── CategoriesPage.jsx
│ │ │ ├── InventoryPage.jsx
│ │ │ └── NotFoundPage.jsx
│ │ ├── services/
│ │ │ ├── api.js
│ │ │ ├── authService.js
│ │ │ ├── productService.js
│ │ │ ├── categoryService.js
│ │ │ └── inventoryService.js
│ │ ├── utils/
│ │ │ ├── constants.js
│ │ │ ├── validators.js
│ │ │ ├── formatters.js
│ │ │ └── helpers.js
│ │ ├── styles/
│ │ │ └── index.css
│ │ ├── App.jsx
│ │ └── main.jsx
│ ├── .env.example
│ ├── package.json
│ ├── tailwind.config.js
│ └── vite.config.js
│
├── .gitignore
└── README.md

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (v9 or higher) or **yarn**
- **MongoDB** (Local installation or MongoDB Atlas account)

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone  https://github.com/pankaj-mandloi/inventory-management-system.git
cd inventory-management-system
2. Backend Setup
bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update the .env file with your MongoDB URI and JWT secret
# (See Environment Variables section below)

# Start the backend server
npm run dev
3. Frontend Setup
bash
# Open a new terminal and navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update the .env file with your API URL
# (See Environment Variables section below)

# Start the frontend development server
npm run dev
4. Access the Application
Frontend: http://localhost:5173

Backend API: http://localhost:5000/api

Health Check: http://localhost:5000/api/health

🔧 Environment Variables
Backend (.env)
Create a .env file in the backend/ directory with the following variables:

env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
# For MongoDB Atlas:
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/inventory_db?retryWrites=true&w=majority

# For Local MongoDB:
# MONGODB_URI=mongodb://localhost:27017/inventory_db

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Client URL (Frontend)
CLIENT_URL=http://localhost:5173
Frontend (.env)
Create a .env file in the frontend/ directory with the following variables:

env
# Backend API URL
VITE_API_URL=http://localhost:5000/api
🏃 Running the Application
Development Mode
Start Backend Server
bash
cd backend
npm run dev
Start Frontend Server
bash
cd frontend
npm run dev
Production Build
Build Backend
bash
cd backend
npm start
Build Frontend
bash
cd frontend
npm run build
npm run preview

📡 API Endpoints
Authentication
Method	Endpoint	Description	Auth Required
POST	/api/auth/register	Register new user	❌
POST	/api/auth/login	Login user	❌
POST	/api/auth/logout	Logout user	✅
GET	/api/auth/me	Get current user	✅
Products
Method	Endpoint	Description	Auth Required
GET	/api/products	Get all products (with filters)	✅
GET	/api/products/stats/dashboard	Get dashboard stats	✅
POST	/api/products	Create new product	✅
GET	/api/products/:id	Get single product	✅
PUT	/api/products/:id	Update product	✅
DELETE	/api/products/:id	Delete product	✅
Categories
Method	Endpoint	Description	Auth Required
GET	/api/categories	Get all categories	✅
POST	/api/categories	Create category	✅
GET	/api/categories/:id	Get single category	✅
PUT	/api/categories/:id	Update category	✅
DELETE	/api/categories/:id	Delete category	✅
Inventory
Method	Endpoint	Description	Auth Required
POST	/api/inventory/increase	Increase stock	✅
POST	/api/inventory/reduce	Reduce stock	✅
GET	/api/inventory/history/:productId	Get stock history	✅
GET	/api/inventory/transactions	Get all transactions	✅
Query Parameters (Products)
Parameter	Description	Example
search	Search by name or SKU	?search=iPhone
category	Filter by category ID	?category=65f...
status	Filter by status	?status=In%20Stock
sortBy	Sort field	?sortBy=name
sortOrder	Sort order	?sortOrder=asc
page	Page number	?page=2
limit	Items per page	?limit=10

🗄️ Database Schema

Users Collection
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String ['user', 'admin'],
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}

Categories Collection
{
  _id: ObjectId,
  name: String (unique),
  description: String,
  products: [ObjectId] (references Products),
  createdAt: Date,
  updatedAt: Date
}

Products Collection
{
  _id: ObjectId,
  name: String,
  sku: String (unique),
  category: ObjectId (references Categories),
  description: String,
  quantity: Number,
  unitPrice: Number,
  supplier: String,
  status: String ['In Stock', 'Low Stock', 'Out of Stock'],
  imageUrl: String (optional),
  barcode: String (optional),
  createdAt: Date,
  updatedAt: Date
}

Inventory Transactions Collection
{
  _id: ObjectId,
  product: ObjectId (references Products),
  type: String ['INCREASE', 'DECREASE'],
  quantity: Number,
  previousQuantity: Number,
  newQuantity: Number,
  note: String,
  user: ObjectId (references Users),
  createdAt: Date
}

ER Diagram

┌─────────┐          ┌──────────┐          ┌──────────────┐
│  Users  │          │ Products │          │  Categories  │
├─────────┤          ├──────────┤          ├──────────────┤
│ _id     │◄─────────│ user     │          │ _id          │
│ name    │          │ _id      │──┐       │ name         │
│ email   │          │ name     │  │       │ description  │
│ password│          │ sku      │  │       │ products[]   │
│ role    │          │ category │──┘       │ createdAt    │
│ isActive│          │ quantity │          │ updatedAt    │
│ ...     │          │ price    │          └──────────────┘
└─────────┘          │ supplier │
                     │ status   │
                     │ ...      │
                     └──────────┘
                         │
                         │
                    ┌────▼────────────┐
                    │ Inventory       │
                    │ Transactions    │
                    ├─────────────────┤
                    │ _id             │
                    │ product         │
                    │ type            │
                    │ quantity        │
                    │ previousQty     │
                    │ newQty          │
                    │ note            │
                    │ user            │
                    │ createdAt       │
                    └─────────────────┘
📄 License
This project is created for the Full Stack Developer Assignment submission.

👤 Author
Pankaj Mandloi
Email: mandloipankaj2000@gmail.com
GitHub: https://github.com/pankaj-mandloi

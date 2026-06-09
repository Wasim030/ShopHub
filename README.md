# ShopHub - Full-Stack E-Commerce Website

A fully functional e-commerce website built with React, Node.js, Express, and MongoDB.

## Features

### User Features
- User registration and login with JWT authentication
- Profile management (edit name, email, password, address)
- Password reset via email
- Order history and tracking

### Product Management
- Product listing with grid view
- Search, filtering (category, price range, ratings)
- Sorting (price, newest, best selling)
- Individual product pages with images, description, reviews
- Product categories and subcategories

### Shopping Cart
- Add/remove items, update quantities
- Saved cart for logged-in users
- Cart summary with subtotal, tax, shipping, total

### Checkout Process
- Shipping address form
- Payment method selection (Stripe / COD)
- Order review before submission

### Order Management
- Unique order ID generation
- Order confirmation email
- Status updates (pending, processing, shipped, delivered, cancelled)

### Admin Panel
- Admin login (separate from user login)
- Dashboard with sales analytics
- Product CRUD management
- Order management with status updates
- User management

### Additional Features
- Product reviews and ratings (1-5 stars)
- Wishlist functionality
- Newsletter signup
- Contact form with email notification
- Responsive mobile-first design

## Tech Stack

**Frontend:** React 18, Tailwind CSS, React Router v6, Axios, React Hot Toast, React Icons

**Backend:** Node.js, Express, MongoDB/Mongoose, JWT, Stripe, Nodemailer, Multer, Helmet

## Project Structure

```
e-commerce/
├── client/                  # React frontend
│   ├── public/
│   └── src/
│       ├── components/      # Reusable components
│       ├── pages/           # Page components
│       │   └── admin/       # Admin pages
│       ├── context/         # React context providers
│       ├── utils/           # API client & helpers
│       ├── App.js           # Main app with routes
│       └── index.js         # Entry point
├── server/                  # Express backend
│   ├── config/              # DB & Cloudinary config
│   ├── controllers/         # Request handlers
│   ├── middleware/           # Auth, error, upload
│   ├── models/              # Mongoose models
│   ├── routes/              # API routes
│   ├── utils/               # Email, token, seed
│   └── server.js            # Entry point
├── .env.example             # Environment variables template
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- MongoDB instance (local or Atlas)
- Stripe account (for payments)
- Gmail account (for emails)

### 1. Clone and Install

```bash
git clone <repository-url>
cd e-commerce

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` in the root directory and fill in your values:

```bash
cp .env.example .env
```

Required variables:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - A random secret string for JWT signing
- `STRIPE_SECRET_KEY` - Your Stripe secret key
- `EMAIL_USER` / `EMAIL_PASS` - Gmail credentials for sending emails

### 3. Seed Database

```bash
cd server
npm run seed
```

This creates:
- Admin user: `admin@example.com` / `admin123`
- Regular user: `john@example.com` / `password123`
- 8 sample products

### 4. Start Development Servers

```bash
# Terminal 1 - Start backend (port 5000)
cd server
npm run dev

# Terminal 2 - Start frontend (port 3000)
cd client
npm start
```

### 5. Build for Production

```bash
# Build React app
cd client
npm run build

# Start production server (serves React build)
cd ../server
NODE_ENV=production npm start
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/admin/login` - Admin login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/password` - Update password
- `POST /api/auth/forgot-password` - Send reset email
- `PUT /api/auth/reset-password/:token` - Reset password

### Products
- `GET /api/products` - List products (with search, filter, sort, pagination)
- `GET /api/products/featured` - Get featured products
- `GET /api/products/slug/:slug` - Get product by slug
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/:id/related` - Get related products
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Deactivate product (admin)
- `POST /api/products/:id/reviews` - Add review

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart` - Update item quantity
- `DELETE /api/cart/:productId` - Remove item
- `DELETE /api/cart/clear` - Clear cart

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/mine` - Get user's orders
- `GET /api/orders/:id` - Get order details
- `GET /api/orders/admin/all` - List all orders (admin)
- `GET /api/orders/admin/analytics` - Sales analytics (admin)
- `PUT /api/orders/:id/status` - Update order status (admin)

### Wishlist
- `GET /api/wishlist` - Get wishlist
- `POST /api/wishlist` - Toggle product in wishlist
- `GET /api/wishlist/:productId` - Check if in wishlist

### Other
- `POST /api/contact` - Submit contact form
- `POST /api/newsletter/subscribe` - Subscribe to newsletter
- `POST /api/newsletter/unsubscribe` - Unsubscribe
- `POST /api/payment/create-payment-intent` - Create Stripe payment intent

## Security
- Password hashing with bcrypt (12 rounds)
- JWT-based authentication
- HTTP security headers (Helmet)
- Rate limiting on auth routes
- MongoDB injection sanitization
- Input validation (client + server)
- File upload restrictions (images only, max 5MB)

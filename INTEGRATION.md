# Integration Instructions for Admin Panel Features

This document provides the steps needed to integrate the newly created Admin "Recent Orders" feature into your existing Node.js application.

## 1. File Placement

Place the following newly generated files into your project structure as described below.

| File Name                                  | Destination Path                                        |
|--------------------------------------------|---------------------------------------------------------|
| `Admin_README.md`                          | `/` (Project Root)                                      |
| `Admin_Laundry_API.postman_collection.json`| `/` (Project Root)                                      |
| `order.model.js`                           | `src/models/order.model.js` (Overwrite existing)        |
| `auth.middleware.js`                       | `src/middlewares/auth.middleware.js` (Overwrite existing) |
| `admin.order.controller.js`                | `src/controllers/admin-controllers/`                      |
| `admin.order.routes.js`                    | `src/routes/admin-routes/`                                |

## 2. Install Dependencies

The new `order.model.js` uses the `nanoid` package to generate unique order IDs. Run the following command in your terminal to install it:

```bash
npm install nanoid
```

## 3. Environment Variables

The authentication middleware (`auth.middleware.js`) relies on a `JWT_SECRET` environment variable to sign and verify JSON Web Tokens. Make sure you have a `.env` file in your project root with this variable set.

If you don't have one, create a `.env` file and add the following:

```
# .env

# Use a long, random, and secret string for production
JWT_SECRET="your-super-secret-and-long-jwt-secret"
```

## 4. Update Your Main Application File (`app.js` or `server.js`)

To activate the new admin route, you need to import it and mount it in your main application file (e.g., `src/app.js` or `src/server.js`).

First, import the new admin order routes at the top of the file with your other route imports:

```javascript
// src/app.js or src/server.js

// ... other imports
import adminOrderRoutes from "./routes/admin-routes/admin.order.routes.js";
// ... other route imports
```

Next, add the following code to mount the router. This tells your Express application to use the new routes and prefixes them with `/api/admin/orders`. Place this with your other API route middleware.

```javascript
// ... near where you configure your other routes

// Mount admin routes
app.use("/api/admin/orders", adminOrderRoutes);

// ...
```

Your `app.js` or `server.js` might look something like this after the changes:

```javascript
import express from "express";
// ... other imports

// Route Imports
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import adminOrderRoutes from "./routes/admin-routes/admin.order.routes.js"; // <-- Add this import

const app = express();

// Middlewares
app.use(express.json());
// ... other middlewares

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin/orders", adminOrderRoutes); // <-- Add this line

// ... error handling and server start
```

---

After following these steps, your admin endpoint `GET /api/admin/orders/recent` will be live and protected. You can now test it using the provided Postman collection.

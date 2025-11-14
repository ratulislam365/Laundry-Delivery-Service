import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import { authRouter } from './routes/auth.routes.js';
import userRouter from "./routes/user.routes.js";
import { errorHandler } from './middlewares/error.middleware.js';
import packageRoutes from './routes/package.routes.js';
import adminPackageRoutes from './routes/admin.package.routes.js';
import orderRoutes from "./routes/order.routes.js";
import adminOrderRoutes from "./routes/admin-routes/admin.routes.js";

import { handleStripeWebhook } from './controllers/stripe.controller.js';

import adminDashboardRoutes from "./routes/admin-routes/adminDashboard.routes.js";
import transactionRoutes from "./routes/admin-routes/transaction.routes.js";

import userRoutes from "./routes/admin-routes/routes.user.routes.js";
import notificationRoutes from "./routes/admin-routes/admin.notification.routes.js";

const app = express();

app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// user management
app.use("/api/user", userRouter);

// Routes
app.use('/api/auth', authRouter);

// packageRoutes manegmant
app.use('/api', packageRoutes);
app.use('/api', adminPackageRoutes);

// order managemanet
app.use("/api/orders", orderRoutes);
app.use("/api/admin/orders", adminOrderRoutes);


// all admin part in this procet 
app.use("/api/admin", adminDashboardRoutes);
app.use("/api/admin/transactions", transactionRoutes);

// Routes
app.use("/api/admin/users", userRoutes);
app.use("/api/admin/notifications", notificationRoutes);



// Global Error Handler
app.use(errorHandler);
export default app;

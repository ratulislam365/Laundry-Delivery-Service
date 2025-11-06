import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import { authRouter } from './routes/auth.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';
import packageRoutes from './routes/package.routes.js';
import adminPackageRoutes from './routes/admin.package.routes.js';
import orderRoutes from "./routes/order.routes.js";
import adminOrderRoutes from "./routes/admin.order.routes.js";




const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRouter);

// packageRoutes manegmant
app.use('/api', packageRoutes);
app.use('/api', adminPackageRoutes);

// order managemanet
app.use("/api/orders", orderRoutes);
app.use("/api/admin/orders", adminOrderRoutes);


export default app;
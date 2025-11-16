import express from "express";
import { getRecentOrders } from "../../controllers/admin-controllers/admin.order.controller.js";
import { verifyAccessToken, requireAdmin } from "../../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/admin/orders/recent:
 *   get:
 *     summary: Get recent orders (for admins)
 *     tags: [Admin Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, in_progress, completed, cancelled]
 *         description: Filter by order status
 *       - in: query
 *         name: platform
 *         schema:
 *           type: string
 *           enum: [app, web]
 *         description: Filter by platform
 *       - in: query
 *         name: serviceType
 *         schema:
 *           type: string
 *           enum: [wash & fold, iron only, full service]
 *         description: Filter by service type
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query for orderId, customer name, or phone
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for range filter (e.g., YYYY-MM-DD)
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for range filter (e.g., YYYY-MM-DD)
 *     responses:
 *       '200':
 *         description: A list of recent orders.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 meta:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       '401':
 *         description: Unauthorized, token is missing or invalid
 *       '403':
 *         description: Forbidden, user is not an admin
 */
router.get("/recent", verifyAccessToken, requireAdmin, getRecentOrders);

export default router;

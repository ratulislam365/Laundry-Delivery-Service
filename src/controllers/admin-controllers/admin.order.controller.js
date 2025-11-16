import Order from "../../models/order.model.js";
import User from "../../models/user.model.js";
import catchAsync from "../../utils/catchAsync.js";
import AppError from "../../utils/appError.js";
import mongoose from "mongoose";

/**
 * @route GET /api/admin/orders/recent
 * @description Get recent orders with pagination, filtering, and search.
 * @access Private (Admin)
 *
 * @query {number} [page=1] - Page number for pagination.
 * @query {number} [limit=10] - Number of items per page.
 * @query {string} [status] - Filter by order status (e.g., 'pending', 'completed').
 * @query {string} [platform] - Filter by platform (e.g., 'app', 'web').
 * @query {string} [serviceType] - Filter by service type (e.g., 'wash & fold').
 * @query {string} [q] - Search query for orderId, customer name, or phone.
 * @query {string} [from] - Start date for date range filter (YYYY-MM-DD).
 * @query {string} [to] - End date for date range filter (YYYY-MM-DD).
 */
export const getRecentOrders = catchAsync(async (req, res, next) => {
  // 1. Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // 2. Build Match Stage for filtering and search
  const matchStage = {};

  // Date range filter
  if (req.query.from && req.query.to) {
    const fromDate = new Date(req.query.from);
    const toDate = new Date(req.query.to);
    toDate.setHours(23, 59, 59, 999); // Include the whole end day
    matchStage.createdAt = { $gte: fromDate, $lte: toDate };
  }

  // Exact match filters
  if (req.query.status) matchStage.status = req.query.status;
  if (req.query.platform) matchStage.platform = req.query.platform;
  if (req.query.serviceType) matchStage.serviceType = req.query.serviceType;

  // Search filter (will be applied after $lookup)
  const searchQuery = req.query.q;
  const searchMatchStage = {};
  if (searchQuery) {
    const searchRegex = new RegExp(searchQuery, "i");
    searchMatchStage.$or = [
      { orderId: { $regex: searchRegex } },
      { "customer.fullname": { $regex: searchRegex } },
      { "customer.phonenumber": { $regex: searchRegex } },
    ];
  }

  // 3. Aggregation Pipeline
  const pipeline = [
    // Stage 1: Apply initial filters on order fields
    { $match: matchStage },
    // Stage 2: Lookup customer details
    {
      $lookup: {
        from: "users", // The actual name of the users collection in MongoDB
        localField: "customer",
        foreignField: "_id",
        as: "customerInfo",
      },
    },
    // Stage 3: Deconstruct the customerInfo array
    {
      $unwind: {
        path: "$customerInfo",
        preserveNullAndEmptyArrays: true, // Keep orders even if customer is not found
      },
    },
    // Stage 4: Rename/reshape the customer field
    {
      $addFields: {
        customer: {
          _id: "$customerInfo._id",
          fullname: "$customerInfo.fullname",
          email: "$customerInfo.email",
          phonenumber: "$customerInfo.phonenumber",
        },
      },
    },
    {
      $project: { customerInfo: 0 }, // Clean up the temporary field
    },
    // Stage 5: Apply search query on order and populated customer fields
    { $match: searchMatchStage },
    // Stage 6: Sort by most recent
    { $sort: { createdAt: -1 } },
    // Stage 7: Facet for metadata and paginated data
    {
      $facet: {
        metadata: [{ $count: "total" }],
        data: [{ $skip: skip }, { $limit: limit }],
      },
    },
  ];

  const result = await Order.aggregate(pipeline);

  const metadata = result[0].metadata[0];
  const data = result[0].data;

  const total = metadata ? metadata.total : 0;
  const pages = Math.ceil(total / limit);

  // 4. Send Response
  res.status(200).json({
    success: true,
    meta: {
      total,
      page,
      limit,
      pages,
    },
    data,
  });
});

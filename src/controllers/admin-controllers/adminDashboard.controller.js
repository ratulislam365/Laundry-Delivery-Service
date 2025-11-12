import User from "../../models/user.model.js";
import Order from "../../models/order.model.js";
import mongoose from "mongoose";
import moment from "moment";

export const getDashboardStats = async (req, res) => {
  try {
    // 1️⃣ Basic Counts
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const completedOrders = await Order.countDocuments({ status: "completed" });
    const pendingOrders = await Order.countDocuments({ status: "pending" });

    // 2️⃣ Total Revenue
    const totalRevenueAgg = await Order.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalRevenue = totalRevenueAgg[0]?.total || 0;

    // 3️⃣ Today's Orders
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const todaysOrders = await Order.countDocuments({
      createdAt: { $gte: todayStart, $lte: todayEnd },
    });

    // 4️⃣ Orders Overview (Status-based)
    const ordersOverview = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // 5️⃣ Revenue Breakdown (Month-wise)
    const revenueBreakdown = await Order.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalRevenue: { $sum: "$amount" },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    // 6️⃣ Weekly Orders Overview (Chart)
    const today = moment().endOf("day");
    const weekAgo = moment().subtract(6, "days").startOf("day");

    const weeklyOrders = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: weekAgo.toDate(), $lte: today.toDate() },
        },
      },
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" },
          count: { $sum: 1 },
        },
      },
    ]);

    const dayMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const orderMap = Object.fromEntries(
      weeklyOrders.map((o) => [dayMap[o._id - 1], o.count])
    );

    const weeklyOverview = [];
    for (let i = 6; i >= 0; i--) {
      const day = moment().subtract(i, "days");
      const label = day.format("ddd");
      weeklyOverview.push({
        day: label,
        count: orderMap[label] || 0,
      });
    }



    // 💳 Payment Method Revenue Breakdown
const paymentBreakdownAgg = await Order.aggregate([
  { $match: { status: "completed" } },
  {
    $group: {
      _id: "$paymentMethod",
      totalAmount: { $sum: "$amount" },
    },
  },
]);

// Total revenue বের করে percentage হিসাব করব
const totalRevenueAmount = paymentBreakdownAgg.reduce(
  (sum, p) => sum + p.totalAmount,
  0
);

const paymentBreakdown = paymentBreakdownAgg.map((p) => ({
  method: p._id,
  totalAmount: p.totalAmount,
  percentage: ((p.totalAmount / totalRevenueAmount) * 100).toFixed(2) + "%",
}));


    // ✅ Final Response
    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalOrders,
        totalRevenue,
        completedOrders,
        pendingOrders,
        todaysOrders,
        ordersOverview,
        revenueBreakdown,
        weeklyOverview,
        paymentBreakdown,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

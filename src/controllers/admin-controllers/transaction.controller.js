// src/controllers/transaction.controller.js
import Transaction from "../../models/transaction.model.js";

export const getRecentTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      data: transactions
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};




export const getTransactionById = async (req, res) => {
  try {
    const tx = await Transaction.findById(req.params.id)
      .populate("user", "name email");

    if (!tx) return res.status(404).json({ success: false, message: "Not found" });

    res.json({ success: true, data: tx });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};






export const updateTransactionStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const updated = await Transaction.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};


































// export const addTransaction = async (req, res) => {
//   try {
//     const transaction = await Transaction.create(req.body);
//     res.status(201).json({ success: true, data: transaction });
//   } catch (error) {
//     res.status(400).json({ success: false, message: error.message });
//   }
// };

// export const getRecentTransactions = async (req, res) => {
//   try {
//     const transactions = await Transaction.find().sort({ date: -1 });
//     res.status(200).json({ success: true, data: transactions });
//   } catch (error) {
//     res.status(400).json({ success: false, message: error.message });
//   }
// };

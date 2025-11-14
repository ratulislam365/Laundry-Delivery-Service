// src/controllers/transaction.controller.js
import Transaction from "../../models/transaction.model.js";

export const addTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.create(req.body);
    res.status(201).json({ success: true, data: transaction });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getRecentTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    res.status(200).json({ success: true, data: transactions });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

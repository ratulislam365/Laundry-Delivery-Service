import TransactionService from "../../services/transaction.service.js";

export const getRecentTransactions = async (req, res) => {
  try {
    const transactions = await TransactionService.getRecentTransactions();
    res.status(200).json({ success: true, data: transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

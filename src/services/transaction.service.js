import Transaction from "../models/admin.transaction.model.js";

class TransactionService {
  static async getRecentTransactions(limit = 10) {
    return await Transaction.find().sort({ createdAt: -1 }).limit(limit);
  }
}

export default TransactionService;

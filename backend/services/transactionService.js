const Transaction = require("../models/Transaction");

const createTransaction = async (data) => {
  return Transaction.create(data);
};

const getTransactions = async () => {
  return Transaction.find()
    .populate("customerId", "name email")
    .sort({ createdAt: -1 });
};

const getTransactionById = async (id) => {
  return Transaction.findById(id)
    .populate("customerId", "name email");
};

module.exports = {
  createTransaction,
  getTransactions,
  getTransactionById
};

const transactionService = require("../services/transactionService");
const { runFraudCheck } = require("../services/fraudEngine");

const createTransaction = async (req, res) => {
  const transaction = await transactionService.createTransaction(
    req.body
  );

  const fraudResult = await runFraudCheck(transaction);

  res.status(201).json({
    success: true,
    message: "Transaction created successfully",
    transaction,
    fraud: fraudResult
  });
};

const getTransactions = async (req, res) => {
  const transactions = await transactionService.getTransactions();

  res.status(200).json({
    success: true,
    count: transactions.length,
    transactions
  });
};

const getTransaction = async (req, res) => {
  const transaction =
    await transactionService.getTransactionById(req.params.id);

  if (!transaction) {
    return res.status(404).json({
      success: false,
      message: "Transaction not found"
    });
  }

  res.status(200).json({
    success: true,
    transaction
  });
};

module.exports = {
  createTransaction,
  getTransactions,
  getTransaction
};

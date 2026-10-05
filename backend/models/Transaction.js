const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true
    },

    amount: {
      type: Number,
      required: true,
      min: 0
    },

    merchantName: {
      type: String,
      required: true,
      trim: true
    },

    deviceId: {
      type: String,
      trim: true
    },

    ipAddress: {
      type: String,
      trim: true
    },

    location: {
      type: String,
      trim: true
    },

    description: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Transaction", transactionSchema);

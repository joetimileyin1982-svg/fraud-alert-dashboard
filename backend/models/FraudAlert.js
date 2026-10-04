const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

const fraudAlertSchema = new mongoose.Schema(
  {
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
      required: true
    },

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true
    },

    riskScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },

    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      required: true
    },

    status: {
      type: String,
      enum: [
        "open",
        "investigating",
        "resolved",
        "false_positive"
      ],
      default: "open"
    },

    reasons: [
      {
        ruleId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "FraudRule"
        },

        ruleName: String,

        points: Number,

        explanation: String
      }
    ],

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    notes: [noteSchema]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("FraudAlert", fraudAlertSchema);
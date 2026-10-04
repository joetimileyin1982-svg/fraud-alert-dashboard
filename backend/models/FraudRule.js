const mongoose = require("mongoose");

const fraudRuleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    type: {
      type: String,
      enum: [
        "large_transaction",
        "rapid_transactions",
        "new_device",
        "unusual_location",
        "unusual_time"
      ],
      required: true
    },

    threshold: {
      type: Number,
      default: 0
    },

    points: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("FraudRule", fraudRuleSchema);
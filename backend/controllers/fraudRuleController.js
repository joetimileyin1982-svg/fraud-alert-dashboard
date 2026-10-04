const FraudRule = require("../models/FraudRule");

const getRules = async (req, res) => {
  const rules = await FraudRule.find();

  res.json({
    success: true,
    count: rules.length,
    rules
  });
};

const getRule = async (req, res) => {
  const rule = await FraudRule.findById(req.params.id);

  if (!rule) {
    return res.status(404).json({
      success: false,
      message: "Fraud rule not found"
    });
  }

  res.json({
    success: true,
    rule
  });
};

const createRule = async (req, res) => {
  const rule = await FraudRule.create(req.body);

  res.status(201).json({
    success: true,
    message: "Fraud rule created successfully",
    rule
  });
};

const updateRule = async (req, res) => {
  const rule = await FraudRule.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  if (!rule) {
    return res.status(404).json({
      success: false,
      message: "Fraud rule not found"
    });
  }

  res.json({
    success: true,
    rule
  });
};

const updateRuleStatus = async (req, res) => {
  const { isActive } = req.body;

  const rule = await FraudRule.findByIdAndUpdate(
    req.params.id,
    { isActive },
    {
      new: true,
      runValidators: true
    }
  );

  if (!rule) {
    return res.status(404).json({
      success: false,
      message: "Fraud rule not found"
    });
  }

  res.json({
    success: true,
    rule
  });
};

const deleteRule = async (req, res) => {
  const rule = await FraudRule.findByIdAndDelete(
    req.params.id
  );

  if (!rule) {
    return res.status(404).json({
      success: false,
      message: "Fraud rule not found"
    });
  }

  res.json({
    success: true,
    message: "Fraud rule deleted successfully"
  });
};

module.exports = {
  getRules,
  getRule,
  createRule,
  updateRule,
  updateRuleStatus,
  deleteRule
};
const FraudAlert = require("../models/FraudAlert");

const getAlerts = async (req, res) => {
  const alerts = await FraudAlert.find()
    .populate("transactionId")
    .populate("customerId")
    .populate("assignedTo", "name email");

  res.json({
    success: true,
    count: alerts.length,
    alerts
  });
};

const getAlert = async (req, res) => {
  const alert = await FraudAlert.findById(req.params.id)
    .populate("transactionId")
    .populate("customerId")
    .populate("assignedTo", "name email");

  if (!alert) {
    return res.status(404).json({
      success: false,
      message: "Alert not found"
    });
  }

  res.json({
    success: true,
    alert
  });
};

const assignAlert = async (req, res) => {
  const { analystId } = req.body;

  const alert = await FraudAlert.findByIdAndUpdate(
    req.params.id,
    {
      assignedTo: analystId,
      status: "investigating"
    },
    {
      new: true
    }
  );

  if (!alert) {
    return res.status(404).json({
      success: false,
      message: "Alert not found"
    });
  }

  res.json({
    success: true,
    message: "Alert assigned successfully",
    alert
  });
};

const updateAlertStatus = async (req, res) => {
  const { status } = req.body;

  const allowedStatuses = [
    "open",
    "investigating",
    "resolved",
    "false_positive"
  ];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid alert status"
    });
  }

  const alert = await FraudAlert.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  if (!alert) {
    return res.status(404).json({
      success: false,
      message: "Alert not found"
    });
  }

  res.json({
    success: true,
    alert
  });
};

const addNote = async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({
      success: false,
      message: "Note text is required"
    });
  }

  const alert = await FraudAlert.findById(req.params.id);

  if (!alert) {
    return res.status(404).json({
      success: false,
      message: "Alert not found"
    });
  }

  alert.notes.push({
    text,
    createdBy: req.user.id
  });

  await alert.save();

  res.status(201).json({
    success: true,
    message: "Note added successfully",
    alert
  });
};

const getNotes = async (req, res) => {
  const alert = await FraudAlert.findById(req.params.id)
    .populate("notes.createdBy", "name email");

  if (!alert) {
    return res.status(404).json({
      success: false,
      message: "Alert not found"
    });
  }

  res.json({
    success: true,
    notes: alert.notes
  });
};

module.exports = {
  getAlerts,
  getAlert,
  assignAlert,
  updateAlertStatus,
  addNote,
  getNotes
};
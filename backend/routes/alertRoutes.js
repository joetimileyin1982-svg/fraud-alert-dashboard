const express = require("express");

const {
  getAlerts,
  getAlert,
  assignAlert,
  updateAlertStatus,
  addNote,
  getNotes
} = require("../controllers/alertController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getAlerts);

router.get("/:id", protect, getAlert);

router.patch("/:id/assign", protect, assignAlert);

router.patch("/:id/status", protect, updateAlertStatus);

router.post("/:id/notes", protect, addNote);

router.get("/:id/notes", protect, getNotes);

module.exports = router;
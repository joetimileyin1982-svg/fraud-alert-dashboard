const express = require('express');
const router = express.Router();

// @desc    Get dashboard summary statistics
// @route   GET /api/dashboard
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: "Fraud Alert Dashboard data fetched successfully",
    stats: {
      totalAlerts: 0,
      pendingReview: 0,
      highRiskCount: 0
    }
  });
});

module.exports = router;

const express = require("express");
const router = express.Router();
const qualityDashboardController = require("../controllers/qualityDashboardController");

// Create new dashboard
router.post("/", qualityDashboardController.createDashboard);

// Get dashboard by machineCode + date
router.get("/:machineCode/:date", qualityDashboardController.getDashboardByMachineAndDate);

// Update dashboard by machineCode + date
router.put("/:machineCode/:date", qualityDashboardController.updateDashboardByMachineAndDate);

module.exports = router;

const express = require("express");
const router = express.Router();
const fpaController = require("../controllers/fpaController");

// Create/extend sheet
router.post("/sheet", fpaController.createOrExtendSheet);

// Delete entire sheet
router.delete("/sheet/:machineCode", fpaController.deleteSheet);

// Delete specific step
router.delete("/sheet/:machineCode/step/:stepNumber", fpaController.deleteStep);

// Edit step
router.put("/sheet/:machineCode/step/:stepNumber", fpaController.editStep);

// Get full sheet
router.get("/sheet/:machineCode", fpaController.getSheet);

// Submit sheet data
router.post("/sheet/:machineCode/submit", fpaController.submitSheet);

// Export report
router.get("/report", fpaController.exportReport);

module.exports = router;

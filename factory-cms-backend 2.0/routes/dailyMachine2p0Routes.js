const express = require("express");
const router = express.Router();
const controller = require("../controllers/dailyMachine2p0Controller");

// Debug middleware
router.use((req, res, next) => {
  console.log("📥 [DailyMachine2p0 Route]");
  console.log("➡ Method:", req.method, "| URL:", req.originalUrl);
  next();
});

// Admin
router.post("/create", controller.createChecksheet);
router.put("/edit/:documentNumber", controller.editChecksheet);
router.get("/machine/:machineCode", controller.getAllByMachine);
router.get("/details/:machineCode", controller.getDetailsByMachine);
router.put("/edit-submission/:machineCode/:date", controller.editSubmission);
router.delete("/delete/:machineCode", controller.deleteByMachine);
router.get("/export/:machineCode", controller.exportSubmissions);

// Operator
router.post("/submit", controller.submitDailyCheck);

module.exports = router;

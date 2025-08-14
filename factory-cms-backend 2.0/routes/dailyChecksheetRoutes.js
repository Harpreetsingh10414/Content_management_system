const express = require("express");
const router = express.Router();
const controller = require("../controllers/dailyChecksheetController");

// Debug middleware to log all incoming requests to this router
router.use((req, res, next) => {
  console.log("📥 [DailyChecksheet Route Hit]");
  console.log("➡ Method:", req.method);
  console.log("➡ URL:", req.originalUrl);
  console.log("➡ Params:", req.params);
  console.log("➡ Query:", req.query);
  console.log("➡ Body:", req.body);
  next();
});

// Admin APIs
router.post("/create", controller.createChecksheet);
router.put("/edit/:documentNumber", controller.editChecksheetByDocNo);
router.put("/edit-status/:documentNumber/:date", controller.updateCheckStatus);

// Operator API
router.put("/submit", controller.submitChecksheet);

// Fetching
router.get("/machine/:machineCode", controller.getAllByMachine);
router.get("/details/:documentNumber/:date", controller.getSheetDetails);

// Delete a check
router.put("/delete-step/:documentNumber/:serialNo", controller.deleteStepFromChecksheet);

router.delete("/delete/:documentNumber", controller.deleteChecksheetByDocNumber);

router.get("/export/:documentNumber", controller.exportChecksheetToExcel);

router.get("/test", (req, res) => {
  console.log("✅ Daily Checksheet route reached");
  res.json({ message: "Daily Checksheet API is working" });
});


module.exports = router;

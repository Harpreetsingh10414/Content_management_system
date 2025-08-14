const express = require("express");
const router = express.Router();
const controller = require("../controllers/dailyPokeYokeController");

// CRUD
router.post("/create", controller.createChecksheet);
router.get("/:machineCode", controller.getChecksheetByMachine);
router.put("/edit/:machineCode", controller.editChecksheet);
router.delete("/delete/:machineCode", controller.deleteChecksheet);

// Submission handling
router.put("/submission", controller.editSubmissionForDate);

// Export
router.get("/export", controller.exportSubmissions);

module.exports = router;

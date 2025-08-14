const express = require("express");
const router = express.Router();
const controller = require("../controllers/dailyPokeYokeController");
const uploadPokeYoke = require("../middleware/uploadPokeYoke");

// CRUD
router.post("/create", controller.createChecksheet);
router.get("/:machineCode", controller.getChecksheetByMachine);
router.put("/edit/:machineCode", controller.editChecksheet);
router.delete("/delete/:machineCode", controller.deleteChecksheet);

// Submission handling
router.put("/submission", controller.editSubmissionForDate);

// Export
router.get("/export", controller.exportSubmissions);

// Create with image upload
router.post(
  "/create",
  uploadPokeYoke.array("photos"), // Multiple photos
  controller.createChecksheet
);

// Edit checksheet with image upload
router.put(
  "/edit/:machineCode",
  uploadPokeYoke.array("photos"),
  controller.editChecksheet
);

module.exports = router;

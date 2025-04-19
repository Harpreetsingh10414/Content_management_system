const express = require("express");
const router = express.Router();
const checksheetController = require("../controllers/checksheetController");
console.log("checksheetController:", checksheetController);
const upload = require("../middleware/upload");

// ✅ Static routes should be on top
router.get("/filter/monthly", checksheetController.getMonthlyChecksheets);
router.get("/export/excel", checksheetController.exportMonthlyExcel);

// ✅ Other Checksheet routes
router.post("/", checksheetController.createChecksheet);
router.get("/", checksheetController.getAllChecksheets);
router.post("/:checksheetId/checks", upload.single("checkMethod"), checksheetController.addCheckToChecksheet);
router.delete("/:checksheetId/checks/:checkId", checksheetController.deleteCheckFromChecksheet);
router.delete("/:id", checksheetController.deleteChecksheet);
router.get("/:checksheetId/checks", checksheetController.getChecksByChecksheetId);

// ✅ Always keep dynamic ID-based routes last
router.get("/:id", checksheetController.getChecksheetById);

module.exports = router;

const express = require("express");
const router = express.Router();
const checksheetController = require("../controllers/checksheetController");
const upload = require("../middlewares/upload"); // Multer middleware

// ✅ Create a new Checksheet
router.post("/", checksheetController.createChecksheet);

// ✅ Get all Checksheets
router.get("/", checksheetController.getAllChecksheets);

// ✅ Get a specific Checksheet
router.get("/:id", checksheetController.getChecksheetById);

// ✅ Add a new Check to an existing Checksheet (with file upload)
router.post("/:checksheetId/checks", upload.single("checkMethod"), checksheetController.addCheckToChecksheet);

// ✅ Delete a specific Check from a Checksheet
router.delete("/:checksheetId/checks/:checkId", checksheetController.deleteCheckFromChecksheet);

// ✅ Delete an entire Checksheet
router.delete("/:id", checksheetController.deleteChecksheet);

// ✅ Get all checks of a specific Checksheet
router.get("/:checksheetId/checks", checksheetController.getChecksByChecksheetId);

module.exports = router;

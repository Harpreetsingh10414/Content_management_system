const express = require("express");
const router = express.Router();
const controller = require("../controllers/dailyChecksheetController");

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
router.put('/delete-step/:documentNumber/:serialNo', controller.deleteStepFromChecksheet);

router.delete('/delete/:documentNumber', controller.deleteChecksheetByDocNumber);

router.get("/export/:documentNumber", controller.exportChecksheetToExcel);


module.exports = router;

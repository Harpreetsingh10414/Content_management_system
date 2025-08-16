const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/dailyMachine2p0Controller");

// existing routes...
router.post("/create", ctrl.createChecksheet);
router.put("/edit/:documentNumber", ctrl.editChecksheet);
router.get("/machine/:machineCode", ctrl.getAllByMachine);
router.get("/details/:machineCode", ctrl.getDetailsByMachine);
router.post("/submit", ctrl.submitDailyCheck);
router.put("/edit-submission/:machineCode/:date", ctrl.editSubmission);
router.delete("/delete/:machineCode", ctrl.deleteByMachine);
router.get("/export/:machineCode", ctrl.exportSubmissions);

// ✅ new: append multiple steps safely
router.post("/add-steps/:documentNumber", ctrl.addSteps);

module.exports = router;

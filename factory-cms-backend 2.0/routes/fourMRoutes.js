const express = require("express");
const router = express.Router();
const {
  addOrUpdateFourM,
  getFourMByMachine,
  deleteEntryBySno,
} = require("../controllers/fourMController");

// POST - Add or Update 4M data
router.post("/fourm/add", addOrUpdateFourM);

// GET - Get 4M data by machine code
router.get("/fourm/:machineCode", getFourMByMachine);

// DELETE - Delete entry by machine code and sno
router.delete("/fourm/:machineCode/:sno", deleteEntryBySno);

module.exports = router;

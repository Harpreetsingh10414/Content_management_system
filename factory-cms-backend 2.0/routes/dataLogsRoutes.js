const express = require("express");
const router = express.Router();
const { getDataByDate } = require("../controllers/dataLogsController");

// Example: GET /api/datalogs/Op20/28-02-2025
router.get("/:table/:date", getDataByDate);

module.exports = router;

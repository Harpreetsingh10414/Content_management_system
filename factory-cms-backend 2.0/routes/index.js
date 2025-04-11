const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Factory CMS Backend API is Running ✅");
});

module.exports = router;

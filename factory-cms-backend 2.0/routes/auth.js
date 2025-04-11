const express = require("express");
const router = express.Router();
const {
  login,
  signup,
  deleteMachine,
  updateMachine
} = require("../controllers/authController");

router.post("/login", login);
router.post("/signup", signup); // Only server should call this
router.delete("/delete/:deviceID", deleteMachine);
router.put("/update/:deviceID", updateMachine);

module.exports = router;

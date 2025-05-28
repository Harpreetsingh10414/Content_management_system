const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const controller = require("../controllers/drawings2p0Controller");

// Routes
router.post("/upload", upload.single("image"), controller.uploadDrawing);
router.get("/", controller.getAllDrawings);
router.delete("/name/:name", controller.deleteByName);
router.delete("/machine/:machineCode", controller.deleteByMachineCode);

module.exports = router;

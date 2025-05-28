const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const controller = require("../controllers/dosDonts2p0Controller");

router.post("/upload", upload.single("image"), controller.uploadDosDonts);
router.get("/", controller.getAllDosDonts);
router.delete("/delete-by-name/:name", controller.deleteByName);
router.delete("/delete-by-machine/:machineCode", controller.deleteByMachineCode);

module.exports = router;

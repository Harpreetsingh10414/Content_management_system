const express = require("express");
const router = express.Router();
const workInstructionsController = require("../controllers/workInstructionsController");

/**
 * @swagger
 * /products:
 *   post:
 *     description: Create a new product
 *     responses:
 *       201:
 *         description: Product created successfully
 */
router.post("/products", workInstructionsController.createProduct);

/**
 * @swagger
 * /products:
 *   get:
 *     description: Get all products
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/products", workInstructionsController.getProducts);

/**
 * @swagger
 * /steps:
 *   post:
 *     description: Create a new step with media file
 *     responses:
 *       201:
 *         description: Step created successfully
 */
router.post("/steps", workInstructionsController.createStep);

/**
 * @swagger
 * /steps/{productId}:
 *   get:
 *     description: Get steps by product ID
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/steps/:productId", workInstructionsController.getStepsByProduct);


/**
 * @swagger
 * /tools:
 *   get:
 *     description: Get all tools
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/tools", workInstructionsController.getTools);

router.post("/tools", workInstructionsController.createTool);

/**
 * @swagger
 * /parts:
 *   get:
 *     description: Get all parts
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/parts", workInstructionsController.getParts);

router.post("/parts", workInstructionsController.createPart);

module.exports = router;

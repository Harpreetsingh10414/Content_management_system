const express = require("express");
const router = express.Router();
const onePointLessonController = require("../controllers/onePointLessonController");

/**
 * @swagger
 * /one-point-lesson:
 *   post:
 *     description: Upload a new One Point Lesson with an image
 *     responses:
 *       201:
 *         description: One Point Lesson created successfully
 */
router.post("/", onePointLessonController.createOnePointLesson);

/**
 * @swagger
 * /one-point-lesson:
 *   get:
 *     description: Get all One Point Lessons
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/", onePointLessonController.getAllOnePointLessons);

/**
 * @swagger
 * /one-point-lesson/language/{language}:
 *   get:
 *     description: Get One Point Lessons by Language
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/language/:language", onePointLessonController.getLessonsByLanguage);

/**
 * @swagger
 * /one-point-lesson/{id}:
 *   put:
 *     description: Update One Point Lesson Approval Status
 *     responses:
 *       200:
 *         description: Success
 */
router.put("/:id", onePointLessonController.updateOnePointLesson);

/**
 * @swagger
 * /one-point-lesson/{id}:
 *   delete:
 *     description: Delete a One Point Lesson
 *     responses:
 *       200:
 *         description: Success
 */
router.delete("/:id", onePointLessonController.deleteOnePointLesson);

module.exports = router;

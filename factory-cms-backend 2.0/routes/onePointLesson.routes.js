const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const OnePointLesson = require('../models/onePointLesson.model');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '_' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// Upload lesson
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, description, language, createdBy, approvedBy, machineCode } = req.body;
    const imageUrl = `/uploads/${req.file.filename}`;

    const lesson = new OnePointLesson({
      title,
      description,
      language,
      imageUrl,
      createdBy,
      approvedBy,
      machineCode
    });
    await lesson.save();
    res.status(201).json(lesson);
  } catch (error) {
    res.status(500).json({ message: 'Error uploading lesson', error });
  }
});

// Get all lessons
router.get('/', async (req, res) => {
  try {
    const lessons = await OnePointLesson.find();
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lessons', error });
  }
});

// Get lessons by language and machineCode
router.get('/filter', async (req, res) => {
  try {
    const { language, machineCode } = req.query;
    const query = { language, machineCode };
    const lessons = await OnePointLesson.find(query);
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ message: 'Error filtering lessons', error });
  }
});

// Update approval status
router.put('/:id', async (req, res) => {
  try {
    const { approvalStatus, approvedBy } = req.body;
    const update = { approvalStatus };

    if (approvalStatus === 'Approved') {
      update.approvedBy = approvedBy;
      update.approvedAt = new Date();
    }

    const updatedLesson = await OnePointLesson.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(updatedLesson);
  } catch (error) {
    res.status(500).json({ message: 'Error updating lesson', error });
  }
});

// Delete lesson
router.delete('/:id', async (req, res) => {
  try {
    await OnePointLesson.findByIdAndDelete(req.params.id);
    res.json({ message: 'One Point Lesson deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting lesson', error });
  }
});

module.exports = router;
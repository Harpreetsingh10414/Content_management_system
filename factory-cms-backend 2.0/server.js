const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const pdfParse = require("pdf-parse");
const workInstructionRoutes = require("./routes/workInstructionRoutes");
const onePointLessonRoutes = require('./routes/onePointLesson.routes');
const documentRoutes = require("./routes/documentRoutes");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

// Use Auth Routes
app.use("/api/auth", require("./routes/auth"));

// Use Workinstructions Routes
app.use("/api/work-instructions", workInstructionRoutes);

// Use One Point Lesson Routes
app.use('/api/one-point-lesson', onePointLessonRoutes);

// Use Document Routes
app.use("/api/documents", documentRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

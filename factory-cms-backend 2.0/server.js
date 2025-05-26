const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const pdfParse = require("pdf-parse");
const workInstructionRoutes = require("./routes/workInstructionRoutes");
const onePointLessonRoutes = require('./routes/onePointLesson.routes');
const documentRoutes = require("./routes/documentRoutes");
const dosDontsRoutes = require("./routes/dosDontsRoutes");
const checksheetRoutes = require("./routes/checksheetRoutes");
const drawingRoutes = require("./routes/drawingRoutes");
const workInstruction2p0Routes = require("./routes/workInstruction2p0Routes");
const onePointLesson2p0Routes = require("./routes/onePointLesson2p0Routes");


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

// Use Dos and Don'ts Routes
app.use("/api/dos-donts", dosDontsRoutes);

// Use Checksheet Routes
app.use("/api/checksheets", checksheetRoutes);

// Use Drawing Routes
app.use("/api/drawings", drawingRoutes);

// Use Work Instruction 2.0 Routes
app.use("/api/workinstruction2p0", workInstruction2p0Routes);

// Use One Point Lesson 2.0 Routes
app.use("/api/onepointlesson2p0", onePointLesson2p0Routes);



// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

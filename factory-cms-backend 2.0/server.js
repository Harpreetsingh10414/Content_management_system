const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const pdfParse = require("pdf-parse");
const path = require("path");
const workInstructionRoutes = require("./routes/workInstructionRoutes");
const onePointLessonRoutes = require('./routes/onePointLesson.routes');
const documentRoutes = require("./routes/documentRoutes");
const dosDontsRoutes = require("./routes/dosDontsRoutes");
const checksheetRoutes = require("./routes/checksheetRoutes");
const drawingRoutes = require("./routes/drawingRoutes");
const workInstruction2p0Routes = require("./routes/workInstruction2p0Routes");
const onePointLesson2p0Routes = require("./routes/onePointLesson2p0Routes");
const documents2p0Routes = require("./routes/documents2p0Routes");
const dosDonts2p0Routes = require("./routes/dosDonts2p0Routes");
const drawings2p0Routes = require("./routes/drawings2p0Routes");
const skillMatrix2p0Routes = require("./routes/skillMatrix2p0Routes");
const trainingRoutes = require("./routes/trainingRoutes");
const dailyChecksheetRoutes = require("./routes/dailyChecksheetRoutes");
const dailyPokeYokeRoutes = require("./routes/dailyPokeYokeRoutes");
const dailyMachine2p0Routes = require("./routes/dailyMachine2p0Routes");

dotenv.config();

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  console.log("🌍 Incoming Request");
  console.log("➡ Method:", req.method);
  console.log("➡ URL:", req.originalUrl);
  console.log("➡ Headers:", req.headers);
  next();
});

console.log("In Server")
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

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

// Use Documents 2.0 Routes
app.use("/api/documents2p0", documents2p0Routes);

// Use Dos and Don'ts 2.0 Routes
app.use("/api/dosdonts2p0", dosDonts2p0Routes);

// Use Drawings 2.0 Routes
app.use("/api/drawings2p0", drawings2p0Routes);

// Use Skill Matrix 2.0 Routes
app.use("/api/skillmatrix2p0", skillMatrix2p0Routes);

// Use Training Routes
app.use("/api/training", trainingRoutes);

// Use Daily Checksheet Routes
app.use("/api/daily-checksheet", dailyChecksheetRoutes);

// Use Daily Poke Yoke Routes
app.use("/api/pokeyoke", dailyPokeYokeRoutes);

// Use Daily Machine 2.0 Routes
app.use("/api/dailymachine2p0", dailyMachine2p0Routes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

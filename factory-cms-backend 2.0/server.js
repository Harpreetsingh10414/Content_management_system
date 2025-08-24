const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

const workInstructionRoutes = require("./routes/workInstructionRoutes");
const onePointLessonRoutes = require("./routes/onePointLesson.routes");
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
const andonRoutes = require("./routes/andonRoutes");
const { startEscalationScheduler } = require("./controllers/andonController");
const andonController = require("./controllers/andonController"); 
const { createAndon } = require("./controllers/andonController");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use("/uploads", express.static("uploads"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Debug logger
app.use((req, res, next) => {
  console.log("🌍 Incoming Request");
  console.log("➡ Method:", req.method);
  console.log("➡ URL:", req.originalUrl);
  console.log("➡ Headers:", req.headers);
  next();
});

console.log("🚀 Server starting...");

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/work-instructions", workInstructionRoutes);
app.use("/api/one-point-lesson", onePointLessonRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/dos-donts", dosDontsRoutes);
app.use("/api/checksheets", checksheetRoutes);
app.use("/api/drawings", drawingRoutes);
app.use("/api/workinstruction2p0", workInstruction2p0Routes);
app.use("/api/onepointlesson2p0", onePointLesson2p0Routes);
app.use("/api/documents2p0", documents2p0Routes);
app.use("/api/dosdonts2p0", dosDonts2p0Routes);
app.use("/api/drawings2p0", drawings2p0Routes);
app.use("/api/skillmatrix2p0", skillMatrix2p0Routes);
app.use("/api/training", trainingRoutes);
app.use("/api/daily-checksheet", dailyChecksheetRoutes);
app.use("/api/pokeyoke", dailyPokeYokeRoutes);
app.use("/api/dailymachine2p0", dailyMachine2p0Routes);
app.use("/api/andon", andonRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

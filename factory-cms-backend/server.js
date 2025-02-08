const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require("path");
const multer = require("multer"); // Added Multer for file uploads

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const mongoURI =
  process.env.MONGO_URI ||
  "mongodb+srv://harpreetsinghdev21:aCyjlll3tDmCvMpu@cluster0.qsuuu.mongodb.net/cms?retryWrites=true&w=majority&appName=Cluster0";

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve uploaded files

// Multer Configuration for File Uploads (Centralized)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files in 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

// Connect to MongoDB
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Atlas Connected Successfully"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1); // Exit if MongoDB fails to connect
  });

// Import Work Instructions Routes
const workInstructionsRoutes = require("./routes/workInstructions");

// Use Work Instructions Routes
app.use("/api/work-instructions", workInstructionsRoutes);

// Swagger Documentation
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Content Management System API",
      version: "1.0.0",
      description: "API Documentation for the CMS Work Instructions",
    },
    servers: [{ url: `http://localhost:${PORT}` }],
  },
  apis: ["./routes/workInstructions.js"],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Root Endpoint
app.get("/", (req, res) =>
  res.send("✅ Content Management System Backend is Running...")
);

app.listen(PORT, () =>
  console.log(`🚀 Server is running on http://localhost:${PORT}`)
);

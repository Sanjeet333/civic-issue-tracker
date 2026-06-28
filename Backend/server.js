import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import issueRoutes from "./routes/issueRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

// UPDATED: CORS Configuration
app.use(cors({
  origin: ["https://civic-issue-tracker-u9i4.vercel.app"], // Aapka Vercel frontend URL
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use(express.json({ limit: '25mb' })); 
app.use(express.urlencoded({ limit: '25mb', extended: true }));

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected Successfully");
  } catch (err) {
    console.error("MongoDB Connection Error:", err.message);
    process.exit(1);
  }
};
connectDB();

app.use("/api/issues", issueRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
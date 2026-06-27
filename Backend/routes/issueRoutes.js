import express from "express";
import axios from "axios";
import { Issue } from "../models/Issue.js";
import Notification from "../models/notification.js"; 
import upload from "../middleware/upload.js"; 
import { uploadToCloudinary } from "../config/cloudinary.js"; 
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

async function analyzeIssue(title, description) {
  try {
    const API_KEY = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
    
    const response = await axios.post(url, {
      contents: [{
        parts: [{ text: `Analyze this civic issue: Title: "${title}". Description: "${description}". Return JSON only: {"urgencyScore": 5, "aiSummary": "provide a short summary", "category": "General"}` }]
      }]
    }, { headers: { "Content-Type": "application/json" } });

    const text = response.data.candidates[0].content.parts[0].text;
    const cleanText = text.replace(/```json\s?|```/g, "").trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("AI REST API Error:", error.response?.data?.error?.message || error.message);
    return { urgencyScore: 5, aiSummary: "Summary unavailable", category: "General" };
  }
}

router.post("/report", protect, upload.single("media"), async (req, res) => {
  try {
    const { title, description, location } = req.body;
    if (!title || !description) return res.status(400).json({ success: false, message: "Title and Description are required" });

    const parsedLocation = location ? JSON.parse(location) : { lat: 0, lng: 0 };
    let address = "Address not found";
    if (parsedLocation.lat !== 0 && parsedLocation.lng !== 0) {
      try {
        const response = await axios.get("https://nominatim.openstreetmap.org/reverse", {
          params: { format: "json", lat: parsedLocation.lat, lon: parsedLocation.lng },
          headers: { "User-Agent": "CommunityHeroApp/1.0" }
        });
        if (response.data?.display_name) address = response.data.display_name;
      } catch (e) { console.error("Geocoding API Failed:", e.message); }
    }

    let mediaUrl = "";
    let mediaType = "none";
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      mediaUrl = result.secure_url;
      mediaType = req.file.mimetype.startsWith("video/") ? "video" : "image";
    }

    const aiData = await analyzeIssue(title, description);

    const newIssue = new Issue({
      title, description,
      category: aiData.category,
      mediaUrl, mediaType,
      urgencyScore: aiData.urgencyScore,
      aiSummary: aiData.aiSummary,
      location: { lat: parsedLocation.lat, lng: parsedLocation.lng, address },
      status: "Pending",
      user: req.user.id
    });

    const savedIssue = await newIssue.save();
    res.status(201).json({ success: true, data: savedIssue });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error occurred" });
  }
});

router.get("/notifications", protect, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching notifications" });
  }
});

router.put("/notifications/mark-read", protect, async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user.id, isRead: false }, { isRead: true });
    res.status(200).json({ success: true, message: "Marked all as read" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating status" });
  }
});

router.get("/", async (req, res) => {
  try {
    const issues = await Issue.find({ isDeleted: { $ne: true } }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: issues });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching data" });
  }
});

router.put("/:id", protect, async (req, res) => {
  try {
    const { status } = req.body;
    const updatedIssue = await Issue.findByIdAndUpdate(req.params.id, { status }, { new: true });
    
    if (!updatedIssue) return res.status(404).json({ success: false, message: "Issue not found" });

    const newNotification = new Notification({
        userId: updatedIssue.user,
        message: `Your issue "${updatedIssue.title}" status is now updated to ${status}.`
    });
    await newNotification.save();

    res.status(200).json({ success: true, data: updatedIssue });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete("/delete/:id", protect, async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: "Issue not found" });

    if (issue.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Aap sirf apni reports delete kar sakte hain!" });
    }

    if (issue.status !== "Pending") {
      return res.status(400).json({ message: "Sirf 'Pending' reports delete ho sakti hain!" });
    }
    
    await Issue.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ success: true, message: "Report deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
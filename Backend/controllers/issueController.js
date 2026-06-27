import { Issue } from "../models/issue.js";
import { analyzeIssueWithAI } from "../services/aiService.js"; // Import your service

export const createIssue = async (req, res) => {
  try {
    const { title, description } = req.body;

    const aiResult = await analyzeIssueWithAI(title, description);

    const newIssueData = {
      user: req.user.id,
      title: title,
      description: description,
      category: aiResult.category,
      priority: aiResult.priority,
      mediaUrl: req.file ? req.file.path : "", 
      mediaType: req.file ? (req.file.mimetype.startsWith("video") ? "video" : "image") : "none"
    };

    const issue = await Issue.create(newIssueData);

    res.status(201).json({ success: true, data: issue });
  } catch (error) {
    console.error("Database Error:", error); 
    res.status(500).json({ success: false, message: error.message });
  }
};
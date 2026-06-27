import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_secret_key', { expiresIn: '30d' });
};

export const registerUser = async (req, res) => {
  const { username, email, password, role } = req.body;
  
  if (role === 'admin') {
    return res.status(403).json({ message: "Access Denied: You cannot register as admin!" });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ 
        username, email, password: hashedPassword, role: 'citizen' 
    });
    
    res.status(201).json({ _id: user._id, username: user.username, role: 'citizen', token: generateToken(user._id) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({ _id: user._id, username: user.username, role: user.role, token: generateToken(user._id) });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    let admin = await User.findOne({ email });
    if (!admin) {
        admin = await User.create({ username: "Admin", email, password: "...", role: "admin" });
    }
    res.json({ _id: admin._id, username: "Admin", role: "admin", token: generateToken(admin._id) });
  } else {
    res.status(401).json({ message: "Invalid Admin Credentials" });
  }
};
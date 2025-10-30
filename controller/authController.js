// Backend/controller/authController.js
import User from "../model/userModel.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import { genToken } from "../config/token.js";  

// SIGNUP (fixed name & logic)
export const Signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Enter a valid email" });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    // Check existing user
    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password and create user
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashPassword,
      role
    });

    // Generate token (genToken should be exported from config/token.js)
    // If genToken is synchronous (jwt.sign) you don't need await
    const token = genToken(user._id);

    // Set cookie on response (res.cookie, not req.cookie)
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // secure true only in prod with HTTPS
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
    });

    // Remove password before sending response
    const userObj = user.toObject ? user.toObject() : { ...user };
    delete userObj.password;

    return res.status(201).json({ user: userObj, token });
  } catch (error) {
    console.error("signup error:", error);
    return res.status(500).json({ message: `Signup error: ${error.message || error}` });
  }
};

// LOGIN (basic implementation)
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = genToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const userObj = user.toObject ? user.toObject() : { ...user };
    delete userObj.password;

    return res.status(200).json({ user: userObj, token });
  } catch (error) {
    console.error("login error:", error);
    return res.status(500).json({ message: `Login error: ${error.message || error}` });
  }
};

// LOGOUT (clear cookie)
export const logOut = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict"
    });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("logout error:", error);
    return res.status(500).json({ message: `Logout error: ${error.message || error}` });
  }
};

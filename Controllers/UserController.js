import User from "../Models/UserSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const signup = async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ Message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const user = await new User({
      ...req.body,
      password: hashPassword,
    }).save();

    const generateToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    const Token = generateToken;

    res.status(200).json({ Message: "Successfully registered", Token });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ Message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ Message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(400).json({ Message: "Invalid credentials" });
    }

    const Token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.status(200).json({ Message: "Successfully logged in", Token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ Message: "Internal Server Error" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const getuser = await User.find();
    res.status(200).json(getuser);
  } catch (error) {
    console.log("Error fetching User", error);
    res
      .status(500)
      .json({ message: "Error in Fetching User", error: error.Message });
  }
};

export const resetpassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    if (!email || !newPassword) {
      return res
        .status(400)
        .json({ message: "Email and newPassword are required" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Error resetting password:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

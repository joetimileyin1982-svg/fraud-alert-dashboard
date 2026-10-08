const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d"
    }
  );
};

// 1. STRENGTHEN REGISTRATION: Check BOTH details
const registerUser = async ({ name, email, password, phone }) => {
  // Check if email already exists
  const emailExists = await User.findOne({ email });
  if (emailExists) {
    throw new Error("Email address is already registered");
  }

  // Check if phone number already exists
  const phoneExists = await User.findOne({ phone });
  if (phoneExists) {
    throw new Error("Phone number is already registered");
  }

  // Basic structure verification
  if (!email.includes('@') || phone.length < 7) {
    throw new Error("Please provide a valid email structure and a complete phone number");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    phone
  });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role
  };
};

// 2. DUAL LOGIN: Allows logging in with Email OR Phone Number
const loginUser = async ({ loginIdentifier, password }) => {
  if (!loginIdentifier || !password) {
    throw new Error("Please provide your login credentials");
  }

  // Search database for a match on either the email field OR the phone field
  const user = await User.findOne({
    $or: [
      { email: loginIdentifier.toLowerCase().trim() },
      { phone: loginIdentifier.trim() }
    ]
  });

  if (!user) {
    throw new Error("Invalid credentials provided");
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    throw new Error("Invalid credentials provided");
  }

  const token = generateToken(user);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    }
  };
};

module.exports = {
  registerUser,
  loginUser
};

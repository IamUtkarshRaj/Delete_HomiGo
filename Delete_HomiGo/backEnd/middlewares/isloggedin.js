const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/user.models");

const isLoggedIn = async (req, res, next) => {
  try {
    let token;

    // Get token from cookies OR Authorization header
    if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    } else if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      console.log("❌ No token provided");
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - No token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // console.log("✅ Decoded token:", decoded);

    // Fetch user by ObjectId
    const user = await User.findById(decoded._id).select("-password -refreshToken");

    // console.log("🔍 User found in DB:", user);

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - User not found" });
    }

    // Attach user to req
    req.user = user;

    // console.log("✅ req.user set:", req.user);
    next();
  } catch (error) {
    console.error("❌ Middleware error:", error.message);
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized - Invalid/Expired token" });
  }
};

module.exports = { isLoggedIn };

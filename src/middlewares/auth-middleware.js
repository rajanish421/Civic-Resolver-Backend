const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = (req, res, next) => {
    console.log(req.cookies);
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ message: "Not authorized, no token" });

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded; // attach user info to request
    next();
  } catch {
    return res.status(401).json({ message: "Not authorized, invalid or expired token" });
  }
};

module.exports = authMiddleware;
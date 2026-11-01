const jwt = require("jsonwebtoken");

function readToken(req) {
  const header = req.headers.authorization || "";
  return header.startsWith("Bearer ") ? header.slice(7) : null;
}

// Edaina valid login unte chalu (customer leda admin)
function loggedIn(req, res, next) {
  const token = readToken(req);
  if (!token) return res.status(401).json({ message: "Login required" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}

// Admin matrame
function adminOnly(req, res, next) {
  const token = readToken(req);
  if (!token) return res.status(401).json({ message: "Login required" });
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    if (!data.isAdmin) return res.status(403).json({ message: "Admin only" });
    req.user = data;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = adminOnly;
module.exports.loggedIn = loggedIn;
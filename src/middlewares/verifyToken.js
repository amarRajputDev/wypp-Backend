import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
    // console.log("Cookies received:", req.cookies);
  // Get token from request headers
  const token = req.cookies?.token


  if (!token) {
    return res.status(401).json({ success: false, message: "Access Denied! No token provided." });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user data to request object
    req.user = decoded;
    next(); // Proceed to the next middleware
  } catch (error) {
    return res.status(403).json({ success: false, message: "Invalid or expired token." });
  }
};

export default verifyToken;

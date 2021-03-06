const jwt = require("jsonwebtoken");
const JWT_KEY = "dracaris";

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, JWT_KEY);
    req.decodedJWT = decoded;
    next();
  } catch (error) {
    console.log("error in checking auth token");
    return res.status(413).json({ message: "Auth failed", status: 413 });
  }
};

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
    // res.redirect("http://localhost:3000")
    //res.status(403).redirect("http://localhost:3000");
    // res.writeHead(302, {
    //   Location: "http://localhost:3000",
    // });
    // res.end();
    return res.status(413).json({ message: "Auth failed", status: 413 });
  }
};

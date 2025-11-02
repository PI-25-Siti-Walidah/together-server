const jwt = require("jsonwebtoken");

module.exports = {
  verifyToken: (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Token tidak tersedia atau tidak valid" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = {
        _id: decoded.id,
        username: decoded.username,
        role: decoded.role || "user",
      };
      next();
    } catch (error) {
      return res
        .status(403)
        .json({ message: "Token tidak valid atau sudah kedaluwarsa" });
    }
  },
};

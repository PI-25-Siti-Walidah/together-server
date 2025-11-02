const jwt = require("jsonwebtoken");

module.exports = {
  generateToken: (user) => {
    return jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7h" }
    );
  },
};

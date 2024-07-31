const User = require("../models/User");
const jsonwebtoken = require("jsonwebtoken");

const { UnauthenticatedError } = require("../errors");

const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthenticatedError("Authentication invalid");
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jsonwebtoken.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ _id: payload.userId }).select("-password");

    req.user = { userName: user.name, userId: user._id };
    next();
  } catch {
    throw new UnauthenticatedError("Authentication invalid");
  }
};

module.exports = auth;

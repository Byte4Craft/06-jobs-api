const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");
require("dotenv").config();

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    match: [/^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
  },
});

UserSchema.pre("save", async function () { 
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function () {
  return jsonwebtoken.sign({ userId: this._id, userName: this.name }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

UserSchema.methods.checkPassword = async function (password) { 
  console.log(password, this.password);
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
}

module.exports = mongoose.model("User", UserSchema);

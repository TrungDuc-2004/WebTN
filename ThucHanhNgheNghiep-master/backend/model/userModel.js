const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserScheme = new Schema({
  name: String,
  email: String,
  password: String,
  school: String,
  image: String,
  role: String,
});

module.exports = mongoose.model("Users", UserScheme);

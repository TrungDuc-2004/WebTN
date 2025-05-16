const mongoose = require("mongoose");

const ResultSchema = new mongoose.Schema({
  name: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  examId: { type: mongoose.Schema.Types.ObjectId, ref: "Exam" },
  score: Number,
  timeSpent: Number,
});

module.exports = mongoose.model("Result", ResultSchema);

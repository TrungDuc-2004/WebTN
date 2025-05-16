const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  examId: { type: mongoose.Schema.Types.ObjectId, ref: "Exam" },
  content: String,
  options: [String],
  correctAnswer: String,
  score: Number,
});

module.exports = mongoose.model("Question", QuestionSchema);

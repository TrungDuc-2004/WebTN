const mongoose = require("mongoose");

const ExamSchema = new mongoose.Schema({
  title: String,
  code: String,
  duration: Number,
  startTime: Date,
  endTime: Date,
  createdAt: { type: Date, default: Date.now },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
  results: [{ type: mongoose.Schema.Types.ObjectId, ref: "Result" }],
  studentsCompleted: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
});

module.exports = mongoose.model("Exam", ExamSchema);

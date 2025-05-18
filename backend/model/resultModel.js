const mongoose = require("mongoose");

const ResultSchema = new mongoose.Schema({
  name: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  examId: { type: mongoose.Schema.Types.ObjectId, ref: "Exam" },
  score: Number,
  timeSpent: Number,
  createdAt: { type: Date, default: Date.now },
  answers: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
      selectedOption: String,  
      isCorrect: Boolean,
    }
  ],
});


module.exports = mongoose.model("Result", ResultSchema);

const Exam = require("../model/examModel.js");
const Question = require("../model/questionModel.js");
const Result = require("../model/resultModel.js"); 
const User = require("../model/userModel.js"); 
const mongoose = require("mongoose");

exports.getResultsByUserId = async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "userId không hợp lệ" });
    }

    const results = await Result.find({ userId })
      .populate({
        path: "examId",
        select: "title code questions", // Lấy thông tin cần thiết
        populate: { path: "questions", select: "score" }, 
      })
      .sort({ createdAt: -1 }); // Mới nhất lên đầu

    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Lấy chi tiết bài làm (Result) theo resultId (submissionId)
exports.getResultById = async (req, res) => {
  try {
    const resultId = req.params.resultId;

    if (!mongoose.Types.ObjectId.isValid(resultId)) {
      return res.status(400).json({ message: "resultId không hợp lệ" });
    }

    const result = await Result.findById(resultId)
      .populate({
        path: "examId",
        select: "title code questions",
        populate: { path: "questions" }
      });

    if (!result) {
      return res.status(404).json({ message: "Không tìm thấy bài làm." });
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Lỗi trong getResultById:", err);
    res.status(500).json({ message: err.message });
  }
};

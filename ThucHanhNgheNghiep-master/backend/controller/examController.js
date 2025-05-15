const Exam = require("../model/examModel.js");
const Question = require("../model/questionModel.js");
const Result = require("../model/resultModel.js"); 
const User = require("../model/userModel.js"); 
const mongoose = require("mongoose");

exports.createExam = async (req, res) => {
  try {
    const { title, startTime, endTime, duration, teacherId } = req.body;
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();

    const newExam = new Exam({
      title,
      code,
      startTime,
      endTime,
      duration,
      teacherId,
    });
    await newExam.save();

    res.status(201).json(newExam); 
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.submitExamResults = async (req, res) => {
  try {
    const { userId, examId, score, timeSpent } = req.body;

    const user = await User.findById(userId);

    const newResult = new Result({
      name: user.name, 
      userId, 
      examId,
      score,
      timeSpent,
    });

    await newResult.save();

    const exam = await Exam.findById(examId);
    exam.results.push(newResult._id);
    exam.studentsCompleted.push(userId); 

    await exam.save();

    res.status(201).json({ message: "Kết quả bài kiểm tra đã được lưu." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getExamByCode = async (req, res) => {
  try {
    const userId = req.query.userId;
    const exam = await Exam.findOne({ code: req.params.code }).populate(
      "questions"
    );
    if (!exam) {
      return res.status(404).json({ message: "Không tìm thấy bài kiểm tra." });
    }

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "userId không hợp lệ" });
    }

    const objectUserId = new mongoose.Types.ObjectId(userId);

    const isCompleted = exam.studentsCompleted.some((id) =>
      id.equals(objectUserId)
    );

    res.status(200).json({ exam, isCompleted });
  } catch (err) {
    console.error("Lỗi trong getExamByCode:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.addQuestionToExam = async (req, res) => {
  try {
    const { examId } = req.params;
    const { content, options, correctAnswer, score } = req.body;

    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    const question = new Question({
      examId,
      content,
      options,
      correctAnswer,
      score,
    });
    await question.save();

    exam.questions.push(question._id);
    await exam.save();

    res.status(201).json(question);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.examId)
      .populate("questions")
      .populate("results");
    res.status(200).json(exam);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllExams = async (req, res) => {
  try {
    const teacherId = req.query.teacherId;

    if (!teacherId) {
      return res.status(400).json({ message: "teacherId is required" });
    }

    const exams = await Exam.find({ teacherId }); 
    res.status(200).json(exams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteExam = async (req, res) => {
  try {
    const { examId } = req.params;
    await Exam.findByIdAndDelete(examId); 
    await Question.deleteMany({ examId }); 

    res.status(200).json({ message: "Xóa bài kiểm tra thành công." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

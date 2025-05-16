const express = require("express");
const {
  createExam,
  addQuestionToExam,
  getExamById,
  getAllExams,
  deleteExam,
  getExamByCode,
  submitExamResults,
} = require("../controller/examController");

const router = express.Router();
router.post("/exam", createExam);
router.post("/exam/:examId/question", addQuestionToExam);
router.get("/exam/:examId", getExamById);
router.get("/exam", getAllExams);
router.delete("/exam/:examId", deleteExam);
router.get("/exam/code/:code", getExamByCode);
router.post("/exam/:examId/results", submitExamResults);

module.exports = router;

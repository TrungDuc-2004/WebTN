import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "./CreateTestScreen.css";
import NavbarGV from "./NavbarGV";
import FooterGV from "./FooterGV";

const CreateTestScreen = () => {
  const [title, setTitle] = useState("");
  const [totalTime, setTotalTime] = useState(1);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [questions, setQuestions] = useState([
    {
      content: "",
      options: ["", "", "", ""],
      correctAnswer: "A",
      score: 1,
    },
  ]);
  const navigate = useNavigate();
  const { state } = useLocation();
  const teacherId = state?.teacherId;

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        content: "",
        options: ["", "", "", ""],
        correctAnswer: "A",
        score: 1,
      },
    ]);
    toast.success("Đã thêm câu hỏi mới", {
      position: "top-center",
      autoClose: 1500,
    });
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    if (field === "content") updated[index].content = value;
    else if (field === "score") updated[index].score = parseInt(value);
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  const handleCorrectChange = (qIndex, value) => {
    const updated = [...questions];
    updated[qIndex].correctAnswer = value;
    setQuestions(updated);
  };

  const handleCreateTest = async () => {
    if (!title.trim()) {
      toast.error("Vui lòng nhập tên bài kiểm tra", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }
    if (!startTime || !endTime) {
      toast.error("Vui lòng nhập thời gian bắt đầu và kết thúc", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/api/exam", {
        title,
        duration: totalTime,
        startTime,
        endTime,
        teacherId,
      });

      const examId = res.data._id;

      const progressToast = toast.loading("Đang tạo bài kiểm tra...", {
        position: "top-center",
      });

      for (const [index, q] of questions.entries()) {
        try {
          await axios.post(
            `http://localhost:3000/api/exam/${examId}/question`,
            {
              content: q.content,
              options: q.options,
              correctAnswer: q.correctAnswer,
              score: q.score,
            }
          );

          toast.update(progressToast, {
            render: `Đang tạo câu hỏi ${index + 1}/${questions.length}`,
            type: "default",
            isLoading: true,
          });
        } catch (err) {
          console.error(`Lỗi khi tạo câu hỏi ${index + 1}:`, err);
          throw err;
        }
      }

      toast.update(progressToast, {
        render: "Tạo bài kiểm tra thành công!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      setTimeout(() => navigate("/exams", { state: { teacherId } }), 2000);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Tạo bài kiểm tra thất bại", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  const totalScore = questions.reduce((sum, q) => sum + q.score, 0);

  return (
    <>
      <NavbarGV />
      <div className="create-test-container">
        <div className="test-info">
          <input
            className="test-name"
            placeholder="Nhập tên bài KT"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="test-stats">
            <div className="total-score">Tổng số điểm: {totalScore}</div>
            <div className="time-setting">
              <label>
                Thời gian (phút):
                <input
                  type="number"
                  min="1"
                  value={totalTime}
                  onChange={(e) => setTotalTime(parseInt(e.target.value))}
                />
              </label>
            </div>
            <div className="time-setting">
              <label>
                Thời gian bắt đầu:
                <input
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </label>
            </div>
            <div className="time-setting">
              <label>
                Thời gian kết thúc:
                <input
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </label>
            </div>
          </div>
        </div>

        {questions.map((q, index) => (
          <div key={index} className="question-card">
            <div className="question-title">Câu {index + 1}</div>
            <input
              className="question-input"
              placeholder="Nhập câu hỏi"
              value={q.content}
              onChange={(e) =>
                handleQuestionChange(index, "content", e.target.value)
              }
            />
            <div className="answers-group">
              {["A", "B", "C", "D"].map((opt, i) => (
                <label key={opt} className="answer-option">
                  <input
                    type="radio"
                    name={`correct-${index}`}
                    checked={q.correctAnswer === opt}
                    onChange={() => handleCorrectChange(index, opt)}
                  />
                  <span className="label">{opt}</span>
                  <input
                    className="answer-input"
                    placeholder="Nhập đáp án"
                    value={q.options[i]}
                    onChange={(e) =>
                      handleOptionChange(index, i, e.target.value)
                    }
                  />
                </label>
              ))}
            </div>

            <div className="score-time">
              <label>
                Điểm
                <select
                  value={q.score}
                  onChange={(e) =>
                    handleQuestionChange(index, "score", e.target.value)
                  }
                >
                  {[1, 2, 3, 4, 5].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        ))}

        <div className="actions">
          <button className="btn add-btn" onClick={handleAddQuestion}>
            Thêm câu hỏi
          </button>
          <button className="btn create-btn" onClick={handleCreateTest}>
            Tạo bài KT
          </button>
        </div>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <FooterGV />
    </>
  );
};

export default CreateTestScreen;

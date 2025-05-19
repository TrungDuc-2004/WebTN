import React, { useEffect, useState } from "react";
import { useParams, NavLink, useLocation } from "react-router-dom";
import axios from "axios";
import "./ReviewTestScreen.css";
import NavbarGV from "./NavbarGV";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";

const ReviewTestScreen = () => {
  const { examId } = useParams();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const teacherId = location.state?.teacherId;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/exam/${examId}`);
        setExam(res.data);
      } catch (err) {
        console.error("Lỗi khi tải bài kiểm tra:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [examId]);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Đang tải bài kiểm tra...</p>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="error-screen">
        <div className="error-icon">!</div>
        <h3>Không thể tải bài kiểm tra</h3>
        <p>Vui lòng thử lại sau</p>
      </div>
    );
  }

  return (
    <>
      <NavbarGV />
      <div className="review-container">
        <div className="test-header-container">
          <div className="test-header">
            <h1 className="test-title">{exam.title}</h1>
            <div className="test-meta-container">
              <div className="test-meta">
                <span className="meta-icon">📅</span>
                <span>
                  {new Date(exam.createdAt).toLocaleDateString("vi-VN")}
                </span>
              </div>
              <div className="test-meta">
                <span className="meta-icon">🚦</span>
                <span>
                  Bắt đầu:{" "}
                  {exam.startTime
                    ? new Date(exam.startTime).toLocaleString("vi-VN")
                    : "Chưa có"}
                </span>
              </div>
              <div className="test-meta">
                <span className="meta-icon">🏁</span>
                <span>
                  Kết thúc:{" "}
                  {exam.endTime
                    ? new Date(exam.endTime).toLocaleString("vi-VN")
                    : "Chưa có"}
                </span>
              </div>
              <div className="test-meta">
                <span className="meta-icon">⏱️</span>
                <span>{exam.duration} phút</span>
              </div>
              <div className="test-meta highlight">
                <span className="meta-icon">⭐</span>
                <span>
                  Tổng điểm:{" "}
                  {exam.questions.reduce((sum, q) => sum + q.score, 0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="tab-container">
          <div className="tab-nav">
            <NavLink
              to={`/review-test/${examId}`}
              state={{ teacherId }}
              className={({ isActive }) =>
                `tab-item ${isActive ? "active" : ""}`
              }
            >
              <span className="tab-icon">📝</span>
              <span className="tab-text">Câu hỏi</span>
            </NavLink>
            <NavLink
              to={`/resulttest/${examId}`}
              state={{ teacherId }}
              className={({ isActive }) =>
                `tab-item ${isActive ? "active" : ""}`
              }
            >
              <span className="tab-icon">📊</span>
              <span className="tab-text">Kết quả</span>
            </NavLink>
          </div>
        </div>

        <div className="questions-container">
          {exam.questions.map((q, index) => (
            <div key={q._id} className="question-card">
              <div className="question-header">
                <div className="question-number">Câu {index + 1}</div>
                <div className="question-score">{q.score} điểm</div>
              </div>

              <div className="question-content">{q.content}</div>

              <div className="answers-container">
                {q.options.map((option, i) => (
                  <div
                    key={`${q._id}-${i}`}
                    className={`answer-option ${
                      q.correctAnswer === String.fromCharCode(65 + i)
                        ? "correct"
                        : ""
                    }`}
                  >
                    <div className="answer-radio">
                      <div className="radio-circle">
                        {q.correctAnswer === String.fromCharCode(65 + i) && (
                          <div className="radio-dot"></div>
                        )}
                      </div>
                      <span className="answer-letter">
                        {String.fromCharCode(65 + i)}
                      </span>
                    </div>
                    <div className="answer-text">{option}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button
          className="back-button"
          onClick={() =>
            navigate("/teacher-dashboard", { state: { teacherId } })
          }
        >
          ← Quay lại màn hình chính
        </button>
      </div>
      <Footer />
    </>
  );
};

export default ReviewTestScreen;

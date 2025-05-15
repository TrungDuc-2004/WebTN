import React, { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import axios from "axios";
import "./ReviewTestScreen.css";
import NavbarGV from "./NavbarGV";
import FooterGV from "./FooterGV";

const ReviewTestScreen = () => {
  const { examId } = useParams();
  const [exam, setExam] = useState(null);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/exam/${examId}`);
        setExam(res.data);
      } catch (err) {
        console.error("Lỗi khi tải bài kiểm tra:", err);
      }
    };

    fetchExam();
  }, [examId]);

  if (!exam) return <div>Đang tải...</div>;

  return (
    <>
      <NavbarGV />
      <div className="review-container">
        <div className="test-header">
          <div>
            <strong>{exam.title}</strong>{" "}
            <span className="dim-text">
              ({new Date(exam.createdAt).toLocaleDateString("en-GB")})
            </span>
          </div>
          <div className="test-meta">
            Tổng số điểm: {exam.questions.reduce((sum, q) => sum + q.score, 0)}{" "}
            &nbsp; Thời gian: {exam.duration} phút
          </div>
        </div>

        <div className="tab-nav">
          <NavLink
            to={`/review-test/${examId}`}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Câu hỏi
          </NavLink>
          <NavLink
            to={`/resulttest/${examId}`}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Điểm
          </NavLink>
        </div>

        {exam.questions.map((q, index) => (
          <div key={q._id} className="question-card">
            <div className="question-title">Câu {index + 1}</div>
            <input className="question-input" value={q.content} readOnly />

            <div className="answers-group">
              {["A", "B", "C", "D"].map((opt, i) => (
                <label key={opt} className="answer-option">
                  <input
                    type="radio"
                    checked={q.correctAnswer === opt}
                    readOnly
                  />
                  <span className="label">{opt}</span>
                  <input
                    className="answer-input"
                    value={q.options[i]}
                    readOnly
                  />
                </label>
              ))}
            </div>

            <div className="score-time">
              <label>
                Điểm
                <input type="text" value={q.score} readOnly />
              </label>
            </div>
          </div>
        ))}
      </div>
      <FooterGV />
    </>
  );
};

export default ReviewTestScreen;

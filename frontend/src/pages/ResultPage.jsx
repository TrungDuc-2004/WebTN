import React from "react";
import "./ResultPage.css";
import Navbar2 from "./Navbar2";
import Footer from "./Footer";
import { useLocation, useNavigate } from "react-router-dom";
import { FaTrophy, FaClock, FaChartBar, FaHome } from "react-icons/fa";
import confetti from "canvas-confetti";

const ResultPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const score = state?.score || 0;
  const total = state?.total || 0;
  const percentage = Math.round((score / total) * 100);
  const elapsedTime = state?.elapsedTime || 0;

  // Hiệu ứng confetti khi load trang
  React.useEffect(() => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes > 0 ? `${minutes} phút ` : ''}${seconds} giây`;
  };

  // Xác định loại kết quả dựa trên phần trăm
  const getResultType = () => {
    if (percentage >= 90) return "excellent";
    if (percentage >= 70) return "good";
    if (percentage >= 50) return "average";
    return "poor";
  };

  const resultType = getResultType();
  const resultMessages = {
    excellent: "Xuất sắc! Bạn đã làm rất tốt!",
    good: "Tốt! Bạn đã hoàn thành tốt bài kiểm tra!",
    average: "Khá! Bạn có thể làm tốt hơn nữa!",
    poor: "Cố gắng hơn nữa nhé! Bạn sẽ làm tốt hơn!"
  };

  return (
    <>
      <Navbar2 />
      <div className={`result-page ${resultType}`}>
        <div className="result-container">
          <div className="result-card">
            <div className="result-header">
              <h1 className="test-title">{state?.title || "Bài kiểm tra"}</h1>
              <p className="test-code">Mã bài kiểm tra: <span>{state?.code || "N/A"}</span></p>
            </div>

            <div className="result-body">
              <div className="congrats-message">
                <FaTrophy className="trophy-icon" />
                <h2>{resultMessages[resultType]}</h2>
              </div>

              <div className="score-circle">
                <div className="circle-progress">
                  <svg className="progress-ring" viewBox="0 0 100 100">
                    <circle className="progress-ring-circle-bg" cx="50" cy="50" r="45" />
                    <circle 
                      className="progress-ring-circle" 
                      cx="50" cy="50" r="45" 
                      style={{
                        strokeDasharray: `${percentage * 2.83}, 283`
                      }} 
                    />
                  </svg>
                  <div className="score-percentage">
                    {percentage}%
                  </div>
                </div>
              </div>

              <div className="result-details">
                <div className="detail-item">
                  <div className="detail-icon">
                    <FaChartBar />
                  </div>
                  <div className="detail-text">
                    <span>Điểm số</span>
                    <strong>{score}/{total}</strong>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <FaClock />
                  </div>
                  <div className="detail-text">
                    <span>Thời gian</span>
                    <strong>{formatTime(elapsedTime)}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="result-footer">
              <button 
                className="home-btn"
                onClick={() => navigate("/student-dashboard")}
              >
                <FaHome className="btn-icon" />
                Về trang chủ
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ResultPage;
import React from "react";
import "./ResultPage.css";
import Navbar2 from "./Navbar2";
import Footer from "./Footer";
import { useLocation, useNavigate } from "react-router-dom";
import bgImage from "../assets/bg3.png";

const ResultPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const score = state?.score || 0;
  const total = state?.total || 0;
  const elapsedTime = state?.elapsedTime || 0;

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes} phút ${seconds} giây`;
  };

  return (
    <>
      <Navbar2 />
      <div className="result-page">
        <img src={bgImage} alt="background" className="background-image" />
        <div className="result-content">
          <h2 className="sub-title">Bài kiểm tra: {state.title}</h2>
          <p className="test-code">
            Mã bài kiểm tra: <strong> {state.code} </strong>
          </p>
          <div className="congrats">
            {"Chúc mừng bạn đã hoàn thành\nbài kiểm tra!"
              .split("\n")
              .map((item, index) => (
                <span key={index}>
                  {item}
                  <br />
                </span>
              ))}
          </div>

          <div className="score-box">
            <p>
              Điểm của bạn:{" "}
              <strong>
                {score}/{total}
              </strong>
            </p>
            <p>
              Tỷ lệ đúng: <strong>{((score / total) * 100).toFixed(1)}%</strong>
            </p>
            <p>
              Thời gian hoàn thành: <strong>{formatTime(elapsedTime)}</strong>
            </p>
            <button
              className="restart-btn"
              onClick={() => navigate("/student-dashboard")}
            >
              Thoát
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ResultPage;

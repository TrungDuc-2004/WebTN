import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./StartPage.css";
import bgImage from "../assets/bg2.png";
import Navbar2 from "./Navbar2";
import Footer from "./Footer";

function StartPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const exam = state?.exam;
  const userId = state?.userId;

  const handleStartQuiz = () => {
    if (!exam) {
      toast.error("Không có thông tin bài kiểm tra", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }
    toast.info("Đang bắt đầu bài kiểm tra...", {
      position: "top-center",
      autoClose: 1000,
      onClose: () => navigate("/quiz", { state: { exam, userId } }),
    });
  };

  if (!exam) {
    return (
      <>
        <Navbar2 />
        <div className="homepage">
          <h2>Không tìm thấy bài kiểm tra.</h2>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar2 />
      <div className="homepage">
        <img src={bgImage} alt="background" className="background-image" />
        <div className="start-container">
          <h2 className="quiz-title">{exam.title}</h2>
          <p className="quiz-code">
            Mã bài kiểm tra: <strong>#{exam.code}</strong>
          </p>
          <button className="start-btn" onClick={handleStartQuiz}>
            Bắt đầu
          </button>
          <div className="timer">🕒 {exam.duration}phút</div>
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
      <Footer />
    </>
  );
}

export default StartPage;
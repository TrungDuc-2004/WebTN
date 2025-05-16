import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./JoinPage.css";
import Navbar2 from "./Navbar2";
import bgImage from "../assets/bg1.png";
import Footer from "./Footer";
import axios from "axios";

function JoinPage() {
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user ? user._id : null;

  const handleJoin = async () => {
    if (!code.trim()) {
      toast.error("Vui lòng nhập mã bài kiểm tra", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    try {
      console.log(userId);
      const res = await axios.get(
        `http://localhost:3000/api/exam/code/${code}?userId=${userId}`
      );
      const { exam, isCompleted } = res.data;
      const currentTime = new Date().getTime();
      const startTime = new Date(exam.startTime).getTime();
      const endTime = new Date(exam.endTime).getTime();
      const duration = exam.duration;

      const remainingTime = (endTime - currentTime + 59000) / 60000 ;

      console.log(remainingTime, duration);

      if (currentTime < startTime) {
        toast.error("Bài kiểm tra chưa mở, bạn không thể tham gia.", {
          position: "top-center",
          autoClose: 2000,
        });
        return;
      }

      if (currentTime > endTime || remainingTime < duration) {
        toast.error("Bài kiểm tra đã đóng, bạn không thể tham gia.", {
          position: "top-center",
          autoClose: 2000,
        });
        return;
      }

      if (isCompleted) {
        toast.error(
          "Bạn đã hoàn thành bài kiểm tra này và không thể tham gia lại.",
          {
            position: "top-center",
            autoClose: 2000,
          }
        );
        return;
      }

      toast.success("Đang chuyển hướng đến bài kiểm tra...", {
        position: "top-center",
        autoClose: 1000,
        onClose: () => navigate("/start-page", { state: { exam, userId } }),
      });
    } catch (err) {
      console.error(err);
      toast.error("Không tìm thấy bài kiểm tra với mã đã nhập.", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  return (
    <>
      <Navbar2 />
      <div className="homepage">
        <img src={bgImage} alt="background" className="background-image" />
        <div className="join-container">
          <h2 className="title">Nhập mã</h2>
          <div className="input-group1">
            <input
              className="code-input"
              type="text"
              placeholder="Nhập mã..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <button className="join-btn" onClick={handleJoin}>
              Tham gia
            </button>
          </div>
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

export default JoinPage;

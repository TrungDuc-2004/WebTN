import React from "react";
import "./HomePage.css";
import Navbar from "./Navbar";
import ProcessSection from "./ProcessSection";
import Footer from "./Footer";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <>
      <Navbar />
      <div className="homepage-container">
        <main className="main-content">
          <h1 className="main-title">QuickQuiz</h1>
          <p className="main-description">
            Hệ thống trắc nghiệm thông minh<br />
            Nhanh chóng, chính xác, dễ dàng tạo và làm bài kiểm tra mọi lúc mọi nơi!
          </p>
          <Link to="/login" className="start-btn">
            Bắt đầu ngay
          </Link>
        </main>
      </div>
      <ProcessSection />
      <Footer />
    </>
  );
};

export default HomePage;
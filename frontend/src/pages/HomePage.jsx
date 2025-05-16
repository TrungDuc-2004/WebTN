import React from "react";
import "./HomePage.css";
import bgImage from "../assets/bg.png";
import Navbar from "./Navbar";
import ProcessSection from "./ProcessSection";
import Footer from "./Footer";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <>
      <Navbar />
      <div className="homepage">
        <img src={bgImage} alt="background" className="background-image" />
        <main className="main-content">
          <h1 className="main-title">ThinkFast</h1>
          <p className="main-description">
            Tạo và cung cấp các nguồn tài nguyên giáo trình theo <br />
            từng cấp độ đáp ứng nhu cầu của từng học sinh.
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

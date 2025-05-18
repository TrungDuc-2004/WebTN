import React, { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import axios from "axios";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

import "./TestResultScreen.css";
import NavbarGV from "./NavbarGV";
import Footer from "./Footer";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const TestResultScreen = () => {
  const { examId } = useParams();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/exam/${examId}`);
        setExam(res.data);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu bài kiểm tra:", err);
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
        <p>Đang tải dữ liệu bài kiểm tra...</p>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="error-screen">
        <div className="error-icon">!</div>
        <h3>Không thể tải dữ liệu bài kiểm tra</h3>
        <p>Vui lòng thử lại sau</p>
      </div>
    );
  }

  // Xử lý dữ liệu học sinh
  const studentResults = exam.results || [];

  const formatDate = (date) => new Date(date).toLocaleDateString("vi-VN");

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins > 0 ? `${mins} phút ` : ""}${secs} giây`;
  };

  // Tính phân bố điểm (0 đến 10)
  const scoreDistribution = Array(11).fill(0);
  studentResults.forEach((student) => {
    const score = Math.floor(student.score);
    if (score >= 0 && score <= 10) scoreDistribution[score]++;
  });

  const filteredScores = scoreDistribution
    .map((count, score) => ({ score, count }))
    .filter((item) => item.count > 0);

  const chartData = {
    labels: filteredScores.map((item) => `${item.score} điểm`),
    datasets: [
      {
        data: filteredScores.map((item) => item.count),
        backgroundColor: [
          "#e74c3c",
          "#f39c12",
          "#f1c40f",
          "#2ecc71",
          "#27ae60",
          "#16a085",
          "#3498db",
          "#2980b9",
          "#9b59b6",
          "#8e44ad",
          "#34495e",
        ],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          boxWidth: 12,
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      datalabels: {
        formatter: (value) => {
          const total = studentResults.length;
          const percentage = ((value / total) * 100).toFixed(1);
          return percentage > 5 ? `${percentage}%` : "";
        },
        color: "#fff",
        font: {
          weight: "bold",
          size: 12,
        },
      },
    },
    cutout: "60%",
  };

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
                <span>{formatDate(exam.createdAt)}</span>
              </div>
              <div className="test-meta">
                <span className="meta-icon">⏱️</span>
                <span>{exam.duration} phút</span>
              </div>
              <div className="test-meta highlight">
                <span className="meta-icon">👨‍🎓</span>
                <span>Số học sinh: {studentResults.length}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="tab-container">
          <div className="tab-nav">
            <NavLink
              to={`/review-test/${examId}`}
              className={({ isActive }) => `tab-item ${isActive ? "active" : ""}`}
            >
              <span className="tab-icon">📝</span>
              <span className="tab-text">Câu hỏi</span>
            </NavLink>
            <NavLink
              to={`/resulttest/${examId}`}
              className={({ isActive }) => `tab-item ${isActive ? "active" : ""}`}
            >
              <span className="tab-icon">📊</span>
              <span className="tab-text">Kết quả</span>
            </NavLink>
          </div>
        </div>

        <div className="results-section">
          <div className="students-panel">
            <h3 className="panel-title">Danh sách học sinh</h3>
            <div className="student-list">
              {studentResults.map((student, idx) => (
                <div className="student-row" key={idx}>
                  <div className="student-info">
                    <span className="student-index">{idx + 1}.</span>
                    <span className="student-name">{student.name}</span>
                  </div>
                  <div className="student-details">
                    <span className="student-time">{formatTime(student.timeSpent)}</span>
                    <span
                      className={`score-badge ${
                        student.score >= 8
                          ? "high-score"
                          : student.score >= 5
                          ? "medium-score"
                          : "low-score"
                      }`}
                    >
                      {student.score.toFixed(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="stats-panel">
            <h3 className="panel-title">Thống kê điểm</h3>
            <div className="chart-container">
              <Doughnut data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default TestResultScreen;

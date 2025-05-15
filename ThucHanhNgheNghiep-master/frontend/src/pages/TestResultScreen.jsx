import React, { useEffect, useState } from "react";
import "./TestResultScreen.css";
import NavbarGV from "./NavbarGV";
import FooterGV from "./FooterGV";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useParams, NavLink } from "react-router-dom";
import axios from "axios";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const TestResultScreen = () => {
  const { examId } = useParams();
  const [examData, setExamData] = useState(null);

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/exam/${examId}`
        );
        setExamData(response.data);
      } catch (err) {
        console.error("Error fetching exam data:", err);
      }
    };

    fetchExamData();
  }, [examId]);

  if (!examData) {
    return <div>Loading...</div>;
  }

  const studentResults = examData.results || [];

  const formatDate = (date) => {
    const d = new Date(date);
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const scoreDistribution = {
    10: studentResults.filter((item) => item.score === 10).length,
    9: studentResults.filter((item) => item.score === 9).length,
    8: studentResults.filter((item) => item.score === 8).length,
    7: studentResults.filter((item) => item.score === 7).length,
    6: studentResults.filter((item) => item.score === 6).length,
    5: studentResults.filter((item) => item.score === 5).length,
    4: studentResults.filter((item) => item.score === 4).length,
    3: studentResults.filter((item) => item.score === 3).length,
    2: studentResults.filter((item) => item.score === 2).length,
    1: studentResults.filter((item) => item.score === 1).length,
    0: studentResults.filter((item) => item.score === 0).length,
  };

  const filteredScores = Object.entries(scoreDistribution).filter(
    ([key, value]) => value > 0
  );

  const total = filteredScores.reduce((acc, [_, value]) => acc + value, 0);
  const percentages = {};
  filteredScores.forEach(([key, value]) => {
    percentages[key] = ((value / total) * 100).toFixed(1);
  });

  const chartData = {
    labels: filteredScores.map(([key]) => key),
    datasets: [
      {
        data: filteredScores.map(([_, value]) => value),
        backgroundColor: [
          "#006400",
          "#008000",
          "#3CB371",
          "#00FF7F",
          "#90EE90",
        ],
        hoverBackgroundColor: [
          "#004d00",
          "#006600",
          "#2e8b57",
          "#00cc66",
          "#7fdc7f",
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        color: "#fff",
        font: {
          weight: "bold",
          size: 14,
        },
        formatter: (value, context) => {
          const total =
            context.chart._metasets[0].total ||
            context.dataset.data.reduce((a, b) => a + b, 0);
          const percentage = (value / total) * 100;
          return `${percentage.toFixed(1)}%`;
        },
      },
    },
  };

  return (
    <>
      <NavbarGV />

      <div className="content-area">
        <div className="test-header">
          <div className="test-title">
            Tên bài KT {examData.title}{" "}
            <span className="test-subtitle">
              Ngày tạo: {formatDate(examData.createdAt)}
            </span>
          </div>
          <div className="test-stats"> Thời gian: {examData.duration} phút</div>
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

        <div className="results-section">
          <div className="students-panel">
            {studentResults.map((student, index) => (
              <div className="student-row" key={index}>
                <div className="student-details">
                  <div className="student-name">{student.name}</div>{" "}
                  <div className="student-time">
                    Thời gian làm bài:{" "}
                    {(() => {
                      const timeSpent = student.timeSpent; 
                      const minutes = Math.floor(timeSpent / 60);
                      const seconds = timeSpent % 60; 

                      if (minutes > 0) {
                        return `${minutes} phút ${seconds} giây`;
                      } else {
                        return `${seconds} giây`;
                      }
                    })()}
                  </div>
                </div>
                <div className="score-badge">{student.score}</div>
              </div>
            ))}
          </div>

          <div className="stats-panel">
            <div className="chart">
              <div className="donut-chart">
                <Doughnut
                  data={chartData}
                  options={chartOptions}
                  plugins={[ChartDataLabels]}
                />
              </div>
              <div className="chart-legend">
                <div className="chart-caption">Thống kê điểm</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FooterGV />
    </>
  );
};

export default TestResultScreen;

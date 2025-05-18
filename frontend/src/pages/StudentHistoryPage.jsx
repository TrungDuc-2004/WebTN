import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar2 from "./Navbar2";
import Footer from "./Footer";
import "./StudentHistoryPage.css";
import { toast } from "react-toastify";
import axios from "axios";

const StudentHistoryPage = () => {
  const [historyEntries, setHistoryEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const [inputSearchTerm, setInputSearchTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");

  let currentUser = null;
  const userString = localStorage.getItem("user");
  if (userString) {
    try {
      currentUser = JSON.parse(userString);
    } catch (e) {
      console.error("Lỗi parse user trong StudentHistoryPage:", e);
    }
  }

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:3000/api/results", {
          params: { userId: currentUser._id },
        });

        const data = res.data.map((result) => {
          const totalPossibleScore = result.examId.questions.reduce(
            (sum, q) => sum + (q.score || 0),
            0
          );
          return {
            _id: result._id,
            examTitle: result.examId.title,
            examCode: result.examId.code,
            dateCompleted: result.createdAt,
            score: result.score,
            totalPossibleScore,
          };
        });

        setHistoryEntries(data);
      } catch (err) {
        console.error("Lỗi khi tải lịch sử làm bài:", err);
        toast.error("Không tải được lịch sử làm bài.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(inputSearchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [inputSearchTerm]);

  const filteredEntries = historyEntries.filter((entry) => {
    const searchTermLower = searchTerm.toLowerCase();

    const matchesSearch =
      entry.examTitle.toLowerCase().includes(searchTermLower) ||
      entry.examCode.toLowerCase().includes(searchTermLower);

    const matchDate = filterDate
      ? new Date(entry.dateCompleted).toISOString().slice(0, 10) === filterDate
      : true;

    return matchesSearch && matchDate;
  });

  if (loading) {
    return (
      <>
        <Navbar2 />
        <div className="history-list-page-container loading-message">
          <p>Đang tải lịch sử...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar2 />
      <div className="history-list-page-container">
        <div className="history-header">
          <h1 className="history-list-title">Lịch Sử Bài Làm</h1>
          <p className="history-subtitle">
            Xem lại kết quả các bài kiểm tra đã hoàn thành
          </p>
        </div>

        <div className="filter-controls">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Tìm kiếm bài kiểm tra hoặc mã đề..."
              value={inputSearchTerm}
              onChange={(e) => setInputSearchTerm(e.target.value)}
            />
          </div>

          <div className="date-filter">
            <i className="far fa-calendar-alt"></i>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>

          {(inputSearchTerm || filterDate) && (
            <button
              className="clear-filter-btn"
              onClick={() => {
                setInputSearchTerm("");
                setFilterDate("");
              }}
            >
              <i className="fas fa-times"></i> Xóa bộ lọc
            </button>
          )}
        </div>

        {filteredEntries.length === 0 ? (
          <div className="empty-state">
            <img src="/images/empty-history.svg" alt="No history" />
            <h3>Không tìm thấy bài làm nào</h3>
            <p>Hãy thử điều chỉnh bộ lọc hoặc làm bài kiểm tra mới</p>
          </div>
        ) : (
          <div className="history-table-container">
            <table className="history-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên bài kiểm tra</th>
                  <th>Mã đề</th>
                  <th>Ngày làm</th>
                  <th>Điểm</th>
                  <th>Chi tiết</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map((entry, index) => (
                  <tr key={entry._id}>
                    <td>{index + 1}</td>
                    <td>
                      <div className="exam-title">
                        <i className="fas fa-file-alt"></i>
                        {entry.examTitle}
                      </div>
                    </td>
                    <td className="exam-code">{entry.examCode}</td>
                    <td>
                      <div className="exam-date">
                        <i className="far fa-calendar"></i>
                        {new Date(entry.dateCompleted).toLocaleDateString(
                          "vi-VN"
                        )}
                      </div>
                    </td>
                    <td>
                      <div
                        className={`score-badge ${
                          entry.score >= entry.totalPossibleScore * 0.8
                            ? "high-score"
                            : entry.score >= entry.totalPossibleScore * 0.5
                            ? "medium-score"
                            : "low-score"
                        }`}
                      >
                        {entry.score}/{entry.totalPossibleScore}
                      </div>
                    </td>
                    <td>
                      <Link
                        to={`/history/${entry._id}/details`}
                        className="history-view-details-button"
                      >
                        <i className="fas fa-eye"></i> Xem
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default StudentHistoryPage;

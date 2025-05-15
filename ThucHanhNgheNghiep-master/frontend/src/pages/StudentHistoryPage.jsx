// frontend/src/pages/StudentHistoryPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar2 from './Navbar2'; // Đảm bảo Navbar2.jsx ở cùng thư mục src/pages
import Footer from './Footer';   // Đảm bảo Footer.jsx ở cùng thư mục src/pages
import './StudentHistoryPage.css'; 
import { toast } from 'react-toastify';
// BỎ: import 'react-toastify/dist/ReactToastify.css'; // Đã import ở App.jsx

// Dữ liệu giả cho Lịch sử làm bài
const MOCK_USER_ID = "student123"; // ID giả của học sinh hiện tại để lọc mock data

const mockUserExamHistory = [
  { _id: "submission001", userId: "student123", examCode: "KTGK-TOAN10", examTitle: "Kiểm tra giữa kỳ Toán lớp 10", dateCompleted: "2025-05-10T10:30:00Z", score: 8, totalPossibleScore: 10 },
  { _id: "submission002", userId: "student123", examCode: "VATLY_15P_CH2", examTitle: "Vật Lý 15 phút - Chương 2", dateCompleted: "2025-05-12T14:00:00Z", score: 6, totalPossibleScore: 10 },
  { _id: "submission003", userId: "anotherStudent", examCode: "HOAHOC_HK1", examTitle: "Hóa Học HK1 - Đề A", dateCompleted: "2025-04-10T09:00:00Z", score: 9, totalPossibleScore: 10 },
  { _id: "submission004", userId: "student123", examCode: "ANHVAN_UNIT3", examTitle: "Tiếng Anh - Unit 3 Test", dateCompleted: "2025-04-20T11:00:00Z", score: 9, totalPossibleScore: 10 },
];


const StudentHistoryPage = () => {
  const [historyEntries, setHistoryEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  let currentUser = null;
  const userString = localStorage.getItem('user');
  if (userString) {
    try {
      currentUser = JSON.parse(userString);
    } catch (e) { console.error("Lỗi parse user trong StudentHistoryPage:", e); }
  }

  useEffect(() => {
    if (!currentUser || !currentUser._id) {
      // ProtectedRoute đã xử lý việc này, nhưng kiểm tra lại cho chắc
      // toast.error('Vui lòng đăng nhập để xem lịch sử.');
      // navigate('/login'); 
      return;
    }

    setLoading(true);
    // Giả lập fetch API
    setTimeout(() => {
      // Lọc và sắp xếp dữ liệu giả cho học sinh hiện tại
      // Khi có API thật, bạn sẽ dùng currentUser._id
      const userSpecificHistory = mockUserExamHistory
        .filter(entry => entry.userId === MOCK_USER_ID) 
        .sort((a, b) => new Date(b.dateCompleted) - new Date(a.dateCompleted));
      setHistoryEntries(userSpecificHistory);
      setLoading(false);
    }, 700);

  }, [currentUser?._id, navigate]); // Sử dụng currentUser?._id để tránh lỗi nếu currentUser ban đầu là null

  const formatTimeSpent = (seconds) => {
    if (isNaN(seconds) || seconds === null) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} phút ${secs < 10 ? "0" : ""}${secs} giây`;
  };

  if (loading) {
    return ( <> <Navbar2 /> <div className="history-list-page-container loading-message"><p>Đang tải lịch sử...</p></div> <Footer /> </>);
  }

  return (
    <>
      <Navbar2 />
      <div className="history-list-page-container">
        <h1 className="history-list-title">Lịch sử bài làm</h1>
        {historyEntries.length === 0 ? (
          <p className="no-history-message">Bạn chưa có bài làm nào trong lịch sử.</p>
        ) : (
          <div className="history-table-container">
            <table className="history-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên bài kiểm tra</th>
                  <th>Mã bài kiểm tra</th>
                  <th>Ngày làm</th>
                  <th>Điểm</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {historyEntries.map((entry, index) => (
                  <tr key={entry._id}>
                    <td>{index + 1}</td>
                    <td>{entry.examTitle}</td>
                    <td>{entry.examCode}</td>
                    <td>{new Date(entry.dateCompleted).toLocaleDateString('vi-VN')}</td>
                    <td>{entry.score}/{entry.totalPossibleScore}</td>
                    <td>
                      <Link to={`/history/${entry._id}/details`} className="history-view-details-button">
                        Xem chi tiết
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

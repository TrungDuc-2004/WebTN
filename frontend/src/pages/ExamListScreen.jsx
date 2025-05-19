import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "./ExamListScreen.css";
import NavbarGV from "./NavbarGV";
import Footer from "./Footer";

const ExamListScreen = () => {
  const [exams, setExams] = useState([]);
  const navigate = useNavigate();
  const { state } = useLocation();
  const teacherId = state?.teacherId || state?.userId;

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/exam", {
          params: { teacherId },
        });
        setExams(res.data);
        toast.success("Tải danh sách đề thi thành công", {
          position: "top-center",
          autoClose: 1500,
        });
      } catch (err) {
        console.error("Lỗi khi tải danh sách đề:", err);
        toast.error("Lỗi khi tải danh sách đề thi", {
          position: "top-center",
          autoClose: 2000,
        });
      }
    };

    fetchExams();
  }, [teacherId]);

  const handleCreateTestClick = () => {
    toast.info("Đang chuyển hướng đến trang tạo bài kiểm tra...", {
      position: "top-center",
      autoClose: 1000,
      onClose: () => navigate("/create-test", { state: { teacherId } }),
    });
  };

  const handleExamClick = (examId) => {
    toast.info("Đang mở bài kiểm tra...", {
      position: "top-center",
      autoClose: 1000,
      onClose: () => navigate(`/review-test/${examId}`, { state: { teacherId } }),
    });
  };

  const handleDelete = (examId) => {
    toast.info(
      <div>
        <p>Bạn có chắc muốn xoá bài kiểm tra này?</p>
        <div className="confirm-dialog-buttons">
          <button
            className="confirm-button"
            onClick={() => {
              toast.dismiss();
              confirmDelete(examId);
            }}
          >
            Xác nhận
          </button>
          <button className="cancel-button" onClick={() => toast.dismiss()}>
            Hủy
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeButton: false,
        draggable: false,
        closeOnClick: false,
      }
    );
  };

  const confirmDelete = async (examId) => {
    try {
      await axios.delete(`http://localhost:3000/api/exam/${examId}`);
      setExams(exams.filter((exam) => exam._id !== examId));
      toast.success("Đã xoá bài kiểm tra thành công", {
        position: "top-center",
        autoClose: 2000,
      });
    } catch (err) {
      console.error("Lỗi khi xoá:", err);
      toast.error(err.response?.data?.message || "Xoá bài kiểm tra thất bại", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  return (
    <>
      <NavbarGV />
      <div className="exam-list-container">
        <div className="exam-list">
          {exams.map((exam) => (
            <div key={exam._id} className="exam-item">
              <div
                className="exam-info"
                onClick={() => handleExamClick(exam._id)}
              >
                <strong>{exam.title}</strong>
                <p>
                  CODE: {exam.code}{" "}
                  <button
                    className="copy-code-button"
                    onClick={(e) => {
                      e.stopPropagation(); 
                      navigator.clipboard
                        .writeText(exam.code)
                        .then(() =>
                          toast.success("Đã sao chép mã bài kiểm tra")
                        )
                        .catch(() => toast.error("Sao chép thất bại"));
                    }}
                    title="Sao chép mã"
                  >
                    📋
                  </button>
                </p>
                <p>Thời gian: {exam.duration} phút</p>
              </div>
              <button
                className="delete-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(exam._id);
                }}
              >
                Xoá
              </button>
            </div>
          ))}
          <button className="create-button" onClick={handleCreateTestClick}>
            Tạo bài kiểm tra
          </button>
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
};

export default ExamListScreen;

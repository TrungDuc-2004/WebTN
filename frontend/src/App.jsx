// frontend/src/pages/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; // Thêm Navigate
import { ToastContainer } from 'react-toastify'; // << IMPORT
import 'react-toastify/dist/ReactToastify.css';  // << IMPORT

import HomePage from "./pages/HomePage";
import LoginForm from "./pages/LoginForm";
import Register from "./pages/Register";
import RegisterPage from "./pages/RegisterPage";
import JoinPage from "./pages/JoinPage";
import StartPage from "./pages/StartPage";
import ResultPage from "./pages/ResultPage";
import QuizPage from "./pages/QuizPage";
import UserProfile from "./pages/UserProfile";
import UserProfileGV from "./pages/UserProfileGV";
import ExamListScreen from "./pages/ExamListScreen";
import CreateTestScreen from "./pages/CreateTestScreen";
import ReviewTestScreen from "./pages/ReviewTestScreen";
import TestResultScreen from "./pages/TestResultScreen";
import ForgotPasswordScreen from "./pages/ForgotPasswordScreen";

// Import các component mới cho Lịch sử và Bảo vệ Route
import ProtectedRoute from "./pages/ProtectedRoute";        // Đảm bảo file này tồn tại ở src/pages/
import StudentHistoryPage from "./pages/StudentHistoryPage";
import StudentHistoryDetailPage from "./pages/StudentHistoryDetailPage";

import "./App.css"; // File CSS chung của App

function App() {
  return (
    <Router>
      {/* Đặt ToastContainer ở đây để dùng cho toàn bộ ứng dụng */}
      <ToastContainer
        position="top-center"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light" 
      />
      <Routes>
        {/* Các trang công khai */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register/:role" element={<Register />} />
        <Route path="/registerPage" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordScreen />} />

        {/* Các trang cần đăng nhập (bọc bởi ProtectedRoute) */}
        <Route path="/exams" element={<ProtectedRoute><ExamListScreen /></ProtectedRoute>} />
        <Route path="/create-test" element={<ProtectedRoute><CreateTestScreen /></ProtectedRoute>} />
        <Route path="/review-test/:examId" element={<ProtectedRoute><ReviewTestScreen /></ProtectedRoute>} />
        <Route path="/resulttest/:examId" element={<ProtectedRoute><TestResultScreen /></ProtectedRoute>} />
        <Route path="/student-dashboard" element={<ProtectedRoute><JoinPage /></ProtectedRoute>} />
        <Route path="/start-page" element={<ProtectedRoute><StartPage /></ProtectedRoute>} />
        <Route path="/quiz" element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
        <Route path="/teacher-dashboard" element={<ProtectedRoute><ExamListScreen /></ProtectedRoute>} />
        <Route path="/result" element={<ProtectedRoute><ResultPage /></ProtectedRoute>} />
        <Route path="/user" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path="/userGV" element={<ProtectedRoute><UserProfileGV /></ProtectedRoute>} />
        
        {/* LỊCH SỬ BÀI LÀM (CẦN ĐĂNG NHẬP) */}
        <Route 
          path="/history" 
          element={
            <ProtectedRoute>
              <StudentHistoryPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/history/:submissionId/details" 
          element={
            <ProtectedRoute>
              <StudentHistoryDetailPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Fallback route cho các đường dẫn không khớp */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
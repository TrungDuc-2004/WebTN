// frontend/src/pages/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
// import { toast } from 'react-toastify'; // Bạn có thể thêm toast nếu muốn thông báo

const ProtectedRoute = ({ children }) => {
  const userString = localStorage.getItem('user');
  let user = null;
  if (userString) {
    try {
      user = JSON.parse(userString);
    } catch (e) {
      console.error("Lỗi parse user trong ProtectedRoute:", e);
      localStorage.removeItem("user"); // Xóa nếu dữ liệu user trong localStorage bị lỗi
    }
  }

  const location = useLocation();

  if (!user) {
    // Nếu không có user, chuyển hướng đến trang login
    // toast.warn("Bạn cần đăng nhập để truy cập trang này.", { autoClose: 2000 }); // Thông báo tùy chọn
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Nếu bạn muốn kiểm tra vai trò cụ thể ở đây (ví dụ: chỉ học sinh mới vào được /history)
  // if (user.role !== 'student' && location.pathname.startsWith('/history')) {
  //   // toast.error("Bạn không có quyền truy cập trang này.");
  //   return <Navigate to="/" replace />; // Hoặc trang dashboard của vai trò tương ứng
  // }

  return children; // Nếu đã đăng nhập (và có quyền nếu kiểm tra), cho phép truy cập
};

export default ProtectedRoute;

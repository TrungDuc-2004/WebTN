import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./ForgotPasswordScreen.css";
import bgImage from "../assets/bg.png";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (newPassword !== confirmPassword) {
      setLoading(false);
      setMessage("Mật khẩu không khớp.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/reset-password",
        { email, newPassword }
      );
      setLoading(false);
      setMessage(response.data.message);

      toast.success("Mật khẩu đã được cập nhật thành công!");
    } catch (error) {
      setLoading(false);
      setMessage("Đã xảy ra lỗi, vui lòng thử lại.");
      toast.error("Đã xảy ra lỗi, vui lòng thử lại.");
    }
  };

  return (
    <div className="forgot-password-container">
      <img src={bgImage} alt="background" className="background-image1" />
      <div className="form-box">
        <h2>Đặt lại mật khẩu</h2>
        <p>Nhập email của bạn và mật khẩu mới.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Nhập email của bạn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mật khẩu mới"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Nhập lại mật khẩu mới"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
          </button>
        </form>
        {message && <p className="message">{message}</p>}
        <Link to="/login" className="back-link">
          ← Quay lại đăng nhập
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordScreen;

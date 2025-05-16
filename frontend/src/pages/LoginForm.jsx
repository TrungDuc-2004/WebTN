import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./LoginForm.css";
import bgImage from "../assets/bg.png";
import axios from "axios";

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:3000/api/user/login", {
        email: email,
        password: password,
      });
      const loggedInUser = res.data;
      const role = loggedInUser.role;
      localStorage.setItem("user", JSON.stringify(res.data));

      toast.success(
        `Đăng nhập thành công với vai trò ${
          role === "teacher" ? "giáo viên" : "học sinh"
        }!`,
        {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          onClose: () => {
            if (role === "teacher") {
              navigate("/teacher-dashboard", {
                state: { userId: loggedInUser._id },
              });
            } else if (role === "student") {
              navigate("/student-dashboard", {
                state: { userId: loggedInUser._id },
              });
            }
          },
        }
      );
    } catch (err) {
      toast.error("Sai email hoặc mật khẩu!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.error(err);
    }
  };

  return (
    <div
      className="login-wrapper"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="login-container">
        <h1 className="login-header">Đăng nhập</h1>

        <div className="input-group">
          <input
            type="email"
            placeholder="Nhập email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-group">
          <input
            type="password"
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="login-btn" onClick={handleLogin}>
          Đăng nhập
        </button>

        <div className="login-footer">
          <p>
            Bạn chưa có tài khoản? <Link to="/registerPage">Đăng ký ngay!</Link>
          </p>
        </div>
        <Link to="/forgot-password" className="forgot-link">
          Quên mật khẩu?
        </Link>
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
    </div>
  );
};

export default LoginForm;

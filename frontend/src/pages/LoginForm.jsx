import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./LoginForm.css";
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
    <div className="login-wrapper">
      <div className="login-container-lg">
        <h1 className="login-header-lg">ĐĂNG NHẬP</h1>

        <div className="input-group1">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-group1">
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="login-btn1" onClick={handleLogin}>
          Đăng nhập
        </button>

        <div className="login-footer-lg">
          <span>Chưa có tài khoản? </span>
          <Link to="/registerPage">Đăng ký ngay</Link>
        </div>
        
        <Link to="/forgot-password" className="forgot-link">
          Quên mật khẩu?
        </Link>
      </div>

      <ToastContainer />
    </div>
  );
};

export default LoginForm;
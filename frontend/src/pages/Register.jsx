import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Register.css";
import bgImage from "../assets/bg.png";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const { role } = useParams();
  const users = {
    name: "",
    email: "",
    password: "",
    passwordSecurity: "",
    role: role,
  };

  const [user, setUser] = useState(users);

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const { name, email, password, passwordSecurity } = user;

    if (!name || !email || !password || !passwordSecurity) {
      toast.error("Vui lòng điền đầy đủ thông tin.", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Email không hợp lệ.", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    if (password !== passwordSecurity) {
      toast.error("Mật khẩu không khớp. Vui lòng nhập lại.", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    try {
      await axios.post("http://localhost:3000/api/user", {
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role,
      });

      toast.success(
        `Đăng ký ${role === "teacher" ? "giáo viên" : "học sinh"} thành công!`,
        {
          position: "top-center",
          autoClose: 2000,
          onClose: () => navigate("/login"),
        }
      );
    } catch (error) {
      console.log(error);
      toast.error("Đăng ký thất bại. Vui lòng thử lại.", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  return (
    <div
      className="login-wrapper"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="login-container">
        <h1 className="login-header">
          Đăng ký {role === "teacher" ? "Giáo viên" : "Học sinh"}
        </h1>

        <div className="input-group">
          <input
            onChange={inputHandler}
            name="name"
            type="text"
            placeholder="Nhập họ tên"
          />
        </div>

        <div className="input-group">
          <input
            onChange={inputHandler}
            name="email"
            type="email"
            placeholder="Nhập email"
          />
        </div>

        <div className="input-group">
          <input
            onChange={inputHandler}
            name="password"
            type="password"
            placeholder="Nhập mật khẩu"
          />
        </div>

        <div className="input-group">
          <input
            onChange={inputHandler}
            name="passwordSecurity"
            type="password"
            placeholder="Nhập lại mật khẩu"
          />
        </div>

        <button className="login-btn" onClick={handleRegister}>
          Đăng ký
        </button>

        <div className="login-footer">
          <p>
            Bạn đã có tài khoản? <Link to="/login">Đăng nhập ngay!</Link>
          </p>
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
    </div>
  );
};

export default Register;

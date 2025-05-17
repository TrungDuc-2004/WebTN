import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <div className="navbar-container">
      <div className="navbar-content">
        <h1 className="navbar-logo">QuickQuiz</h1>
        <div className="navbar-buttons">
          <Link to="/login">
            <button className="login-button">Đăng nhập</button>
          </Link>
          <Link to="/registerpage">
            <button className="register-button">Đăng ký</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

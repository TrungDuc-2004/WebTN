import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
// chưa login
const Navbar = () => {
  return (
    <div className="navbar-container">
      <div className="navbar-content">
        <h1 className="navbar-logo">ThinkFast</h1>
        <div className="navbar-buttons">
          <Link to="/login">
            <button className="login-button">Đăng nhập</button>
          </Link>
          <Link to="/registerpage">
            <button className="register-button">Đăng Kí</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

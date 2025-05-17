import React from "react";
import { Link, useNavigate } from "react-router-dom"; 
import "./Navbar.css";                             
import userIconDefault from "../assets/user.png";    
import logoutIcon from "../assets/logout.png";      

const Navbar = () => {
  const navigate = useNavigate(); 
  const user = JSON.parse(localStorage.getItem("user"));

  let userImagePath = userIconDefault; 
  if (user && user.image) {
    if (user.image.startsWith('http') || user.image.startsWith('https://') || user.image.startsWith('/uploads/')) {
      userImagePath = user.image;
    }
  }

  const handleLogoutClick = () => {
    console.log('[Navbar Student] Logout link/button clicked.');
    localStorage.removeItem('user');
    console.log('[Navbar Student] User removed from localStorage. Link will navigate to /login.');
  };

  return (
    <div className="navbar-container"> 
      <div className="navbar-content">
        <Link to={user?.role === 'student' ? "/student-dashboard" : "/"} style={{ textDecoration: 'none' }}>
          <h1 className="navbar-logo">QuickQuiz</h1>
        </Link>
        <div className="navbar-buttons">
          <Link to="/user" className="navbar-action-link user-profile-link" title="Thông tin cá nhân">
            <img src={userImagePath} alt="User Icon" className="user-icon" />
          </Link>
          <Link
            to="/login" 
            className="navbar-action-link logout-link" 
            onClick={handleLogoutClick}      
            title="Đăng xuất"
          >
            <img src={logoutIcon} alt="Logout Icon" className="navbar-general-icon logout-icon" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
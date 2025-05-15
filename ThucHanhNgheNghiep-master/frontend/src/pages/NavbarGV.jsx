import React from "react";
import { Link, useNavigate } from "react-router-dom"; 
import "./NavbarGV.css";                       
import userGVIConDefault from "../assets/userGV.png"; 
import logoutIcon from "../assets/logout.png";     
import { toast } from 'react-toastify'; 

const NavbarGV = () => {
  const navigate = useNavigate(); 
  const user = JSON.parse(localStorage.getItem("user"));

  let userImagePath = userGVIConDefault; 
  if (user && user.image) {
    if (user.image.startsWith('http') || user.image.startsWith('https://') || user.image.startsWith('/uploads/')) {
      userImagePath = user.image;
    }
  }

  const handleLogoutClick = () => {
    console.log('[NavbarGV] Logout link/button clicked.');
    localStorage.removeItem('user');
    console.log('[NavbarGV] User removed from localStorage. Link will navigate to /login.');
    toast.info('Bạn đã đăng xuất.'); 
  };

  return (
    <div className="navbarGV-container"> 
      <div className="navbarGV-content">
        <Link to={user?.role === 'teacher' ? "/teacher-dashboard" : "/"} style={{ textDecoration: 'none' }}>
          <h1 className="navbarGV-logo">ThinkFast</h1>  
        </Link>
        <div className="navbarGV-buttons">
          <Link to="/userGV" className="navbarGV-action-link userGV-profile-link" title="Thông tin cá nhân">
            <img src={userImagePath} alt="User Icon" className="userGV-icon" />
          </Link>
          <Link
            to="/login" 
            className="navbarGV-action-link logoutGV-link" 
            onClick={handleLogoutClick}      
            title="Đăng xuất"
          >
            <img src={logoutIcon} alt="Logout Icon" className="logout-icon" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NavbarGV;
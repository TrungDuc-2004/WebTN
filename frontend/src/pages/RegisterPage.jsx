import React from "react";
import { useNavigate } from "react-router-dom"; 
import "./RegisterPage.css";
import Navbar1 from "./Navbar1";

function RegisterPage() {
  const navigate = useNavigate(); 

  const handleRoleSelection = (role) => {
    navigate(`/register/${role}`);
  };

  return (
    <>
      <Navbar1 />
      <div className="homepage">
        <div className="register-container">
          <h2 className="title1">ĐĂNG KÝ</h2>
          <div className="button-group">
            <button
              className="teacher-btn"
              onClick={() => handleRoleSelection("teacher")}
            >
              Giáo viên
            </button>
            <button
              className="student-btn"
              onClick={() => handleRoleSelection("student")}
            >
              Học sinh
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default RegisterPage;
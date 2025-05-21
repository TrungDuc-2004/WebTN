import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar2 from "./Navbar2";
import Footer from "./Footer";
import "./UserProfile.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import defaultAvatar from "../assets/user.png";

const UserProfile = () => {
  const [showEditInfo, setShowEditInfo] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [editUser, setEditUser] = useState({
    name: "",
    email: "",
    school: "",
    cccd: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);
        setEditUser({
          name: parsedUser.name || "",
          email: parsedUser.email || "",
          school: parsedUser.school || "",
          cccd: parsedUser.cccd || "",
        });
      } catch (error) {
        console.error(
          "Lỗi parse user từ localStorage trong UserProfile:",
          error
        );
        localStorage.removeItem("user");
        setCurrentUser(null);
        navigate("/login");
      }
    } else {
      console.log(
        "[UserProfile] Không tìm thấy user trong localStorage, điều hướng về /login"
      );
      navigate("/login");
    }
  }, [navigate]);

  const handleImageUpload = async (e) => {
    if (!currentUser) {
      toast.error("Vui lòng đăng nhập lại để thực hiện thao tác này.");
      return;
    }
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await axios.post(
        `http://localhost:3000/api/user/upload-avatar/${currentUser.email}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const newImage = res.data.image || res.data.avatarUrl;
      const updatedUser = { ...currentUser, image: newImage };

      setCurrentUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success("Cập nhật ảnh đại diện thành công!");
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi tải ảnh đại diện");
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error("Vui lòng đăng nhập lại để thực hiện thao tác này.");
      return;
    }
    const finalUpdate = {
      name: editUser.name.trim() || currentUser.name,
      email: editUser.email.trim() || currentUser.email,
      school: editUser.school.trim() || currentUser.school,
      cccd: editUser.cccd.trim() || currentUser.cccd,
    };

    try {
      await axios.put(
        `http://localhost:3000/api/user/${currentUser.email}`,
        finalUpdate
      );

      const updatedUser = { ...currentUser, ...finalUpdate };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);

      setShowEditInfo(false);
      toast.success("Cập nhật thông tin thành công!");
    } catch (err) {
      console.error(err);
      toast.error("Cập nhật thất bại. Vui lòng thử lại.");
    }
  };

  const handleChangePassword = async () => {
    if (!currentUser) {
      toast.error("Vui lòng đăng nhập lại để thực hiện thao tác này.");
      return;
    }
    const { oldPassword, newPassword, confirmPassword } = passwordForm;

    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu mới không khớp.");
      return;
    }

    try {
      await axios.put(`http://localhost:3000/api/user/change-password`, {
        email: currentUser.email,
        oldPassword,
        newPassword,
      });
      toast.success("Đổi mật khẩu thành công!");
      setShowChangePassword(false);
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Đổi mật khẩu thất bại.");
    }
  };

  if (!currentUser) {
    return (
      <>
        <Navbar2 />
        <div
          className="main-wrapper"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "calc(100vh - 120px)",
          }}
        >
          <p>Đang tải thông tin người dùng...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar2 />
      <div className="main-wrapper">
        <div className="profile-container">
          <div className="profile-header">
            <div className="profile-avatar-info">
              <img
                src={currentUser.image || defaultAvatar}
                alt="avatar"
                className="profile-avatar"
              />
              <div className="profile-basic-info">
                <h2>{currentUser.name}</h2>
                <p>{currentUser.email}</p>
                <p>{currentUser.cccd}</p>
                <p>{currentUser.school || "Chưa có thông tin trường học"}</p>
              </div>
            </div>
          </div>

          <div className="profile-body">
            <div className="profile-field">
              <div className="field-label">Họ tên</div>
              <div className="field-value">{currentUser.name}</div>
            </div>
            <div className="profile-field">
              <div className="field-label">Email</div>
              <div className="field-value">{currentUser.email}</div>
            </div>
            <div className="profile-field">
              <div className="field-label">CCCD</div>
              <div className="field-value">{currentUser.cccd}</div>
            </div>
            <div className="profile-field">
              <div className="field-label">Trường</div>
              <div className="field-value">
                {currentUser.school || "Chưa có thông tin"}
              </div>
            </div>

            <div className="profile-actions">
              <button
                className="profile-button"
                onClick={() => {
                  setEditUser({
                    name: currentUser.name || "",
                    email: currentUser.email || "",
                    school: currentUser.school || "",
                    cccd: currentUser.cccd || "",
                  });
                  setShowEditInfo(true);
                }}
              >
                Chỉnh sửa thông tin
              </button>
              <button
                className="profile-button"
                onClick={() => document.getElementById("avatarInput").click()}
              >
                Đổi ảnh đại diện
              </button>
              <button
                className="profile-button"
                onClick={() => setShowChangePassword(true)}
              >
                Đổi mật khẩu
              </button>
              <Link to="/history" className="profile-button history-button">
                Lịch sử bài làm
              </Link>
              <input
                type="file"
                id="avatarInput"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageUpload}
              />
            </div>
          </div>
        </div>
      </div>

      {showEditInfo && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3 className="popup-title">Chỉnh sửa thông tin</h3>
            <form className="popup-form" onSubmit={handleUpdateUser}>
              <input
                className="popup-input-field"
                type="text"
                placeholder="Họ tên"
                value={editUser.name}
                onChange={(e) =>
                  setEditUser({ ...editUser, name: e.target.value })
                }
              />
              <input
                className="popup-input-field"
                type="email"
                placeholder="Email"
                value={editUser.email}
                onChange={(e) =>
                  setEditUser({ ...editUser, email: e.target.value })
                }
              />
              <input
                className="popup-input-field"
                type="number"
                placeholder="Căn cước công dân"
                value={editUser.cccd}
                onChange={(e) =>
                  setEditUser({ ...editUser, cccd: e.target.value })
                }
              />
              <input
                className="popup-input-field"
                type="text"
                placeholder="Trường"
                value={editUser.school}
                onChange={(e) =>
                  setEditUser({ ...editUser, school: e.target.value })
                }
              />
              <div className="popup-buttons">
                <button type="submit" className="popup-button save">
                  Cập nhật
                </button>
                <button
                  type="button"
                  className="popup-button cancel"
                  onClick={() => setShowEditInfo(false)}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showChangePassword && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3 className="popup-title">Đổi mật khẩu</h3>
            <form
              className="popup-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleChangePassword();
              }}
            >
              <input
                className="popup-input-field"
                type="password"
                placeholder="Mật khẩu cũ"
                value={passwordForm.oldPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    oldPassword: e.target.value,
                  })
                }
              />
              <input
                className="popup-input-field"
                type="password"
                placeholder="Mật khẩu mới"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    newPassword: e.target.value,
                  })
                }
              />
              <input
                className="popup-input-field"
                type="password"
                placeholder="Nhập lại mật khẩu mới"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    confirmPassword: e.target.value,
                  })
                }
              />
              <div className="popup-buttons">
                <button type="submit" className="popup-button save">
                  Cập nhật
                </button>
                <button
                  type="button"
                  className="popup-button cancel"
                  onClick={() => setShowChangePassword(false)}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default UserProfile;

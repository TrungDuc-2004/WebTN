const multer = require("multer");
const path = require("path");

// Định nghĩa multer vị trí lưu file và tên file
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage }); // Tạo ra middleware cho việc upload

module.exports = upload;

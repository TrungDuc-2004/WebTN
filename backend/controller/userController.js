const User = require("../model/userModel.js");
const nodemailer = require("nodemailer");

const createUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    const { email } = newUser;

    const userExits = await User.findOne({ email });
    if (userExits) {
      return res.status(400).json({ message: "User already exists" });
    }
    const saveData = await newUser.save();
    res.status(200).json(saveData);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.password !== password) {
      return res.status(401).json({ message: "Sai mật khẩu" });
    }
    const { password: pw, ...userWithoutPass } = user._doc;
    res.status(200).json(userWithoutPass);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



const updateUserByEmail = async (req, res) => {
  const { email } = req.params;
  const updatedData = req.body;

  try {
    const user = await User.findOneAndUpdate({ email }, updatedData, {
      new: true,
    });

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng." });
    }

    const { password, ...userWithoutPass } = user._doc;
    res.status(200).json(userWithoutPass);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const uploadUserAvatar = async (req, res) => {
  const { email } = req.params;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "Không có file ảnh được gửi lên." });
  }

  const imageUrl = `http://localhost:3000/uploads/${file.filename}`;

  try {
    const user = await User.findOneAndUpdate(
      { email },
      { image: imageUrl },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng." });
    }

    const { password, ...userWithoutPass } = user._doc;
    res.status(200).json(userWithoutPass);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const changeUserPassword = async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  try {
    const user = await User.findOne({ email: email.trim() });
    console.log("chay here");
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.password !== oldPassword) {
      return res.status(401).json({ message: "Mật khẩu cũ không đúng." });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Đổi mật khẩu thành công." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy người dùng với email này." });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Mật khẩu đã được thay đổi thành công." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createUser,
  userLogin,
  updateUserByEmail,
  uploadUserAvatar,
  changeUserPassword,
  resetPassword,
};

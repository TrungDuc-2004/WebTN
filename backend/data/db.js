const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://dat261303:dat261303@webtracnghiem.0zu5xqq.mongodb.net/?retryWrites=true&w=majority&appName=WebTracNghiem"
    );
    console.log("MongoDb connected");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

module.exports = connectDb;

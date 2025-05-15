const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://dat:1234@thnn.grviak3.mongodb.net/?retryWrites=true&w=majority&appName=THNN"
    );
    console.log("MongoDb connected");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

module.exports = connectDb;

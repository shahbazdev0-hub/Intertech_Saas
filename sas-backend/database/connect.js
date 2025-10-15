// const mongoose = require("mongoose");
// const connectDB = (url) => {
//   return mongoose.connect(url);
// };
// module.exports = connectDB;
const mongoose = require("mongoose");

const connectDB = async (url) => {
  try {
    await mongoose.connect(url);
    console.log("✅ MongoDB Atlas connected successfully.");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;

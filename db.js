const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`connected to mongobd ${mongoose.connection.host}`);
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectToDb;

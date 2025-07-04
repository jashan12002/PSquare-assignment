const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb+srv://jashanphutela4u:Aman%400709rj@psquare.5kbw2ax.mongodb.net/?retryWrites=true&w=majority&appName=PSquare/hrms');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
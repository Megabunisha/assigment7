const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/social_media_app';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000, // Quick timeout for graceful fallback
    });

    isConnected = true;
    console.log(`✅ [MongoDB Connected]: ${conn.connection.host}`);
    return true;
  } catch (err) {
    isConnected = false;
    console.log(`⚠️  [MongoDB Notice]: Local MongoDB service not active or unreachable (${err.message}).`);
    console.log(`🚀 [Data Mode]: Successfully engaged High-Performance In-Memory Social Data Store with demo users & posts.`);
    console.log(`💡 To connect to MongoDB Atlas, add your URI in server/.env -> MONGO_URI`);
    return false;
  }
};

const getIsConnected = () => isConnected;

module.exports = {
  connectDB,
  getIsConnected
};

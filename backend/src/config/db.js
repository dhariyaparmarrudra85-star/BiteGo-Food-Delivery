import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.warn('⚠️  MONGO_URI not set in .env — database features will be unavailable.');
      return;
    }
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    console.warn('⚠️  Make sure MongoDB is running locally (mongod) or provide a valid MongoDB Atlas MONGO_URI in backend/.env');
    console.warn('   The server will stay up, but database queries will return errors until connected.');
  }
};

export default connectDB;

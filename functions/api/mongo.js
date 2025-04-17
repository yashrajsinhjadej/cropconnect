// /functions/api/mongo.js
import mongoose from 'mongoose';

// This is the serverless function handler
export default async function handler(req, res) {
  try {
    // Check if already connected
    if (mongoose.connections[0].readyState) {
      console.log("MongoDB already connected");
      return res.status(200).json({ message: 'Already connected to MongoDB' });
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log("Connected to MongoDB Atlas");
    res.status(200).json({ message: 'MongoDB connected successfully' });
  } catch (err) {
    console.error("Error connecting to MongoDB Atlas", err);
    res.status(500).json({ message: 'Error connecting to MongoDB', error: err });
  }
}

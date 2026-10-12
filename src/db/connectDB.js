import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const dbUri = process.env.DB_URI;

    await mongoose.connect(dbUri);

    console.log("✅ MongoDB connection established successfully");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error.message);
    process.exit(1);
  }
};

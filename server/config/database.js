import mongoose from "mongoose";

mongoose.set("strictQuery", true);
export const connectDataBase = async () => {
  const { connection } = await mongoose.connect(process.env.MONGO_URI);
  console.log(`MongoDB connected: ${connection.host}`);
};

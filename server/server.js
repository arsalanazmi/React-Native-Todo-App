import { app } from "./app.js";
import { config } from "dotenv";
import { connectDataBase } from "./config/database.js";
import cloudinary from "cloudinary";

// Handling unCaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to uncaught Exception`);

  process.exit(1);
});

config({
  path: "./config/config.env",
});

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_APPI_SECRET,
});

connectDataBase();

const server = app.listen(process.env.PORT, () => {
  console.log("Server is running on port: " + process.env.PORT);
});

// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to unhandled Promise Rejection`);

  server.close(() => {
    process.exit(1);
  });
});

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoute from "./routes/authRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

dotenv.config();
const app = express();
app.use(
  cors({
    origin: [process.env.ORIGIN],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/contacts",contactRoutes)
const port = process.env.PORT || 3001;
const databaseURL = process.env.MongoDBURI;
mongoose
  .connect(databaseURL)
  .then(() => {
    console.log("Db connection is Successfull");
  })
  .catch((err) => {
    console.log(err);
  });
const server = app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
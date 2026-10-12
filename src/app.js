import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

export const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({ message: "CadetForce API is running" });
});

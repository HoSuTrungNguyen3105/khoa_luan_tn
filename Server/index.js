import express from "express";
import bodyparser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";

// Import Routes
import AdminRoute from "./Routes/AdminRoute.js";
import AuthRoute from "./Routes/AuthRoute.js";
import UserRoute from "./Routes/UserRoute.js";
import PostRoute from "./Routes/PostRoute.js";
import AdvRoute from "./Routes/AdvRoute.js";
import MessageRoute from "./Routes/MessageRoute.js";
import { app, server } from "./lib/socket.js";
import config from "./lib/config.js";

const port = process.env.PORT || process.env.VERCEL_URL ? 10000 : 5001;
const MONGODB_URI =
  "mongodb+srv://lostnfound:k2HOMRjQjlQ4zr5t@cluster0.sxv75.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Cors configuration
app.use(
  cors({
    origin: config.baseUrl,
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  })
);

// Session configuration with MongoStore
app.use(
  session({
    secret: "56748390657848848448484747336363363636363363636",
    resave: false,
    saveUninitialized: false, // Thay đổi thành false để tối ưu hiệu suất
    store: MongoStore.create({
      mongoUrl: MONGODB_URI,
      ttl: 24 * 60 * 60, // Thời gian session tồn tại (1 ngày)
      autoRemove: "native", // Tự động xóa session hết hạn
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production", // Tự động bật secure trong production
      maxAge: 24 * 60 * 60 * 1000, // 1 ngày
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);

app.use(cookieParser());
app.use(bodyparser.json({ limit: "20mb", extended: true }));
app.use(bodyparser.urlencoded({ limit: "20mb", extended: true }));

dotenv.config();

// Database connection
mongoose.connect(MONGODB_URI).then(() => {
  server.listen(port, () => {
    console.log(`Server đang chạy trên cổng ${port}`);
    console.log(`Môi trường: ${process.env.NODE_ENV || "development"}`);
  });
});

// Routes
app.use("/api/admin", AdminRoute);
app.use("/api/auth", AuthRoute);
app.use("/api/user", UserRoute);
app.use("/api/post", PostRoute);
app.use("/api/message", MessageRoute);
app.use("/api/adv", AdvRoute);

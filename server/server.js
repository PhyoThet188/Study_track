const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

// 连接数据库
connectDB();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务 - 前端
app.use(express.static(path.join(__dirname, "../client")));
app.use(express.static(path.join(__dirname, "../client/pages")));

// API 路由
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// 健康检查
app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "StudyTrack API is running" });
});

// 所有非 API 路由返回 index.html (修复通配符问题)
app.get(/^(?!\/api).*$/, (req, res) => {
    res.sendFile(path.join(__dirname, "../client/pages/index.html"));
});

// 错误处理中间件
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(` Server is running on http://localhost:${PORT}`);
});
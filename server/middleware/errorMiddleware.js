const errorMiddleware = (err, req, res, next) => {
    console.error("Error:", err);

    const statusCode = err.statusCode || 500;
    const message = err.message || "服务器内部错误";

    res.status(statusCode).json({
        success: false,
        message,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
};

module.exports = errorMiddleware;
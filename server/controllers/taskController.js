const Task = require("../models/Task");

exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json({
            success: true,
            count: tasks.length,
            tasks,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.createTask = async (req, res) => {
    try {
        const { title, description, priority, dueDate } = req.body;

        if (!title) {
            return res.status(400).json({
                success: false,
                message: "任务标题不能为空",
            });
        }

        const task = await Task.create({
            user: req.user.id,
            title,
            description,
            priority,
            dueDate,
        });

        res.status(201).json({
            success: true,
            message: "任务创建成功",
            task,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const { title, description, priority, completed, dueDate } = req.body;
        const task = await Task.findOne({ _id: req.params.id, user: req.user.id });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "任务不存在",
            });
        }

        task.title = title || task.title;
        task.description = description !== undefined ? description : task.description;
        task.priority = priority || task.priority;
        task.completed = completed !== undefined ? completed : task.completed;
        task.dueDate = dueDate || task.dueDate;

        await task.save();

        res.json({
            success: true,
            message: "任务更新成功",
            task,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "任务不存在",
            });
        }

        res.json({
            success: true,
            message: "任务删除成功",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.toggleTask = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.user.id });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "任务不存在",
            });
        }

        task.completed = !task.completed;
        await task.save();

        res.json({
            success: true,
            message: `任务已${task.completed ? '完成' : '重新打开'}`,
            task,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
const API_URL = 'http://localhost:5000/api';

// 获取所有任务
async function fetchTasks() {
    try {
        const token = localStorage.getItem('token');
        if (!token) return [];

        const response = await fetch(`${API_URL}/tasks`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        if (data.success) {
            return data.tasks;
        }
        return [];
    } catch (error) {
        console.error('Fetch tasks error:', error);
        return [];
    }
}

// 渲染任务列表
async function renderTasks() {
    const taskList = document.getElementById('taskList');
    if (!taskList) return;

    const tasks = await fetchTasks();
    
    if (tasks.length === 0) {
        taskList.innerHTML = '<li class="task-item" style="justify-content:center;color:#718096;">暂无任务，添加一个吧！</li>';
        return;
    }

    taskList.innerHTML = tasks.map(task => `
        <li class="task-item priority-${task.priority || 'medium'}">
            <div class="task-content">
                <div class="task-title ${task.completed ? 'completed' : ''}">${task.title}</div>
                ${task.description ? `<div class="task-meta">${task.description}</div>` : ''}
                <div class="task-meta">
                    优先级: ${task.priority || 'medium'} | 
                    创建: ${new Date(task.createdAt).toLocaleDateString()}
                    ${task.dueDate ? ` | 截止: ${new Date(task.dueDate).toLocaleDateString()}` : ''}
                </div>
            </div>
            <div class="task-actions">
                <button class="btn btn-${task.completed ? 'secondary' : 'success'} btn-sm" onclick="toggleTask('${task._id}')">
                    ${task.completed ? '🔄 重做' : '✅ 完成'}
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteTask('${task._id}')">🗑️ 删除</button>
            </div>
        </li>
    `).join('');
}

// 创建任务
async function createTask() {
    const title = document.getElementById('taskTitle').value.trim();
    const description = document.getElementById('taskDescription').value.trim();
    const priority = document.getElementById('taskPriority').value;

    if (!title) {
        alert('请输入任务标题');
        return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
        alert('请先登录');
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, description, priority })
        });

        const data = await response.json();
        if (data.success) {
            document.getElementById('taskTitle').value = '';
            document.getElementById('taskDescription').value = '';
            await renderTasks();
            updateDashboardStats();
        } else {
            alert('创建任务失败: ' + data.message);
        }
    } catch (error) {
        console.error('Create task error:', error);
        alert('网络错误，请稍后重试');
    }
}

// 切换任务状态
async function toggleTask(taskId) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('请先登录');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/tasks/${taskId}/toggle`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        if (data.success) {
            await renderTasks();
            updateDashboardStats();
        }
    } catch (error) {
        console.error('Toggle task error:', error);
        alert('操作失败，请重试');
    }
}

// 删除任务
async function deleteTask(taskId) {
    if (!confirm('确定要删除这个任务吗？')) return;

    const token = localStorage.getItem('token');
    if (!token) {
        alert('请先登录');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        if (data.success) {
            await renderTasks();
            updateDashboardStats();
        }
    } catch (error) {
        console.error('Delete task error:', error);
        alert('删除失败，请重试');
    }
}

// 按回车键添加任务
document.addEventListener('DOMContentLoaded', () => {
    const taskTitle = document.getElementById('taskTitle');
    if (taskTitle) {
        taskTitle.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') createTask();
        });
    }
});

// 导出全局函数
window.createTask = createTask;
window.deleteTask = deleteTask;
window.toggleTask = toggleTask;
window.renderTasks = renderTasks;
window.fetchTasks = fetchTasks;
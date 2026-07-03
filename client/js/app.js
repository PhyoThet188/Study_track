// 任务管理功能
let tasks = [];

// 添加任务
function addTask() {
    const input = document.getElementById('taskInput');
    const taskText = input.value.trim();
    
    if (!taskText) {
        alert('请输入任务内容');
        return;
    }
    
    // 检查是否登录
    if (!checkAuth()) {
        alert('请先登录再添加任务');
        showPage('login');
        return;
    }
    
    tasks.push({
        id: Date.now(),
        text: taskText,
        completed: false,
        createdAt: new Date().toISOString()
    });
    
    input.value = '';
    renderTasks();
}

// 删除任务
function deleteTask(button) {
    const taskItem = button.parentElement;
    const taskId = parseInt(taskItem.dataset.id);
    
    tasks = tasks.filter(task => task.id !== taskId);
    renderTasks();
}

// 渲染任务列表
function renderTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    
    if (tasks.length === 0) {
        taskList.innerHTML = '<li class="task-item" style="justify-content:center;color:#718096;">暂无任务，添加一个吧！</li>';
        return;
    }
    
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.dataset.id = task.id;
        
        const span = document.createElement('span');
        span.textContent = task.text;
        if (task.completed) {
            span.style.textDecoration = 'line-through';
            span.style.color = '#a0aec0';
        }
        
        const buttonGroup = document.createElement('div');
        buttonGroup.style.display = 'flex';
        buttonGroup.style.gap = '0.5rem';
        
        // 完成/未完成切换按钮
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'btn btn-secondary btn-sm';
        toggleBtn.textContent = task.completed ? '🔄 重做' : '✅ 完成';
        toggleBtn.onclick = () => toggleTask(task.id);
        
        // 删除按钮
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-danger btn-sm';
        deleteBtn.textContent = '🗑️ 删除';
        deleteBtn.onclick = () => deleteTask(deleteBtn);
        
        buttonGroup.appendChild(toggleBtn);
        buttonGroup.appendChild(deleteBtn);
        
        li.appendChild(span);
        li.appendChild(buttonGroup);
        taskList.appendChild(li);
    });
}

// 切换任务完成状态
function toggleTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        renderTasks();
    }
}

// 按回车键添加任务
document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    if (taskInput) {
        taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addTask();
            }
        });
    }
});

// 导出功能供 HTML 使用
window.addTask = addTask;
window.deleteTask = deleteTask;
window.toggleTask = toggleTask;
window.showPage = showPage;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.logout = logout;
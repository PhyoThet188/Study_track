// 更新仪表盘统计数据
async function updateDashboardStats() {
    const tasks = await fetchTasks();
    
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;

    document.getElementById('totalTasks').textContent = total;
    document.getElementById('completedTasks').textContent = completed;
    document.getElementById('pendingTasks').textContent = pending;
}

// 初始化仪表盘
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('dashboardPage')) {
        updateDashboardStats();
    }
});

// 导出
window.updateDashboardStats = updateDashboardStats;
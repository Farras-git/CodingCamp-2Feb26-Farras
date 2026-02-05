document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todo-input');
    const descInput = document.getElementById('desc-input');
    const dateInput = document.getElementById('date-input');
    const addBtn = document.getElementById('add-btn');
    const todoList = document.getElementById('todo-list');
    const searchInput = document.getElementById('search-input');
    const deleteAllBtn = document.getElementById('delete-all-btn');
    const emptyState = document.getElementById('empty-state');
    const themeToggle = document.getElementById('theme-toggle');

    // Load Data
    let tasks = JSON.parse(localStorage.getItem('elite_tasks')) || [];

    const saveAndRender = () => {
        localStorage.setItem('elite_tasks', JSON.stringify(tasks));
        render();
    };

    const render = (data = tasks) => {
        todoList.innerHTML = '';
        
        // Update Stats
        const total = tasks.length;
        const done = tasks.filter(t => t.completed).length;
        const progress = total === 0 ? 0 : Math.round((done / total) * 100);

        document.getElementById('total-tasks').innerText = total;
        document.getElementById('completed-tasks').innerText = done;
        document.getElementById('progress-percent').innerText = `${progress}%`;

        if (data.length === 0) {
            emptyState.classList.remove('hidden');
        } else {
            emptyState.classList.add('hidden');
            data.forEach(task => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${task.id})">
                    <div class="task-info">
                        <div class="task-top">
                            <span class="task-title ${task.completed ? 'completed' : ''}">${task.text}</span>
                            <span style="font-size: 11px; font-weight: 600;">📅 ${task.date}</span>
                        </div>
                        ${task.desc ? `<p class="task-desc">${task.desc}</p>` : ''}
                        <span class="task-time">Dibuat: ${task.time}</span>
                    </div>
                    <button class="btn-del" onclick="deleteTask(${task.id})">×</button>
                `;
                todoList.appendChild(li);
            });
        }
    };

    // Add Task
    addBtn.addEventListener('click', () => {
        const text = todoInput.value.trim();
        const desc = descInput.value.trim();
        const date = dateInput.value;
        
        if (!text || !date) {
            alert("Isi nama tugas dan tanggal!");
            return;
        }

        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        tasks.unshift({ id: Date.now(), text, desc, date, time: timeStr, completed: false });
        todoInput.value = '';
        descInput.value = '';
        saveAndRender();
    });

    // Toggle & Delete (Global)
    window.toggleTask = (id) => {
        tasks = tasks.map(t => t.id === id ? {...t, completed: !t.completed} : t);
        saveAndRender();
    };

    window.deleteTask = (id) => {
        tasks = tasks.filter(t => t.id !== id);
        saveAndRender();
    };

    // Fix Delete All
    deleteAllBtn.addEventListener('click', () => {
        if (tasks.length > 0 && confirm("Hapus semua tugas?")) {
            tasks = [];
            saveAndRender();
        }
    });

    // Filter
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = tasks.filter(t => t.text.toLowerCase().includes(term));
        render(filtered);
    });

    // Theme Logic
    themeToggle.addEventListener('change', () => {
        const mode = themeToggle.checked ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', mode);
        localStorage.setItem('elite_theme', mode);
    });

    // Init Theme & Data
    const savedTheme = localStorage.getItem('elite_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeToggle.checked = savedTheme === 'dark';
    render();
});
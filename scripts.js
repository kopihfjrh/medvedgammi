document.addEventListener('DOMContentLoaded', () => {
    // Set current date
    const dateElement = document.getElementById('currentDate');
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateElement.textContent = new Date().toLocaleDateString('en-US', options);

    // Load tasks, groceries, and cleaning tasks from localStorage
    loadTasks();
    loadGroceries();
    loadCleaningTasks();

    // Task List functionality
    document.getElementById('taskInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    document.getElementById('groceryInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addGrocery();
        }
    });

    // Search functionality
    document.getElementById('searchInput').addEventListener('input', showSuggestions);
});

function addTask() {
    const input = document.getElementById('taskInput');
    if (input.value.trim() !== '') {
        const list = document.getElementById('taskList');
        const li = document.createElement('li');
        li.className = 'task-item';
        li.innerHTML = `
            <input type="checkbox" onchange="saveTasks()">
            <span>${input.value}</span>
        `;
        list.appendChild(li);
        input.value = '';
        saveTasks();
    }
}

function addGrocery() {
    const input = document.getElementById('groceryInput');
    if (input.value.trim() !== '') {
        const list = document.getElementById('groceryList');
        const li = document.createElement('li');
        li.className = 'grocery-item';
        li.innerHTML = `
            <input type="checkbox" onchange="saveGroceries()">
            <span>${input.value}</span>
        `;
        list.appendChild(li);
        input.value = '';
        saveGroceries();
    }
}

function addCleaningTask(day) {
    const input = document.getElementById(`${day}Input`);
    if (input.value.trim() !== '') {
        const list = document.getElementById(`${day}List`);
        const li = document.createElement('li');
        li.className = 'cleaning-item';
        const date = new Date().toLocaleDateString('en-US');
        li.innerHTML = `
            <input type="checkbox" onchange="saveCleaningTasks()">
            <span>${input.value}</span>
            <small>${date}</small>
        `;
        list.appendChild(li);
        input.value = '';
        saveCleaningTasks();
    }
}

function saveTasks() {
    const tasks = [];
    document.querySelectorAll('.task-item').forEach(item => {
        tasks.push({
            text: item.querySelector('span').textContent,
            completed: item.querySelector('input[type="checkbox"]').checked
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const list = document.getElementById('taskList');
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="saveTasks()">
            <span>${task.text}</span>
        `;
        list.appendChild(li);
    });
}

function saveGroceries() {
    const groceries = [];
    document.querySelectorAll('.grocery-item').forEach(item => {
        groceries.push({
            text: item.querySelector('span').textContent,
            completed: item.querySelector('input[type="checkbox"]').checked
        });
    });
    localStorage.setItem('groceries', JSON.stringify(groceries));
}

function loadGroceries() {
    const groceries = JSON.parse(localStorage.getItem('groceries')) || [];
    const list = document.getElementById('groceryList');
    groceries.forEach(grocery => {
        const li = document.createElement('li');
        li.className = 'grocery-item';
        li.innerHTML = `
            <input type="checkbox" ${grocery.completed ? 'checked' : ''} onchange="saveGroceries()">
            <span>${grocery.text}</span>
        `;
        list.appendChild(li);
    });
}

function saveCleaningTasks() {
    const cleaningTasks = {};
    document.querySelectorAll('.cleaning-list').forEach(list => {
        const day = list.id.replace('List', '');
        cleaningTasks[day] = [];
        list.querySelectorAll('.cleaning-item').forEach(item => {
            cleaningTasks[day].push({
                text: item.querySelector('span').textContent,
                date: item.querySelector('small').textContent,
                completed: item.querySelector('input[type="checkbox"]').checked
            });
        });
    });
    localStorage.setItem('cleaningTasks', JSON.stringify(cleaningTasks));
}

function loadCleaningTasks() {
    const cleaningTasks = JSON.parse(localStorage.getItem('cleaningTasks')) || {};
    Object.keys(cleaningTasks).forEach(day => {
        const list = document.getElementById(`${day}List`);
        cleaningTasks[day].forEach(task => {
            const li = document.createElement('li');
            li.className = 'cleaning-item';
            li.innerHTML = `
                <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="saveCleaningTasks()">
                <span>${task.text}</span>
                <small>${task.date}</small>
            `;
            list.appendChild(li);
        });
    });
}

function performSearch() {
    const query = document.getElementById('searchInput').value;
    if (query.trim() !== '') {
        window.open(`https://www.google.com/search?q=${query}`, '_blank');
    }
}

function showSuggestions() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const suggestions = document.getElementById('suggestions');
    suggestions.innerHTML = '';

    if (query.trim() !== '') {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const groceries = JSON.parse(localStorage.getItem('groceries')) || [];
        const cleaningTasks = JSON.parse(localStorage.getItem('cleaningTasks')) || {};

        const allItems = [
            ...tasks.map(task => task.text),
            ...groceries.map(grocery => grocery.text),
            ...Object.values(cleaningTasks).flat().map(task => task.text)
        ];

        const filteredItems = allItems.filter(item => item.toLowerCase().includes(query));

        filteredItems.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            li.onclick = () => {
                document.getElementById('searchInput').value = item;
                suggestions.innerHTML = '';
            };
            suggestions.appendChild(li);
        });
    }
}

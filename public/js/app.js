// Global State
const state = {
  token: localStorage.getItem('token') || null,
  user: JSON.parse(localStorage.getItem('user')) || null,
  currentProject: null,
  currentTask: null,
};

// DOM Elements
const views = {
  auth: document.getElementById('auth-view'),
  dashboard: document.getElementById('dashboard-view'),
  project: document.getElementById('project-view'),
};

const elements = {
  userGreeting: document.getElementById('user-greeting'),
  projectsGrid: document.getElementById('projects-grid'),
  projectTitle: document.getElementById('project-title'),
  projectDesc: document.getElementById('project-desc'),
  kanbanCols: {
    'To Do': document.getElementById('col-todo').querySelector('.kanban-cards'),
    'In Progress': document.getElementById('col-inprogress').querySelector('.kanban-cards'),
    'Done': document.getElementById('col-done').querySelector('.kanban-cards'),
  },
  modals: {
    createProject: document.getElementById('create-project-modal'),
    addTask: document.getElementById('add-task-modal'),
    taskDetails: document.getElementById('task-details-modal'),
  },
  commentsList: document.getElementById('comments-list'),
};

// Utility function to switch views
function showView(viewName) {
  Object.values(views).forEach(view => {
    view.classList.add('hidden');
    view.classList.remove('active');
  });
  views[viewName].classList.remove('hidden');
  views[viewName].classList.add('active');
}

// API Helper
async function apiCall(endpoint, method = 'GET', body = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (state.token) headers['Authorization'] = `Bearer ${state.token}`;

  const config = { method, headers };
  if (body) config.body = JSON.stringify(body);

  const response = await fetch(`/api${endpoint}`, config);
  const data = await response.json();
  
  if (!response.ok) throw new Error(data.message || 'API Error');
  return data;
}

// Initialization
function init() {
  if (state.token) {
    showView('dashboard');
    elements.userGreeting.innerText = `Hello, ${state.user.username}`;
    loadProjects();
  } else {
    showView('auth');
  }
}

// --- Auth Logic ---
document.getElementById('show-register').addEventListener('click', () => {
  document.getElementById('login-form-container').classList.add('hidden');
  document.getElementById('register-form-container').classList.remove('hidden');
});

document.getElementById('show-login').addEventListener('click', () => {
  document.getElementById('register-form-container').classList.add('hidden');
  document.getElementById('login-form-container').classList.remove('hidden');
});

document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    const data = await apiCall('/auth/login', 'POST', { email, password });
    handleAuthSuccess(data);
  } catch (error) {
    alert(error.message);
  }
});

document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('reg-username').value;
  const email = document.getElementById('reg-email').value;
  const password = document.getElementById('reg-password').value;

  try {
    const data = await apiCall('/auth/register', 'POST', { username, email, password });
    handleAuthSuccess(data);
  } catch (error) {
    alert(error.message);
  }
});

function handleAuthSuccess(data) {
  state.token = data.token;
  state.user = data;
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data));
  
  elements.userGreeting.innerText = `Hello, ${state.user.username}`;
  showView('dashboard');
  loadProjects();
}

document.getElementById('logout-btn').addEventListener('click', () => {
  state.token = null;
  state.user = null;
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  showView('auth');
});

// --- Dashboard Logic ---
async function loadProjects() {
  try {
    const projects = await apiCall('/projects');
    elements.projectsGrid.innerHTML = '';
    
    projects.forEach(project => {
      const card = document.createElement('div');
      card.className = 'project-card';
      card.innerHTML = `
        <h3>${project.title}</h3>
        <p>${project.description.substring(0, 100)}...</p>
      `;
      card.addEventListener('click', () => openProject(project));
      elements.projectsGrid.appendChild(card);
    });
  } catch (error) {
    console.error(error);
  }
}

// Modal Handlers
document.querySelectorAll('.close-modal').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.target.closest('.modal').classList.add('hidden');
  });
});

document.getElementById('show-create-project-modal').addEventListener('click', () => {
  elements.modals.createProject.classList.remove('hidden');
});

document.getElementById('create-project-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('project-title-input').value;
  const description = document.getElementById('project-desc-input').value;

  try {
    await apiCall('/projects', 'POST', { title, description });
    elements.modals.createProject.classList.add('hidden');
    e.target.reset();
    loadProjects();
  } catch (error) {
    alert(error.message);
  }
});

// --- Project View Logic ---
document.getElementById('back-to-dashboard').addEventListener('click', () => {
  state.currentProject = null;
  showView('dashboard');
});

async function openProject(project) {
  state.currentProject = project;
  elements.projectTitle.innerText = project.title;
  elements.projectDesc.innerText = project.description;
  
  // Join socket room
  if (window.joinProjectRoom) {
    window.joinProjectRoom(project._id);
  }

  showView('project');
  loadTasks();
}

async function loadTasks() {
  if (!state.currentProject) return;

  try {
    const tasks = await apiCall(`/tasks/project/${state.currentProject._id}`);
    
    // Clear columns
    Object.values(elements.kanbanCols).forEach(col => col.innerHTML = '');

    tasks.forEach(task => renderTask(task));
  } catch (error) {
    console.error(error);
  }
}

function renderTask(task) {
  const col = elements.kanbanCols[task.status];
  if (!col) return;

  // Remove existing if updating
  const existingCard = document.getElementById(`task-${task._id}`);
  if (existingCard) {
    existingCard.remove();
  }

  const card = document.createElement('div');
  card.className = 'task-card';
  card.id = `task-${task._id}`;
  card.innerHTML = `
    <h4>${task.title}</h4>
    <p>${task.description || 'No description'}</p>
  `;
  card.addEventListener('click', () => openTaskDetails(task));
  col.appendChild(card);
}

// Global hook for socket to update a task in real-time
window.updateTaskInUI = renderTask;

// Add Task
document.getElementById('show-add-task-modal').addEventListener('click', () => {
  elements.modals.addTask.classList.remove('hidden');
});

document.getElementById('add-task-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('task-title-input').value;
  const description = document.getElementById('task-desc-input').value;

  try {
    const task = await apiCall('/tasks', 'POST', { 
      title, 
      description, 
      project: state.currentProject._id 
    });
    // Task will be rendered via socket event, or we can render manually
    renderTask(task);
    elements.modals.addTask.classList.add('hidden');
    e.target.reset();
  } catch (error) {
    alert(error.message);
  }
});

// --- Task Details & Comments ---
async function openTaskDetails(task) {
  state.currentTask = task;
  
  document.getElementById('modal-task-title').innerText = task.title;
  document.getElementById('modal-task-desc').innerText = task.description || 'No description';
  document.getElementById('modal-task-status').value = task.status;

  elements.modals.taskDetails.classList.remove('hidden');
  loadComments();
}

document.getElementById('modal-task-status').addEventListener('change', async (e) => {
  if (!state.currentTask) return;
  const newStatus = e.target.value;

  try {
    const updatedTask = await apiCall(`/tasks/${state.currentTask._id}`, 'PUT', { status: newStatus });
    state.currentTask = updatedTask;
    renderTask(updatedTask);
  } catch (error) {
    console.error(error);
  }
});

async function loadComments() {
  if (!state.currentTask) return;
  
  try {
    const comments = await apiCall(`/comments/task/${state.currentTask._id}`);
    elements.commentsList.innerHTML = '';
    comments.forEach(comment => renderComment(comment));
  } catch (error) {
    console.error(error);
  }
}

function renderComment(comment) {
  const div = document.createElement('div');
  div.className = 'comment';
  div.innerHTML = `
    <div class="comment-author">${comment.author.username}</div>
    <div class="comment-text">${comment.text}</div>
  `;
  elements.commentsList.appendChild(div);
  elements.commentsList.scrollTop = elements.commentsList.scrollHeight;
}

// Global hook for socket to add a comment in real-time
window.addCommentToUI = (comment) => {
  if (state.currentTask && state.currentTask._id === comment.task) {
    renderComment(comment);
  }
};

document.getElementById('add-comment-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const textInput = document.getElementById('comment-text-input');
  const text = textInput.value;

  if (!text || !state.currentTask) return;

  try {
    const comment = await apiCall('/comments', 'POST', {
      text,
      task: state.currentTask._id
    });
    // Will be rendered via socket event, but also manually
    renderComment(comment);
    textInput.value = '';
  } catch (error) {
    console.error(error);
  }
});

// Start the app
init();

const socket = io();

// Join project room function exposed to app.js
window.joinProjectRoom = (projectId) => {
  socket.emit('joinProject', projectId);
};

// Listen for task events
socket.on('taskCreated', (task) => {
  if (window.updateTaskInUI) {
    window.updateTaskInUI(task);
  }
});

socket.on('taskUpdated', (task) => {
  if (window.updateTaskInUI) {
    window.updateTaskInUI(task);
  }
});

socket.on('taskDeleted', (taskId) => {
  const card = document.getElementById(`task-${taskId}`);
  if (card) {
    card.remove();
  }
});

// Listen for comment events
socket.on('commentAdded', (comment) => {
  if (window.addCommentToUI) {
    window.addCommentToUI(comment);
  }
});

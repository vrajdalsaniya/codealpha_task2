const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Get all tasks for a project
// @route   GET /api/tasks/project/:projectId
// @access  Private
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId })
      .populate('assignedTo', 'username email');
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res) => {
  try {
    const { title, description, status, project, assignedTo } = req.body;

    const task = await Task.create({
      title,
      description,
      status: status || 'To Do',
      project,
      assignedTo: assignedTo || null,
    });

    const populatedTask = await Task.findById(task._id).populate('assignedTo', 'username email');

    // Emit event to room
    req.io.to(project).emit('taskCreated', populatedTask);

    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update task status or assignment
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res) => {
  try {
    const { title, description, status, assignedTo } = req.body;

    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    if (assignedTo !== undefined) task.assignedTo = assignedTo;

    await task.save();

    task = await Task.findById(req.params.id).populate('assignedTo', 'username email');

    // Emit event to room
    req.io.to(task.project.toString()).emit('taskUpdated', task);

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const projectId = task.project.toString();
    const taskId = task._id;

    await task.deleteOne();

    // Emit event to room
    req.io.to(projectId).emit('taskDeleted', taskId);

    res.status(200).json({ message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

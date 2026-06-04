const Comment = require('../models/Comment');
const Task = require('../models/Task');

// @desc    Get comments for a task
// @route   GET /api/comments/task/:taskId
// @access  Private
exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ task: req.params.taskId })
      .populate('author', 'username email')
      .sort({ createdAt: 1 }); // Oldest to newest
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a comment
// @route   POST /api/comments
// @access  Private
exports.addComment = async (req, res) => {
  try {
    const { text, task } = req.body;

    const taskObj = await Task.findById(task);
    if (!taskObj) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const comment = await Comment.create({
      text,
      task,
      author: req.user.id,
    });

    const populatedComment = await Comment.findById(comment._id).populate('author', 'username email');

    // Emit event to room (project id)
    req.io.to(taskObj.project.toString()).emit('commentAdded', populatedComment);

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

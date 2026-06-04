const express = require('express');
const router = express.Router();
const { getProjects, createProject, getProject, addMember } = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getProjects)
  .post(protect, createProject);

router.route('/:id')
  .get(protect, getProject);

router.route('/:id/members')
  .put(protect, addMember);

module.exports = router;

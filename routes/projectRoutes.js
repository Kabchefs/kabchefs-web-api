const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const projectConrtoller = require('../controllers/projectController');

router.get('/projects');
router.get('/project/:projectId');
router.post('/project');
router.put('/project/:projectId');
router.delete('/project/:projectId');

module.exports = router;
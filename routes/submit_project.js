const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const projectConrtoller = require('../controllers/submit_project');

router.get('/submit_projects', userController.allowIfLoggedin, userController.grantAccess('readAny', 'submit_project'), projectConrtoller.get_submitProjects);

router.get('/subit_projects/:projectId', userController.allowIfLoggedin, userController.grantAccess('readAny', 'submit_project'), projectConrtoller.get_submitProject);

router.post('/submit_projects', projectConrtoller.post_submitProject);

module.exports = router;
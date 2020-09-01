const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const projectConrtoller = require('../controllers/submit_project');

router.get('/', userController.allowIfLoggedin, userController.grantAccess('readAny', 'submit_project'), projectConrtoller.get_submitProjects);

router.get('/:projectId', userController.allowIfLoggedin, userController.grantAccess('readAny', 'submit_project'), projectConrtoller.get_submitProject);

router.post('/', projectConrtoller.post_submitProject);

module.exports = router;
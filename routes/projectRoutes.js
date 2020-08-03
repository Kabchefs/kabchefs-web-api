const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const projectConrtoller = require('../controllers/projectController');

router.get('/projects', userController.allowIfLoggedin, userController.grantAccess('readAny', 'project'), projectConrtoller.getProjects);

router.get('/project/:projectId', userController.allowIfLoggedin, userController.grantAccess('readAny', 'project'), projectConrtoller.getProject);

router.post('/project', userController.allowIfLoggedin, userController.grantAccess('createAny', 'project'), projectConrtoller.postProject);

router.put('/project/:projectId', userController.allowIfLoggedin, userController.grantAccess('updateAny'), 'project', projectConrtoller.updateProject);

router.delete('/project/:projectId', userController.allowIfLoggedin, userController.grantAccess('deleteAny', 'project'), projectConrtoller.deleteProject);

router.get('/submit_projects', userController.allowIfLoggedin, userController.grantAccess('readAny', 'submit_project'), projectConrtoller.get_submitProjects);

router.get('/subit_project/:projectId', userController.allowIfLoggedin, userController.grantAccess('readAny', 'submit_project'), projectConrtoller.get_submitProject);

router.post('/submit_project', userController.allowIfLoggedin, userController.grantAccess('createAny', 'submit_project'), projectConrtoller.post_submitProject);


module.exports = router;
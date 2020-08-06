// server/routes/route.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const projectController = require('../controllers/project');
//Firebase storage
const Firebase = require('firebase-admin');
const Multer = require('multer');

var bucket = Firebase.storage().bucket();

route.use(function(req, res, next) {
    if (!req.Firebase) {
        req.Firebase = Firebase;
    }
    if (!req.bucket) {
        req.bucket = bucket;
    }
    next();
});


const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // no larger than 5 mb, you can change as needed.
    }
});



router.get('/projects', userController.allowIfLoggedin, userController.grantAccess('readAny', 'project'), projectConrtoller.getProjects);

router.get('/projects/:projectId', userController.allowIfLoggedin, userController.grantAccess('readAny', 'project'), projectConrtoller.getProject);

router.post('/projects', userController.allowIfLoggedin, userController.grantAccess('createAny', 'project'), multer.single("file"), projectConrtoller.postProject);

router.put('/projects/:projectId', userController.allowIfLoggedin, userController.grantAccess('updateAny', 'project'), projectConrtoller.updateProject);

router.delete('/projects/:projectId', userController.allowIfLoggedin, userController.grantAccess('deleteAny', 'project'), projectConrtoller.deleteProject);

module.exports = router;
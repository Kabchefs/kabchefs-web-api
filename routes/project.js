// server/routes/route.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const projectController = require('../controllers/project');
//Firebase storage
const Firebase = require('firebase-admin');
const Multer = require('multer');

var bucket = Firebase.storage().bucket();

router.use(function(req, res, next) {
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



router.get('/', userController.allowIfLoggedin, userController.grantAccess('readAny', 'project'), projectController.getProjects);

router.get('/:projectId', userController.allowIfLoggedin, userController.grantAccess('readAny', 'project'), projectController.getProject);

router.post('/', userController.allowIfLoggedin, userController.grantAccess('createAny', 'project'), multer.single("file"), projectController.postProject);

router.put('/:projectId', userController.allowIfLoggedin, userController.grantAccess('updateAny', 'project'), projectController.updateProject);

router.delete('/:projectId', userController.allowIfLoggedin, userController.grantAccess('deleteAny', 'project'), projectController.deleteProject);

module.exports = router;
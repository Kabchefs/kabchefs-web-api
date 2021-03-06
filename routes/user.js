// server/routes/route.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
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



router.get('/users/:userId', userController.allowIfLoggedin, userController.getUser);

router.get('/users', userController.allowIfLoggedin, userController.grantAccess('readAny', 'profile'), userController.getUsers);

router.put('/users/:userId', userController.allowIfLoggedin, userController.grantAccess('updateAny', 'profile'), multer.single("file"), userController.updateUser);

router.delete('/users/:userId', userController.allowIfLoggedin, userController.grantAccess('deleteAny', 'profile'), userController.deleteUser);

module.exports = router;
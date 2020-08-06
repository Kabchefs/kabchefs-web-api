// server/routes/route.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const certiController = require('../controllers/certificates');
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



router.get('/certificates', userController.allowIfLoggedin, userController.grantAccess('readAny', 'certificate'), certiController.getCertificates);

router.put('/certificates/:certiId', userController.allowIfLoggedin, userController.grantAccess('readAny', 'certificate'), certiController.getCertificate);

router.post('/certificates', userController.allowIfLoggedin, userController.grantAccess('createAny', 'certificate'), multer.single("file"), certiController.postCertificate);

module.exports = router;
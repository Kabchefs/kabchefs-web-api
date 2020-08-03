const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const certiConrtoller = require('../controllers/certiController');

router.get('/certis', userController.allowIfLoggedin, userController.grantAccess('readAny', 'certi'), certiConrtoller.getCertificates);

router.get('/certi/:certiId', userController.allowIfLoggedin, userController.grantAccess('readAny', 'certi'), certiConrtoller.getCertificate);

router.post('/certi', userController.allowIfLoggedin, userController.grantAccess('readAny', 'certi'), certiConrtoller.postCertificate);


module.exports = router;